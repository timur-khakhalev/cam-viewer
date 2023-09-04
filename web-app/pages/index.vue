<template>
  <div>
    <div>
      <v-breadcrumbs
        :items="breadcrumbs"
        large
      ></v-breadcrumbs>
    </div>
      <VideosGrid/>
  </div>
</template>

<script>

import VideosGrid from '~/components/VideosGrid.vue'

export default {
  name: 'IndexPage',
  components: {
    VideosGrid
  },
  middleware: 'auth',
  data: () => ({

  }),
  computed: {
    breadcrumbs () {
      return [
        {
          text: 'Главная',
          disabled: false,
          to: '/'
        }
      ]
    }
  }
}
</script>
