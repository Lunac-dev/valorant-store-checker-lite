<template>
  <v-container class="text-center">
    <h1 class="vtitle valofont">
      Valorant Store Checker (Lite)
    </h1>
    <div class="pt-10">
      <div class="v-responsive d-flex align-center mx-auto justify-center" style="height: 100%; max-width: 100vh; width: 100%;">
        <v-card
          elevation="2"
          class="pa-10"
          width="100%"
        >
          <v-row align-content="center">
            <v-col align="center" cols="12" sm="4" class="hidden-sm-and-down">
              <!-- <img src="/images/fade.png"> -->
              <img alt="Fade" src="/images/fade.png" height="500">
            </v-col>
            <v-col align="center" cols="12" sm="8">
              <h1>
                Login your Riot Account
              </h1>
              <v-alert
                dense
                outlined
                type="warning"
              >
                {{ $t('alert') }}
              </v-alert>
              <v-tabs
                v-model="tabs"
                fixed-tabs
                show-arrows
                color="valorant"
              >
                <v-tab>
                  Password
                </v-tab>
                <v-tab>
                  No password
                </v-tab>
                <v-tab>
                  2FA
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="tabs">
                <v-tab-item>
                  <v-form ref="form">
                    <v-text-field
                      v-model="riotusername"
                      label="Riot Account Name"
                      :rules="[required]"
                      filled
                      clearable
                      color="valorant"
                    />
                    <p class="text--secondary">
                      {{ $t('password') }}
                    </p>
                    <v-text-field
                      v-model="riotuserpassword"
                      label="Riot Account Password"
                      :rules="[required]"
                      filled
                      clearable
                      :append-icon="toggle.icon"
                      :type="toggle.type"
                      color="valorant"
                      @click:append="show = !show"
                    />
                    <v-select
                      v-model="riotregion"
                      item-text="label"
                      item-value="value"
                      :items="regions"
                      filled
                      label="Select Riot Account Region"
                      :rules="[required]"
                      color="valorant"
                    />
                    <v-btn
                      elevation="2"
                      color="valorant"
                      large
                      @click="login()"
                    >
                      Submit
                    </v-btn>
                  </v-form>
                </v-tab-item>
                <v-tab-item>
                  <v-form ref="form2">
                    <v-textarea
                      v-model="cookie"
                      label="Riot Cookie"
                      :rules="[required]"
                      filled
                      clearable
                      color="valorant"
                    />
                    <v-btn
                      disabled
                      elevation="2"
                      color="valorant"
                      large
                      @click="loginCookie()"
                    >
                      Submit
                    </v-btn>
                  </v-form>
                </v-tab-item>
                <v-tab-item>
                  <v-form ref="form3">
                    <v-text-field
                      v-model="code"
                      label="two-factor authentication"
                      :rules="[required]"
                      filled
                      clearable
                      type="number"
                      color="valorant"
                    />
                    <v-btn
                      elevation="2"
                      color="valorant"
                      large
                      @click="login2fa()"
                    >
                      Submit
                    </v-btn>
                  </v-form>
                </v-tab-item>
              </v-tabs-items>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'HomePage',

  data () {
    return {
      regions: [
        {
          label: 'Asia_Pacific',
          value: 'ap'
        },
        {
          label: 'Europa',
          value: 'eu'
        },
        {
          label: 'North_America / Latin_America / Brazil',
          value: 'na'
        },
        {
          label: 'Korea',
          value: 'kr'
        }
      ],
      show: false,
      riotusername: null,
      riotuserpassword: null,
      riotregion: null,
      tabs: null,
      cookie: null,
      twofa: this.$cookies.get('2fa'),
      data: this.$cookies.get('data'),
      code: null,
      required: value => !!value || 'Please be sure to fill out the form or select.'
    }
  },

  head () {
    return {
      title: 'Home'
    }
  },

  computed: {
    toggle () {
      const icon = this.show ? 'mdi-eye' : 'mdi-eye-off'
      const type = this.show ? 'text' : 'password'
      return { icon, type }
    }
  },

  methods: {
    async login () {
      this.data = this.$cookies.get('data')
      this.twofa = this.$cookies.get('2fa')
      this.$swal({
        icon: 'info',
        title: 'Loading...',
        showConfirmButton: false,
        allowOutsideClick: false
      })
      this.$swal.showLoading()
      if (this.$refs.form.validate()) {
        if (this.data) {
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: this.$t('already')
          })
          return
        }
        const reg = /^[0-9a-zA-Z_]+$/
        if (!reg.test(this.riotusername)) {
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: 'Username contains an unusable string or spaces.'
          })
          return
        } else if (this.twofa) {
          this.$swal({
            icon: 'error',
            title: '2FA',
            text: this.$t('2fa')
          })
          return
        }
        // Login and get store
        let response = null
        try {
          response = await this.$axios.get('/api/auth', { headers: { accname: this.riotusername, accpassword: this.riotuserpassword, accregion: this.riotregion } })
        } catch (err) {
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: err.message
          })
          return
        }
        if (response.data.status !== 200 && response.data.status !== '2fa') {
          if (response.data.status === 'auth_failure') {
            this.$swal({
              icon: 'error',
              title: 'Oops...',
              text: this.$t('authfailure')
            })
          } else {
            this.$swal({
              icon: 'error',
              title: 'Oops...',
              text: response.data.status
            })
          }
        } else if (response.data.status === '2fa') {
          const tmp =
          {
            asidcookie: response.data.asidcookie,
            accregion: this.riotregion
          }
          this.$cookies.set('2fa', tmp, {
            path: '/',
            maxAge: 60 * 60
          })
          this.$swal({
            icon: 'info',
            title: '2FA',
            text: this.$t('2fa')
          })
        } else {
          this.$cookies.set('data', response.data, {
            path: '/',
            maxAge: response.data.store[0].offerleft
          })
          this.$swal({
            icon: 'success',
            title: 'Success!'
          })
          this.$router.push('/store')
        }
      } else {
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: this.$t('plsfill')
        })
      }
    },

    async login2fa () {
      this.data = this.$cookies.get('data')
      this.twofa = this.$cookies.get('2fa')
      this.$swal({
        icon: 'info',
        title: 'Loading...',
        showConfirmButton: false,
        allowOutsideClick: false
      })
      this.$swal.showLoading()
      if (this.$refs.form3.validate()) {
        if (this.data) {
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: this.$t('already')
          })
          return
        }
        if (!this.twofa) {
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: this.$t('2faempty')
          })
          return
        }
        const tmp = JSON.parse(this.twofa)
        const response = await this.$axios.get('/api/auth2fa', { headers: { asidcookie: tmp.asidcookie, code: this.code, accregion: tmp.accregion } })
        this.$cookies.remove('2fa')
        if (response.data.status !== 200 && response.data.status === 'ERR_BAD_REQUEST') {
          // invalid_session_id
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: this.$t('ERR_BAD_REQUEST')
          })
          return
        } else if (response.data.status !== 200) {
          // Unknown Error
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: response.data.status
          })
          return
        }
        this.$cookies.set('data', response.data, {
          path: '/',
          maxAge: response.data.store[0].offerleft
        })
        this.$swal({
          icon: 'success',
          title: 'Success!'
        })
        this.$router.push('/store')
      } else {
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: this.$t('plsfill')
        })
      }
    }
  }
}
</script>

<style scoped lang="css">
.vtitle {
  font-size: 5vh;
}

.valofont {
  color: #ff4655;
  font-family: 'VALORANT', sans-serif;
}
</style>
