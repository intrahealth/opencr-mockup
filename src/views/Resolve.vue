<template>
  <v-container>
    <v-navigation-drawer
      color="secondary"
      right
      permanent
      clipped
      app
      >
      <v-list>
        <v-list-item>
          <v-btn @click="showMatrix = true; $vuetify.goTo($refs.scoreMatrix);" color="accent">Show Scores Matrix</v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn @click="showReview = true" color="success">Save Changes</v-btn>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <h3 class="white--text">Options</h3>
        </v-list-item>
        <v-list-item>
          <v-switch v-model="useNickname" dark label="Use Nicknames?" @change="setupCRIDList"></v-switch>
        </v-list-item>
        <v-list-item>
          <v-switch v-model="includeCRID" dark label="Include CR ID with Nickname?" @change="setupCRIDList"></v-switch>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-dialog :value="showReview" max-width="900">
      <v-card light>
        <v-card-title>
          <v-toolbar color="primary" dark>
            <v-toolbar-title class="font-weight-bold">
              Review Changes
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn @click="showReview = false" icon><v-icon>mdi-close</v-icon></v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </v-card-title>
        <v-data-table
          :headers="review_headers"
          :items="review_list"
          class="elevation-1"
          :disable-pagination="true"
          :hide-default-footer="true"
          >
        </v-data-table>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="review_list.length === 0" color="success" @click="showReview = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog :value="cohortPopup" width="500">
      <v-card light>
        <v-card-title class="secondary lighten-1" color="white" primary-title>
          Include Cohort? 
        </v-card-title>
        <v-card-text>
          Do you want to include all the other records from this CR ID and move them all to the new CR ID?
        </v-card-text>
        <v-card-actions>
          <v-btn color="warning" @click="copyCohort">Yes</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="info" @click="copyCohortInfo = null; cohortPopup = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row v-for="(list, uid) in crids" :key="uid">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-toolbar color="primary darken-1" dark>
              <v-toolbar-title class="font-weight-bold" v-if="useNickname">
                {{ nickname[uid] }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-title class="font-weight-bold">
                CR ID: {{ uid }}
              </v-toolbar-title>
            </v-toolbar>
          </v-card-title>
          <v-data-table
            style="cursor: pointer"
            :headers="headers"
            :items="list"
            class="elevation-1"
            :disable-pagination="true"
            :hide-default-footer="true"
            :loading="loading"
            >
            <template v-slot:header.uid="{ props: { } }">
              {{ cridHeader }}
            </template>
            <template v-slot:item.uid="{ item }">
              <v-select
                :value="item.uid"
                :items="crid_list"
                :success-messages="'Original: '+cridDisplay(item.ouid)"
                @change="moveClient($event, item)"
                :key="item.source+item.source_id"
                dense
              ></v-select>
            </template>
            <template v-slot:item.source_id="{ item }">
              <a @click="goTo('client',{ clientId: item.uid, sourceId: item.source_id })">{{ item.source_id }}</a>
            </template>
            <template v-slot:item.view="{ item }">
              <v-switch v-model="showCard[item.source_id]" hide-details @change="if ( showCard[item.source_id] ) $vuetify.goTo($refs.fullCards)"></v-switch>
            </template>
            <template v-slot:item.score="{ item }">
              <v-switch v-model="showScore[item.source_id]" hide-details></v-switch>
            </template>
            <template v-slot:item.birthdate="{ item }">
              {{ item.birthdate | moment("MMMM DD YYYY") }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-row ref="scoreMatrix">
      <v-col cols="12" v-if="showMatrix">
        <v-card>
          <v-card-title>
            <v-toolbar color="accent" dark>
              <v-toolbar-title class="font-weight-bold">
                Scores Matrix
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn icon @click="showMatrix = false"><v-icon>mdi-close</v-icon></v-btn>
              </v-toolbar-items>
            </v-toolbar>
          </v-card-title>
          <v-data-table
            style="cursor: pointer"
            :headers="score_headers"
            :items="score_matrix"
            class="elevation-1"
            :disable-pagination="true"
            :hide-default-footer="true"
            >
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-row ref="fullCards">
      <template v-for="data in resolves">
        <v-col cols="4" v-if="showCard[data.source_id]" :key="data.source_id">
          <v-card
            class="mx-auto"
            light
            :id="data.source+data.source_id"
            :ref="data.source+data.source_id"
            >
            <v-toolbar color="secondary" dark>
              <v-toolbar-title class="font-weight-bold">
                Source: {{ data.source }} {{ data.source_id }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn icon @click="showCard[data.source_id] = false"><v-icon>mdi-close</v-icon></v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-list
              dense
              light
              height="100%"
              >
              <v-list-item 
              v-for="(val, key) in fields"
              :key="key">
                <v-list-item-content>{{val}}:</v-list-item-content>
                <v-list-item-content class="align-end" v-if="dates[key]">
                  {{ data[key] | moment("MMMM Do YYYY") }}
                </v-list-item-content>
                <v-list-item-content class="align-end" v-else>
                  {{ data[key] }}
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <h5 class="text-uppercase">Scores</h5>
              </v-list-item>
              <v-list-item
                v-for="(score,source_id) in data.scores"
                :key="data.source_id+'-'+source_id"
                >
                <v-list-item-content>{{getSource(source_id)}}</v-list-item-content>
                <v-list-item-content>{{source_id}}:</v-list-item-content>
                <v-list-item-content>{{score}}</v-list-item-content>
              </v-list-item>

            </v-list>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
//import draggable from 'vuedraggable'
const ADD_TEXT = "Assign to new CR ID"
const NEW_PREFIX = "New CR ID "
const shuffle = (arr) => {
  for( let i = arr.length - 1; i > 0; i-- ) {
    let j = Math.floor(Math.random() * (i+1))
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}

export default {
  name: "Resolve",
  components: {
    //draggable
  },
  data() {
    return {
      crids: {},
      crid_list: [],
      showCard: {},
      showScore: {},
      showMatrix: false,
      showReview: false,
      cohortPopup: false,
      resolves: {},
      id: "590-57-2820",
      loading: false,
      newIdx: 1,
      headers: [
        { text: this.cridHeader, value: "uid" },
        { text: "Source", value: "source" },
        { text: "Source ID", value: "source_id" },
        { text: "Surname", value: "family" },
        { text: "Given Names", value: "given" },
        { text: "Birth Date", value: "birthdate" },
        { text: "Gender", value: "gender" },
        { text: "Full View", value: "view" },
        { text: "Scores", value: "score" },
      ],
      dates: { birthdate: true },
      fields: { source: "Submitting System", source_id: "System ID", family: "Family Name", given: "Given Name",
        gender: "Gender", birthdate: "Birth Date"
      },
      score_matrix: [],
      score_headers: [ { text: "Source", value: "name" } ],
      review_headers: [
        { text: "Source", value: "source" },
        { text: "Source ID", value: "source_id" },
        { text: "Original CR ID", value: "ouid" },
        { text: "New CR ID", value: "uid" }
      ],
      review_list: [],
      copyCohortInfo: null,
      useNickname: true,
      includeCRID: false,
      available_nicknames: [ "Aardvark", "Buffalo", "Cheetah", "Dik-dik", "Elephant", "Fennec Fox", "Giraffe", "Hippopotamus", 
        "Impala", "Jaguar", "Klipspringer", "Lion", "Meerkat", "Nile Crocodile", "Ostrich", "Porcupine", "Quelea Quelea",
        "Rhinoceros", "Spotted Hyena", "Topi", "Uromastyx", "Vanga", "Wildebeest", "Xerus", "Yellow Mongoose", "Zebra" ],
      nickname: {}
    };
  },
  watch: {
    showScore: {
      handler(val) {
        for( let source_id of Object.keys(val) ) {
          if ( val[source_id] ) {
            if ( !this.headers.find( header => header.value === source_id ) ) {
              this.headers.push( { text: this.getSource(source_id)+" "+source_id, value: source_id } )
            }
          } else {
            this.headers = this.headers.filter( header => header.value !== source_id )
          }
        }
      },
      deep: true
    }
  },
  created: function() {
    this.resolves = this.$store.state.resolves
    shuffle(this.available_nicknames)
    this.organizeResolves(true)
  },
  computed: {
    cridHeader: function() {
      return this.useNickname ? "Nickname" + ( this.includeCRID ? " / CR ID" : "") : "CR ID"
    }
  },
  methods: {
    organizeResolves: function( firstTime ) {
      this.loading = true
      for( let idx of Object.keys(this.crids) ) {
        this.crids[idx] = []
      }
      this.review_list = []

      for( let resolve of this.resolves ) {
        if ( firstTime ) {
          let scoreRow = {}
          scoreRow.name = resolve.source+" "+resolve.source_id
          this.score_headers.push( { text: scoreRow.name, value: resolve.source_id } )
          for( let score_id of Object.keys(resolve.scores) ) {
            resolve[score_id] = resolve.scores[score_id]
            scoreRow[score_id] = resolve.scores[score_id]
          }
          this.score_matrix.push( scoreRow )
          resolve.ouid = resolve.uid
        }
        if ( !this.crids[ resolve.uid ] ) {
          this.crids[ resolve.uid ] = []
          this.nickname[ resolve.uid ] = this.available_nicknames.pop()
        }
        this.crids[ resolve.uid ].push( resolve )
        if ( resolve.ouid !== resolve.uid ) {
          this.review_list.push( resolve )
        }
      }


      this.setupCRIDList()
      this.loading = false
    },
    setupCRIDList: function() {
      this.crid_list = Object.keys(this.crids).map( crid => { return { text: this.cridDisplay(crid), value: crid } } )
      this.crid_list.push( { divider: true } )
      this.crid_list.push( { text: ADD_TEXT, value: ADD_TEXT } )
    },
    cridDisplay: function( crid ) {
      return this.useNickname ? this.nickname[crid] + ( this.includeCRID ? " ("+crid+")" : "" ): crid
    },
    clickIt: function() {
      //this.$router.push({ name: "review", params: { clientId: client.uid } });
      //alert(patient.nin)
    },
    getSource: function(source_id) {
      return this.resolves.find( resolve => resolve.source_id === source_id ).source
    },
    moveClient: function(val,item) {
      this.copyCohortInfo = { old_id: item.uid, new_id: val }
      if ( val === ADD_TEXT ) {
        item.uid = NEW_PREFIX + this.newIdx
        this.nickname[ item.uid ] = this.available_nicknames.pop()
        this.newIdx++
      } else {
        item.uid = val
      }
      //item.uid = val
      this.organizeResolves()
      this.cohortPopup = true
    },
    saveIt: function() {

    },
    copyCohort: function() {
      if ( this.copyCohortInfo ) {
        for ( let resolve of this.resolves.filter( resolve => resolve.uid === this.copyCohortInfo.old_id ) ) {
          resolve.uid = this.copyCohortInfo.new_id
        }
      }
      this.organizeResolves()
      this.copyCohortInfo = null
      this.cohortPopup = false
    },
    goTo: function( name, params ) {
      let routeData = this.$router.resolve( { name: name, params: params } )
      window.open(routeData.href, '_blank')
    }
  }
};
</script>
