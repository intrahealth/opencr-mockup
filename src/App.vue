<template>
  <v-app>
    <v-app-bar app color="primary" dark clipped-right>
      <v-toolbar-title class="display-1">Open Client Registry</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn color="primary" to="/">
          <v-icon>mdi-home</v-icon> Home
        </v-btn>
        <v-btn color="primary">
          <v-icon>mdi-view-dashboard</v-icon> Dashboard
        </v-btn>
        <v-btn color="primary" to="/review">
          <v-badge color="error" content="3" >
          <v-icon>mdi-alert</v-icon> Action Required
          </v-badge>
        </v-btn>
        <v-btn color="primary" to="/csvreport">
          <v-icon>mdi-file-chart</v-icon> CSV Reports
        </v-btn>
         <v-btn color="primary">
          <v-icon>mdi-account-plus</v-icon> Add User
        </v-btn>
        <v-btn color="primary">
          <v-icon>mdi-logout</v-icon> Logout
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

  </v-app>
</template>

<script>

export default {
  name: "App",

  components: {
  },

  data: () => ({
    //
  })
};
</script>
