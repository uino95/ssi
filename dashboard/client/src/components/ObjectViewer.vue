<template>
<v-flex>
  <v-treeview v-model="selections" :open.sync="open" :items="items" item-key="name" :selectable="needHash" return-object>
    <template v-slot:prepend="{ item, open }">
      <v-icon v-if="!item.children">
      </v-icon>
    </template>
  </v-treeview>
  <v-btn v-if="needHash" v-on:click="returnObject"> Hash it </v-btn>
</v-flex>
</template>
<script>
import sha256 from 'js-sha256'
import _ from 'lodash'
export default {
  props: {
    obj: {
      type: Object,
      required: true,
    },
    objName: {
      type: String,
      required: true
    },
    needHash: Boolean
  },
  data: () => ({
    open: [],
    selections: [],
    id: 0,
    counter: 0,
    selected: [],
    hashed: [],
  }),
  computed: {
    items() {
      return [{
        id: this.id,
        name: this.objName,
        key: this.objName,
        children: this.getChildren(this.obj)
      }]
    },
  },
  watch: {
    selections: function(selections) {
      let tree = [...this.selections];
      // Filter tree with only parents of selections
      tree = tree.filter(elem => {
        for (let i = 0; i < tree.length; i++) {
          // Skip current element
          if (tree[i].name === elem.name) continue;

          // Check only elements with childrens
          if (tree[i].children) {
            let item = this.findTreeItem([tree[i]], elem.name);
            // If current element is a children of another element, exclude from result
            if (item) {
              return false;
            }
          }
        }
        return true;
      });
      this.selected = tree;
    }
  },
  methods: {
    findTreeItem(items, name) {
      if (!items) {
        return;
      }
      for (const item of items) {
        // Test current object
        if (item.name === name) {
          return item;
        }

        // Test children recursively
        const child = this.findTreeItem(item.children, name);
        if (child) {
          return child;
        }
      }
    },
    getChildren(obj) {
      var children = []
      for (var key in obj) {
        this.id++;
        var value = obj[key]
        if (value instanceof Object) {
          children.push({
            id: this.id,
            name: key,
            key: key,
            children: this.getChildren(value)
          })
        } else {
          children.push({
            id: this.id,
            name: key + ': ' + value,
            key: key,
            value: value,
          })
        }
      }
      return children
    },
    hashItems(elements, items) {
      elements.map(el => {
        items.map(item => {
          if (el.id === item.id) {
            if (el.children) {
              this.$store.commit('updateData', JSON.stringify(this.convertToObject(el.children)))
              item.value = '<?d' + this.counter + '?>'
            } else {
              this.$store.commit('updateData', el.value)
              item.value = '<?d' + this.counter + '?>'
            }
            this.counter++;
          } else if (item.children) {
            this.hashItems([el], item.children)
          }
        })
      })
    },
    convertToObject(array) {
      var obj = {}
      array.map(el => {
        if (el.children && !el.value) {
          obj[el.name] = this.convertToObject(el.children)
        } else {
          obj[el.key] = el.value;
        }
      })
      return obj;
    },
    returnObject: function() {
      this.$store.commit('deleteData')
      this.counter = 0
      this.hashed = _.cloneDeep(this.items)
      this.hashItems(this.selected, this.hashed)
      const cred = this.convertToObject(this.hashed)
      this.$store.commit('updateVC', cred.credential)
    }
  }

}
</script>
