<template>
  <v-container>
    <v-row>
      <v-col class="text-center">
        <h1 class="vtitle">
          We Are <span class="valofont">VSC</span>
        </h1>
        <h4>{{ $t('about-subtitle') }}</h4>
      </v-col>
    </v-row>
    <div class="pt-10">
      <div class="v-responsive d-flex align-center mx-auto justify-center" style="height: 100%; max-width: 100vh; width: 100%;">
        <v-card
          elevation="2"
          class="pa-5"
          width="100vh"
        >
          <h1 class="text-center">
            Frequently Asked Questions
          </h1>
          <v-card outlined class="pa-3 mt-3">
            <v-card-title>
              {{ $t('faq-qsafe') }}
            </v-card-title>
            <v-card-text>
              {{ $t('faq-asafe') }}
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                href="https://github.com/Lunac-dev/valorant-store-frontend"
              >
                Github
                <v-icon>
                  mdi-github
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-card outlined class="pa-3 mt-3">
            <v-card-title>
              {{ $t('faq-qmyregion') }}
            </v-card-title>
            <v-card-text>
              {{ $t('faq-amyregion') }}
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                href="https://account.riotgames.com/"
              >
                Riot games Account
                <v-icon>
                  mdi-account-check-outline
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-card outlined class="pa-3 mt-3">
            <v-card-title>
              {{ $t('faq-qmyriotname') }}
            </v-card-title>
            <v-card-text>
              {{ $t('faq-amyriotname') }}
            </v-card-text>
          </v-card>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'AboutPage',

  head () {
    return {
      title: 'About'
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
  font-size: 10vh;
}
</style>
