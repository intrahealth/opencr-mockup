<template>
    <v-card>
    <v-card-title>
      Action Required
      <v-spacer />
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="$store.state.csvs"
      :options.sync="options"
      :footer-props="{ 'items-per-page-options': [5,10,20,50] }"
      :loading="loading"
      class="elevation-1"
      >
      <template v-slot:item.date="{ item }">
        {{ item.date | moment("MMMM DD YYYY HH:mm:ssZ") }}
      </template>
      <template v-slot:item.reports="{ item }">
        <v-card-title small>
          <v-btn dense outlined rounded small :disabled="disabled[item.uid]" @click="addReport(item.uid)">Run Report</v-btn>
        </v-card-title>
        <ul>
          <li v-for="report in reports[item.uid]" :key="report.id">
            <span v-if="report.pending">
            Pending: {{ report.name | moment("MMMM DD YYYY HH:mm:ssZ") }}
            </span>
            <a v-else>{{ report.name | moment("MMMM DD YYYY HH:mm:ssZ") }}</a>
          </li>
        </ul>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
// @ is an alias to /src

export default {
  name: "CSVReport",
  components: {
  },
  data() {
    return {
      report_idx: 1,
      debug: "",
      search: "",
      loading: false,
      prevPage: -1,
      reports: {},
      disabled: {},
      options: { itemsPerPage: 10, sortBy: ["family"] },
      rowsPerPageItems: [5, 10, 20, 50],
      headers: [
        { text: "CSV ID", value: "uid" },
        { text: "CSV Name", value: "name" },
        { text: "Date", value: "date" },
        { text: "Reports", value: "reports" }
      ]
    };
  },
  created: function() {
    for( let item of this.$store.state.csvs ) {
      this.reports[ item.uid ] = []
      this.disabled[ item.uid ] = false
    }
  },
  methods: {
    addReport: function(csv) {
      let now = new Date()
      let row = {
        name: now.toISOString(),
        id: this.report_idx++,
        pending: true
      }
      this.reports[csv].push( row )
      this.disabled[csv] = true
      this.$forceUpdate()
      setTimeout( (data) => {
        data.pending = false
        this.disabled[csv] = false
        this.$forceUpdate()
      }, 5000, row )
    }
  }
};
</script>
