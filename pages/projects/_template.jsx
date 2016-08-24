import React from 'react'
import InnerNav from '../../components/InnerNav';
import stylePage from '../page.module.scss';
require('./timeline.scss');
require('./technology-list.scss');
require('./role-list.scss');

module.exports = React.createClass({
  propTypes () {
    return {
      children: React.PropTypes.any,
    }
  },
  render () {
    return (
      <div className={stylePage['page--project']}>
        <InnerNav sectionName="Projects" />
        {this.props.children}
      </div>
    )
  }
})
