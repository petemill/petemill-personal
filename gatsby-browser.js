//tracking script is only loaded for production
if (process.env.NODE_ENV === 'production') {
  //pasted GA init script
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  //init GA account
  ga('create', 'UA-84020551-1', 'auto');
  // fire for every 'page' change (including current)
  exports.onRouteUpdate = (state, page, pages) => {

    //make sure GA is loaded
    if (ga) {
      //send pageview hit for current path
      ga('send', 'pageview', {
        page: state.pathname,
      })
    }
  }
}
