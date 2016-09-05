import React from 'react'
import InnerNav from '../../components/InnerNav';
import stylePage from '../page.module.scss';

module.exports = React.createClass({
  propTypes () {
    return {
      children: React.PropTypes.any,
    }
  },
  render () {
    return (
      <div className={stylePage['page--project']}>
        <InnerNav sectionName="Writing" />
        {this.props.children}
      </div>
    )
  }
})
