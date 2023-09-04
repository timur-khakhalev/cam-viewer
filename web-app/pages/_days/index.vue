<template>
  <div>
    <div>
      <v-breadcrumbs
        :items="breadcrumbs"
        large
      ></v-breadcrumbs>
    </div>
    <div class="grid">
      <v-container
        class="bg-surface-variant mb-6"
      >
        <v-row
          align="center"
          justify="center"
          no-gutters>
          <h2>
            Дата {{ day }}
          </h2>
        </v-row>
        <v-row
          v-if="videos"
          align="center"
          no-gutters
          justify="center"
          style="height: 3em"
        >
          <v-col
            v-for="hours in videos.hours"
            :key="hours.hour"
            md="2"
            sm="4"
          >
            <v-card
              variant="tonal"
              class="pa-2 ma-2 text-center"
              style="width: 7em"
              @click="$router.push(`/${day}/${hours.hour}`)"
            >
              {{ hours.hour }}
            </v-card>
          </v-col>
        </v-row>
        <template v-else>
          <v-progress-linear indeterminate></v-progress-linear>
        </template>
      </v-container>
    </div>
  </div>
</template>

<script>


export default {
  name: 'DaysComponent',
  middleware: 'auth',
  asyncData({ params }) {
    return  { day: params.days }
  },
  data: () => ({
    day: ''
  }),
  computed: {
    videos () {
      return this.$store.state.videos.find(v => v.day === this.day)
    },
    breadcrumbs () {
      return [
      {
        text: 'Главная',
        disabled: false,
        to: '/'
      },
      {
        text: this.day,
        disabled: true
      }
    ]}
  }
}
</script>
