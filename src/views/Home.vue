<template>
    <v-card>
    <v-card-title>
      Client Registry
      <v-spacer />
      <v-text-field
        v-model="$store.state.search"
        label="Search"
        hide-details
        single-line
        clearable
      />
    </v-card-title>
    <v-data-table
      style="cursor: pointer"
      :search="$store.state.search"
      :headers="headers"
      :items="$store.state.patients"
      :options.sync="options"
      :footer-props="{ 'items-per-page-options': [5,10,20,50] }"
      :loading="loading"
      class="elevation-1"
      @click:row="clickIt"
    >
      <template v-slot:item.birthdate="{ item }">
        {{ item.birthdate | moment("MMMM DD, YYYY") }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {
  },
  data() {
    return {
      debug: "",
      search: "",
      loading: false,
      prevPage: -1,
      link: [],
      options: { itemsPerPage: 10, sortBy: ["family"] },
      rowsPerPageItems: [5, 10, 20, 50],
      headers: [
        { text: "Surname", value: "family" },
        { text: "Given Names", value: "given" },
        { text: "Source", value: "source" },
        { text: "Source ID", value: "source_id" },
        { text: "Gender", value: "gender" },
        { text: "Birth Date", value: "birthdate" },
        { text: "CR ID", value: "uid", sortable: false }
      ],
    };
  },
  methods: {
    clickIt: function(client) {
      this.$router.push({ name: "client", params: { clientId: client.uid } });
      //alert(patient.nin)
    }
  }
};
</script>
