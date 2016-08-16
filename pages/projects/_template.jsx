import React from 'react'
import { Link } from 'react-router'
import { prefixLink } from 'gatsby-helpers'


module.exports = React.createClass({
  propTypes () {
    return {
      children: React.PropTypes.any,
    }
  },
  render () {
    return (
      <div>
        <p>Inner pages template</p>
          {this.props.children}
      </div>
    )
  }
})
