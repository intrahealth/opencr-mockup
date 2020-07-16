<template>
  <v-container class="mx-auto">
    <v-tabs
      v-model="tab"
      background-color="secondary"
      dark
      >
      <v-tabs-slider></v-tabs-slider>
      <v-tab href="#record"><v-icon>mdi-account</v-icon>Record</v-tab>
      <v-tab href="#history"><v-icon>mdi-history</v-icon>History</v-tab>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn v-if="uid === '6f2eac1b-5b1d-49ce-a4b7-f9089128f836'" color="warning" @click="$router.push('/resolve/590-57-2820')"><v-badge icon="mdi-alert" color="error" >Review Potential Matches</v-badge></v-btn>
        <v-btn color="secondary" @click="$router.go(-1)">Back</v-btn>
      </v-toolbar-items>
      <v-tab-item value="record">
        <v-row>
          <v-col cols="6">
            <v-card class="mx-auto">
              <v-carousel
                v-model="selected"
                delimiter-icon="mdi-account"
                next-icon="mdi-account-arrow-right"
                prev-icon="mdi-account-arrow-left"
                :show-arrows="true"
                >
                <v-carousel-item
                  v-for="(patient, i) in patients"
                  :key="`${i}-${patient.source_id}`"
                  >
                  <v-card
                    class="mx-auto"
                    height="100%" 
                    light
                    >
                    <v-toolbar color="primary darken-1" dark>
                      <v-toolbar-title class="font-weight-bold">
                        CR ID: {{ uid }}
                      </v-toolbar-title>
                    <v-spacer></v-spacer>
                    {{ selected+1 }} / {{ patients.length }}
                    </v-toolbar>
                    <v-list
                      dense
                      light
                      height="100%"
                      class="ml-10"
                      >
                      <v-list-item 
                      v-for="(val, key) in fields"
                      :key="key">
                        <v-list-item-content>{{val}}:</v-list-item-content>
                        <v-list-item-content class="align-end" v-if="dates[key]">
                          {{ patient[key] | moment("MMMM Do YYYY") }}
                        </v-list-item-content>
                        <v-list-item-content class="align-end" v-else>
                          {{ patient[key] }}
                        </v-list-item-content>
                      </v-list-item>

                    </v-list>
                  </v-card>
                </v-carousel-item>
              </v-carousel>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="mx-auto">
              <v-toolbar 
                    color="accent"
                    dark
                    >
                    <v-toolbar-title>Matched Records</v-toolbar-title>
              </v-toolbar>
              <v-data-table
                v-model="breaks"
                :headers="headers"
                :items="patients"
                :items-per-page="20"
                class="elevation-1 text-capitalize"
                item-key="source_id"
                show-select
                >
              </v-data-table>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    class="warning"
                    :disabled="breaks.length === 0 || patients.length < 2"
                    @click="breakMatch()"
                    >
                    Break Match(es)
                  </v-btn>
                </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" v-if="break_items.length !== 0">
            <v-card class="mx-auto">
              <v-toolbar
                color="warning"
                dark
                >
                <v-toolbar-title>Broken Matches</v-toolbar-title>
              </v-toolbar>
              <v-data-table
                v-model="unbreaks"
                :headers="headers"
                :items="break_items"
                :items-per-page="20"
                class="elevation-1 text-capitalize"
                item-key="source_id"
                show-select
                >
              </v-data-table>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn 
                class="accent"
                :disabled="unbreaks.length === 0"
                @click="revertBreak()"
                >
                Revert Break
                  </v-btn>
                </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item value="history">
        <v-row>
          <v-col cols="12">
            <v-card class="mx-auto">
              <v-toolbar 
                color="primary darken-1"
                dark
                >
                <v-toolbar-title>History</v-toolbar-title>
              </v-toolbar>
              <v-card>
                <v-card-text>
                  History Content not reproduced
                </v-card-text>
              </v-card>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {
  },
  data() {
    return {
      tab: "record",
      selected: "",
      patients: [],
      breaks: [],
      unbreaks: [],
      break_items: [],
      headers: [
        { text: "Surname", value: "family" },
        { text: "Given Names", value: "given" },
        { text: "Source", value: "source" },
        { text: "Source ID", value: "source_id" },
        { text: "Gender", value: "gender" },
        { text: "Birth Date", value: "birthdate" }
      ],
      uid: "",
      dates: { birthdate: true },
      fields: { source: "Submitting System", source_id: "System ID", family: "Family Name", given: "Given Name",
        gender: "Gender", birthdate: "Birth Date"
      }
    }
  },
  mounted: function() {
    this.uid = this.$route.params.clientId
    this.patients = this.$store.state.patients.filter( patient => patient.uid === this.uid )
    if ( this.$route.params.sourceId ) {
      this.selected = this.patients.indexOf( this.patients.find( patient => patient.source_id === this.$route.params.sourceId ) )
    }
  },
  methods: {
    clickIt: function(client) {
      this.$router.push({ name: "client", params: { clientId: client.id } });
      //alert(patient.nin)
    },
    breakMatch: function() {
      console.log(this.breaks)
      for( let breakit of this.breaks ) {
        this.break_items = this.patients.filter( patient => patient.source === breakit.source && patient.source_id === breakit.source_id )
        this.patients = this.patients.filter( patient => patient.source !== breakit.source && patient.source_id !== breakit.source_id )
      }
      this.breaks = []
    },
    revertBreak: function() {
      console.log(this.unbreaks)
      for( let unbreakit of this.unbreaks ) {
        this.patients.push( unbreakit )
        this.break_items = this.break_items.filter( patient => patient.source !== unbreakit.source && patient.source_id !== unbreakit.source_id )
      }
      this.unbreaks = []
    },


  }
}
</script>
