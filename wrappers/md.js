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
          <h1 className="prose-content__title">{post.title}</h1>
          <div className="prose-content__body" dangerouslySetInnerHTML={{ __html: post.body }} />
        </article>
      </DocumentTitle>
    )
  },
})
