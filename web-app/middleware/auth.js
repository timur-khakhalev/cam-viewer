export default function ({ redirect }) {
  const token = localStorage.getItem('accessToken')
  const isAuthenticated = !!token
  if (!isAuthenticated)
    redirect({ name: 'auth' })
}
