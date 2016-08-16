import React from 'react'
require("normalize.css");
require('./html.scss');



module.exports = React.createClass({
  propTypes () {
    return {
      children: React.PropTypes.any,
    }
  },
  render () {
    return (
      <div>
          {this.props.children}
      </div>
    )
  }
})
