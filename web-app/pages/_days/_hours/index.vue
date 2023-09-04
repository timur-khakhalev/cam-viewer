<template>
  <div>
    <div>
      <v-breadcrumbs
        :items="breadcrumbs"
        large
      ></v-breadcrumbs>
    </div>
    <div class="text-center">
      <v-dialog
        v-model="dialog"
        width="500"
      >
        <template #activator="{ on, attrs }">
          <div class="grid">
            <v-container
              class="bg-surface-variant"
            >
              <v-row
                justify="center"
                align="center"
                no-gutters>
                <h2>
                  Час {{ hour }}
                </h2>
              </v-row>
              <v-row
                v-if="videos"
                align="center"
                no-gutters
                style="height: 3em"
              >
                <v-col
                  v-for="chunks in videos.chunks"
                  :key="chunks.chunk"
                  sm="3"
                >
                  <v-card
                    variant="tonal"
                    class="pa-2 ma-2 text-center"
                    style="width: 10em"
                    v-bind="attrs"
                    v-on="on"
                    @click="getVideoUrl(chunks)"
                  >
                    {{ chunks.chunk }}
                  </v-card>
                </v-col>
              </v-row>
              <template v-else>
                <v-progress-linear indeterminate></v-progress-linear>
              </template>
            </v-container>
          </div>
        </template>
        <v-card>
          <v-card-title v-if="currentVideo" class="text-h5">
            Видео от {{new Date(currentVideo.meta.LastModified).toLocaleString('ru-RU')}}
          </v-card-title>

          <v-card-text justify="center">
            <p>
              Ссылка на видео: <br>{{ takeVideoUrl }}
            </p>
            <div v-if="takeVideoUrl">
            <video width=400 controls type='video/mp4' :src="takeVideoUrl">Что-то пошло не так</video>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="secondary"
              justify="center"
              rounded
              outlined
              large
              @click="dialog = false"
            >
              Закрыть
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>


export default {
  name: 'HoursComponent',
  middleware: 'auth',
  asyncData({ params }) {
    return  { hour: params.hours, day: params.days }
  },
  data: () => ({
    hour: '',
    day: '',
    dialog: false,
    currentVideo: {
      chunk: '',
      meta: {
        Key: '',
        LastModified: '',
        Size: ''
      }
    },
    videoUrl: ''
  }),
  computed: {
    videos () {
      return this.$store.state.videos.find(v => v.day === this.day)?.hours.find(v => v.hour === this.hour)
    },
    takeVideoUrl () {
      return this.$store.state.videoUrl
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
          disabled: false,
          href: '/' + this.day,
        },
        {
          text: this.hour,
          disabled: true
        },
      ]
    }
  },
  methods: {
    async getVideoUrl (data) {
      const token = localStorage.getItem('accessToken')
      if (token) {
        this.videoUrl = await this.$store.dispatch('fetchVideo', { token, key: data.meta.Key })
        this.currentVideo = data
      }
      return this.videoUrl
    }
  },
}
</script>
