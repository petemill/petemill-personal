import React from 'react'
import { Link } from 'react-router'
import { prefixLink } from 'gatsby-helpers'

import stylePage from '../page.module.scss';

module.exports = React.createClass({
  propTypes () {
    return {
      children: React.PropTypes.any,
    }
  },
  render () {
    return (
        <p>Inner pages template</p>
          {this.props.children}
      <div className={stylePage['page--project']}>
      </div>
    )
  }
})
