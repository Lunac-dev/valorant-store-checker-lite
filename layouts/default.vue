<template>
  <v-app dark>
    <v-app-bar
      flat
      app
      fixed
    >
      <v-app-bar-nav-icon @click="drawer=!drawer" />
      <v-spacer />
      <v-menu open-on-hover offset-y rounded="Large" transition="slide-y-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>
              mdi-discord
            </v-icon>
            <v-icon>
              mdi-menu-down
            </v-icon>
          </v-btn>
        </template>
        <v-list
          nav
        >
          <v-list-item href="https://discord.gg/4zrQDW9PNq" target="_blank">
            <v-list-item-title>VSC Offical</v-list-item-title>
          </v-list-item>
          <v-list-item href="https://discord.gg/valorant" target="_blank">
            <v-list-item-title>Valorant Offical</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu open-on-hover offset-y rounded="Large" transition="slide-y-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>
              mdi-translate
            </v-icon>
            <v-icon>
              mdi-menu-down
            </v-icon>
          </v-btn>
        </template>
        <v-list
          nav
        >
          <v-list-item v-if="$i18n.locale !== 'en'" @click="() => changeLocale('en')">
            <v-list-item-title>English</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="$i18n.locale !== 'ja'" @click="() => changeLocale('ja')">
            <v-list-item-title>日本語</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="$i18n.locale !== 'de'" @click="() => changeLocale('de')">
            <v-list-item-title>Deutsch</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      floating
    >
      <v-container>
        <div>
          <v-list-item>
            <v-list-item-title class="text-center">
              <img alt="VS Logo" src="/icon.png" height="50">
            </v-list-item-title>
          </v-list-item>
        </div>
        <v-list
          dense
          nav
          shaped
        >
          <v-list-item
            v-for="([icon, text, link, exact], i) in items"
            :key="`first-${i}`"
            :to="link"
            :exact="exact"
            color="valorant"
          >
            <v-list-item-icon>
              <v-icon>{{ icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-container>
    </v-navigation-drawer>
    <v-main>
      <Nuxt />
    </v-main>
    <v-footer
      app
      absolute
      inset
    >
      <span class="grey--text" style="font-size: 12px">&copy; {{ new Date().getFullYear() }} - valorantstore.net is not endorsed by Riot Games in any way. Riot Games, Valorant, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.<br> Valorantstore.net was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games. This is made by a player, for players.<br><a href="https://lunacnet.notion.site/lunacnet/Valorant-Store-Chcecker-ce4ed87caebb4fbc94e1af3debb5b7b8">ToS & Privacy Policy</a></span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      drawer: null,
      items: [
        ['mdi-home-outline', 'Home', '/', true],
        // ['mdi-trophy-variant-outline', 'VCT-Matches', 'vct-matches', true],
        ['mdi-information-outline', 'About / FAQ', 'about', true],
        ['mdi-cart', 'Daily Store', 'store', true]
      ],
      avatar: null
    }
  },

  methods: {
    changeLocale (locale) {
      this.$i18n.setLocaleCookie(locale)
      this.$router.go(0)
    }
  }
}
</script>
