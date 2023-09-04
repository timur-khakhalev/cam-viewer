<template>
  <div>
    <v-btn
      depressed
      color="error"
      @click="requestAccess"
    >
      Запросить доступ к сайту
    </v-btn>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userConfig: {

      }
    }
  },
  methods: {
    async requestAccess() {
      await this.$store.dispatch('requestAccess', {
        userAgent: window.navigator.userAgent,
        language: window.navigator.language,
        host: window.location.hostname,
      })
    }
  }
}
</script>
<style scoped>
div {
  max-width: 400px;
  margin: 20px auto;
}
</style>
