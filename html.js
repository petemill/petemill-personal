import React, { Component, PropTypes } from 'react'
import DocumentTitle from 'react-document-title'
import { prefixLink } from 'gatsby-helpers'
const BUILD_TIME = new Date().getTime()


export default class Root extends Component {

  static get propTypes() {

    return {
      title: PropTypes.string,
    }
  }

  render () {

    const title = DocumentTitle.rewind()

    let css
    if (process.env.NODE_ENV === 'production') {
      css = <style dangerouslySetInnerHTML={{ __html: require('!raw!./public/styles.css') }} />
    }

    let tracking;
    if (process.env.NODE_ENV === 'production') {
      tracking = <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-84020551-1', 'auto');
        ga('send', 'pageview');
      </script>
    }

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width,user-scalable=no,minimum-scale=1.0,maximum-scale=1.0,minimal-ui"
          />
          <title>{title}</title>
          <link rel="shortcut icon" href={this.props.favicon} />
          {css}
          <link href="https://fonts.googleapis.com/css?family=Work+Sans|Space+Mono|VT323" rel="stylesheet" />
        </head>
        <body>  
          <div id="react-mount" dangerouslySetInnerHTML={{ __html: this.props.body }} />
          <script src={prefixLink(`/bundle.js?t=${BUILD_TIME}`)} />
          {tracking}
        </body>
      </html>
    )
  }


}
