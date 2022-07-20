<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card
          elevation="2"
          class="pa-5"
          width="100vh"
          height="100%"
        >
          <h1>Wallet</h1>
          <v-row>
            <v-col cols="12" sm="6">
              <h3>Valorant Points</h3>
              <v-card
                class="mx-auto d-flex flex-no-wrap justify-space-between"
                max-width="100%"
                outlined
              >
                <v-card-title><h1 v-text="vp" /></v-card-title>
                <v-avatar
                  class="ma-3"
                  size="80"
                  tile
                >
                  <v-img src="/images/vp.png" />
                </v-avatar>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6">
              <h3>Radianite Points </h3>
              <v-card
                class="mx-auto d-flex flex-no-wrap justify-space-between"
                max-width="100%"
                outlined
              >
                <v-card-title><h1 v-text="rp" /></v-card-title>
                <v-avatar
                  class="ma-3"
                  size="80"
                  tile
                >
                  <v-img src="/images/rp.png" />
                </v-avatar>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card
          elevation="2"
          class="pa-5"
          width="100vh"
          height="100%"
        >
          <h1>VSC Updates</h1>
          <v-timeline
            align-top
            dense
          >
            <v-timeline-item
              v-for="n in news"
              v-bind:key="n.date"
              color="valorant"
            >
              <v-row class="pt-1">
                <v-col cols="12" sm="3">
                  {{ n.date }}
                </v-col>
                <v-col>
                  <strong>{{ n.title }}</strong>
                  <div class="text-caption">
                    {{ n.text }}
                  </div>
                </v-col>
              </v-row>
            </v-timeline-item>
          </v-timeline>
        </v-card>
      </v-col>
    </v-row>
    <v-card
      elevation="2"
      class="pa-5 mt-5"
      width="100%"
      height="100%"
    >
      <h1>Daily Store</h1>
      <v-row>
        <v-col v-for="weapon in storeoffers" v-bind:key="weapon.name" cols="12" sm="3">
          <v-card
            class="mx-auto c1"
            max-width="100%"
            outlined
            hover
            @click="viewvideo(weapon.videosrc)"
          >
            <v-img
              :src="/images/ + weapon.tierid + '.png'"
              height="250px"
              aspect-ratio="1.4"
              contain
            >
              <v-img
                :src="weapon.imgsrc"
                height="250px"
                class="align-end"
                aspect-ratio="1.4"
                contain
              >
                <v-card-title class="valofont">
                  {{ weapon.name }}
                </v-card-title>
                <v-card-subtitle class="text-h6 text-decoration-underline">
                  {{ weapon.vp }} VP
                </v-card-subtitle>
              </v-img>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-card
      elevation="2"
      class="pa-5 mt-5"
      width="100%"
      height="100%"
    >
      <h1>Night Market</h1>
      <v-row v-if="bonusoffers[0] !== undefined">
        <v-col v-for="weapon in bonusoffers" v-bind:key="weapon.name" cols="6">
          <v-card
            class="mx-auto c2"
            max-width="100%"
            outlined
            hover
            @click="viewvideo(weapon.videosrc)"
          >
            <v-img
              :src="/images/ + weapon.tierid + '.png'"
              height="250px"
              aspect-ratio="1.4"
              contain
            >
              <v-img
                :src="weapon.imgsrc"
                height="250px"
                class="align-end"
                aspect-ratio="1.4"
                contain
              >
                <v-card-title class="valofont">
                  {{ weapon.name }}
                </v-card-title>
                <v-card-subtitle class="text-h6 text-decoration-underline">
                  {{ weapon.vpold }} VP -> {{ weapon.vp }} VP
                </v-card-subtitle>
              </v-img>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
      <h2 v-else>
        Night market is not open.
      </h2>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'StorePage',

  data () {
    return {
      storeoffers: [],
      bonusoffers: [],
      data: this.$cookies.get('data'),
      vp: 0,
      rp: 0,
      news: []
    }
  },

  head () {
    return {
      title: 'Daily Store'
    }
  },

  mounted () {
    if (!this.data) {
      this.$swal({
        icon: 'error',
        title: 'Error',
        text: this.$t('storeyet')
      })
      this.$router.push('/')
    } else {
      const tmp = JSON.parse(this.data)
      this.setStores(tmp.store)
      this.setWallet(tmp.wallet)
      this.getnews()
    }
  },

  methods: {
    setStores (stores) {
      for (const k in stores) {
        if ('offerleft' in stores[k]) {
          continue
        }
        this.storeoffers.push(
          { vp: stores[k].vp, name: stores[k].name, imgsrc: stores[k].imgsrc, videosrc: stores[k].videosrc, tierid: stores[k].tierid }
        )
      }
      if ('BonusStore' in stores) {
        for (const k in stores.BonusStore) {
          if ('BonusLeft' in stores.BonusStore[k]) {
            continue
          }
          this.bonusoffers.push(
            { vp: stores.BonusStore[k].vp, vpold: stores.BonusStore[k].vpold, name: stores.BonusStore[k].name, imgsrc: stores.BonusStore[k].imgsrc, videosrc: stores.BonusStore[k].videosrc, tierid: stores[k].tierid }
          )
        }
      }
    },

    setWallet (wallet) {
      this.vp = wallet.Balances['85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741']
      this.rp = wallet.Balances['e59aa87c-4cbf-517a-5983-6e81511be9b7']
    },

    viewvideo (src) {
      if (String(src) !== 'null') {
        const video = document.createElement('video')
        video.setAttribute('controls', '')
        video.src = src
        video.preload = 'metadata'
        video.style.width = '100%'
        video.autoplay = true
        video.loop = true
        this.$swal({
          html: video,
          width: '80%'
        })
      }
    },

    async getnews () {
      const news = await this.$axios.get('https://api.lunac.xyz/vsc/news?type=2&limit=2')

      for (const k in news.data) {
        const event = new Date(news.data[k].date)
        this.news.push({ title: news.data[k].title, text: news.data[k].text, date: event.toUTCString() })
      }
    }
  }
}
</script>
<style scoped lang="css">
.valofont {
  color: #ff4655;
  font-family: 'VALORANT', sans-serif;
}

.vtitle {
  font-size: 5vh;
}
</style>
