module.exports = {
  router: {
    linkActiveClass: 'active',
    extendRoutes(routes, resolve) {
      routes.push({
        name: '',
        path: '/',
        component: resolve(__dirname, 'pages/home/index.vue')
      })
      routes.push({
        name: 'register',
        path: '/register',
        component: resolve(__dirname, 'pages/login/index.vue')
      })
    }
  },
  plugins: ['~/plugins/request.js', '~/plugins/dayjs.js'],
  server: {
    host: '0.0.0.0',
    port: 3000
  },
}