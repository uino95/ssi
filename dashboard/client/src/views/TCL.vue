<template>
<v-flex>
  <v-flex>
    <core-hosted-by-card title="Trusted Contacts List"/>
  </v-flex>
  <v-flex>
    <v-list>
      <v-list-group v-for="item in credentials" :key="item.key" v-model="item.icon" :prepend-icon="item.icon" no-action>
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>

        <v-list-tile @click="">
          HERE
        </v-list-tile>
      </v-list-group>
    </v-list>
  </v-flex>
</v-flex>
</template>

<script>
export default {
  data: () => ({
    credentials: [{
      key: 0,
      icon: 'local_activity',
      title: 'Person',
      vc: {
        iat: '24387253',
        iss: '3984324',
        csu: '{ewjfwljf weljfoiew}'
      },
    }]
  }),
  methods: {

  }
}
</script>
