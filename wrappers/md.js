import React from 'react'
import DocumentTitle from 'react-document-title'
import { config } from 'config'
require('../components/ProseContent/prose-content.scss');

module.exports = React.createClass({
  propTypes () {
    return {
      router: React.PropTypes.object,
    }
  },
  render () {
    const post = this.props.route.page.data
    return (
      <DocumentTitle title={`${post.title} | ${config.siteTitle}`}>
        <article className="prose-content">
          <h1>{post.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.body }} />
        </article>
      </DocumentTitle>
    )
  },
})
