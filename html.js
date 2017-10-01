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
          <link href="https://fonts.googleapis.com/css?family=Work+Sans|Space+Mono|Karla|Inconsolata|Roboto+Slab:300,400" rel="stylesheet" />
        </head>
        <body>
          <div id="react-mount" dangerouslySetInnerHTML={{ __html: this.props.body }} />
          <script src={prefixLink(`/bundle.js?t=${BUILD_TIME}`)} />
        </body>
      </html>
    )
  }


}
