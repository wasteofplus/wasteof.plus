// console.log('route change test script loaded', $nuxt)
// $nuxt.$router.afterEach((to, from) => {
//   console.log('route changed')
// })

console.log('route change test script loaded', $nuxt)
// console.log('router aftereach', $nuxt.$router.afterEach.toString())
// $nuxt.$router.afterEach = function (t) {
//   console.log('route changed!')
//   return oe(this.afterHooks, t)
// }
// console.log('router aftereach', $nuxt.$router.afterEach.toString())
$nuxt.$router.afterEach(() => {
  console.log('route changed2')
  const event = new CustomEvent('PassToBackgroundRoute', {
    detail: 'HELLO!!!'
  })
  window.dispatchEvent(event)
})
