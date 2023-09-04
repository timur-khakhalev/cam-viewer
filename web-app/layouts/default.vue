<template>
  <v-app>
    <v-main>
      <v-container>
        <p v-if="$fetchState.pending">Loading....</p>
        <p v-else-if="$fetchState.error">Error while fetching mountains</p>
        <Nuxt/>
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'DefaultLayout',
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [

      ],

      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Cam-viewer'
    }
  },
  async fetch() {
    const token = localStorage.getItem('accessToken')
    if (token) await this.$store.dispatch('fetchVideos', token)
    else await this.$router.push('auth')
  },
}
</script>
