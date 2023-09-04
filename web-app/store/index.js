import { formatList, wait } from '~/lib/utils'

export const state = () => ({
  videos: [],
  size: 0,
  token: null,
  videoUrl: null
})

export const getters = {
  getVideos: s => s.videos,
  getVideo: s => s.videoUrl,
  getSize: s => s.size
}

export const mutations = {
  setVideos (state, videos) {
    if (videos) state.videos = formatList(videos)
  },
  setVideoUrl (state, videoUrl) {
    if (videoUrl) state.videoUrl = videoUrl
  },
  setSize (state, size) {
    state.size = size
  },
  setToken (state, token) {
    state.token = token
  }
}

export const actions = {
  async fetchVideos({ commit }, token) {
    try {
      const {
        list,
        size
      } = await this.$axios.$get('/videos', { headers: {
        Authorization: `Bearer ${token}`
        } })
      commit('setVideos', list)
      commit('setSize', size)
    } catch (e) {
      console.error(e)
    }
  },
  async fetchVideo({ commit }, { token, key }) {
    try {
      console.log('key', key)
      const { url } = await this.$axios.$get('/share', { headers: {
        Authorization: `Bearer ${token}`
        },
      params: { key }
      })
      console.log('url', url)
      commit('setVideoUrl', url)
    } catch (e) {
      console.error(e)
    }
  },
  async requestAccess({ commit }, payload) {
    try {
      const tryToLogin = async () => {
        const { accessToken } = await this.$axios.$post('/auth/login', { data: payload })
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken)
          commit('setToken', accessToken)
          await this.$router.push({ path: '/' })
        } else {
          await wait(1000 * 5)
          await tryToLogin()
        }
      }

      await tryToLogin()
    } catch (e) {
      console.error(e)
    }
  }
}
