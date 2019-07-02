<style scoped>
.list-icon {
  padding-right: 20px;
}
</style>

<template>
<v-list>
  <template v-for="(value, name, index) in vc">
    <v-list-tile avatar>
      <v-icon class="list-icon">
        {{mapNameToIcon(name)}}
      </v-icon>
      <v-list-tile-content>
        <v-list-tile-sub-title>{{mapNameToExpandedName(name)}}</v-list-tile-sub-title>
        <v-list-tile-title v-if="name!='csu'">{{value}}</v-list-tile-title>
        
        <!-- <v-treeview v-model="tree" :open="open" :items="vc" activatable item-key="name" open-on-click>
        <template v-slot:prepend="{ item, open }">
        <v-icon v-if="!item.file">
        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
      </v-icon>
      <v-icon v-else>
      {{ files[item.file] }}
    </v-icon>
  </template>
</v-treeview> -->
      </v-list-tile-content>
    </v-list-tile>
    <v-divider v-if="index != Object.keys(vc).length - 1"></v-divider>
</template>
</v-list>

</template>

<script>
export default {
  props: {
    vc: {
      type: Object,
      required: true,
    }
  },
  data: () => ({
    vc_items: [],
    open: ['public'],
    files: {
      html: 'mdi-language-html5',
      js: 'mdi-nodejs',
      json: 'mdi-json',
      md: 'mdi-markdown',
      pdf: 'mdi-file-pdf',
      png: 'mdi-file-image',
      txt: 'mdi-file-document-outline',
      xls: 'mdi-file-excel'
    },
    tree: [],
    items: [{
        name: '.git'
      },
      {
        name: 'node_modules'
      },
      {
        name: 'public',
        children: [{
            name: 'static',
            children: [{
              name: 'logo.png',
              file: 'png'
            }]
          },
          {
            name: 'favicon.ico',
            file: 'png'
          },
          {
            name: 'index.html',
            file: 'html'
          }
        ]
      }
    ]
  }),
  methods: {
    mapNameToIcon: function(name) {
      switch (name) {
        case 'iat':
          return 'schedule'
          break;
        case 'iss':
          return 'gavel'
          break;
        case 'sub':
          return 'perm_identity'
          break;
        default:
          return 'error_outline'
      }
    },
    mapNameToExpandedName: function(name) {
      switch (name) {
        case 'iat':
          return 'Issue Date'
          break;
        case 'iss':
          return 'Issuer'
          break;
        case 'csu':
          return 'Credential Subject'
          break
        default:
          return name
      }
    },
    csuToItems: function(csu) {
      // TODO in order to have them browsable with the treeview
    }
  }
}
</script>
