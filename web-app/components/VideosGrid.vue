<template>
    <div class="grid">
      <v-container
        class="bg-surface-variant"
      >
        <v-row
        align="center"
        justify="center"
        no-gutters>
          <h2>
            Всего видеороликов {{ getSize }}
          </h2>
        </v-row>
        <v-row
          align="center"
          no-gutters
          style="height: 3em"
        >
          <v-col
            v-for="days in getVideos"
            :key="days.day"
            md="2"
            sm="4"
          >
            <v-card
              variant="tonal"
              class="pa-2 ma-2 text-center"
              style="width: 7em"
              @click="$router.push(`/${days.day}`)"
            >
              {{ days.day }}
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
</template>
<script>

export default {
  name: 'VideosGrid',
  props: {
  },
  data() {
    return {
      loading: false,
      videos: [],
      size: 0,
      error: null,
    }
  },
  computed: {
    getVideos() {
      return this.$store.getters.getVideos
    },
    getSize() {
      return this.$store.getters.getSize
    }
  }
}
</script>
<style>
button {
  padding: 12px 32px;
  font-size: 16px;
  border-radius: 8px;
}
</style>
