//tracking script is only loaded for production
if (process.env.NODE_ENV === 'production') {
  // fire for every 'page' change
  exports.onRouteChange = (state, page, pages) => {

    //make sure GA is loaded
    if (ga) {
      //send pageview hit for current path
      ga('send', 'pageview', {
        page: state.path,
      })
    }
  }
}
