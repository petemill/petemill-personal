import React, {Component, PropTypes} from 'react';
import styleInnerNav from './inner-nav.module.scss';
import { prefixLink } from 'gatsby-helpers';
import { Link } from 'react-router'

export default class InnerNav extends Component {

  static get propTypes() {
    return {
      sectionName: PropTypes.string.isRequired
    };
  }

  render() {

    const {sectionName} = this.props;
    return (
      <nav className={styleInnerNav[`inner-nav--${sectionName}`]}>
        <Link to={prefixLink('/')} className={styleInnerNav['site-title-link']}>Peter Miller</Link>
        <p className={styleInnerNav['site-section-name']}>{sectionName}</p>
        <Link to={prefixLink('/')} className={styleInnerNav['site-home-link']}>Home</Link>
      </nav>
    );
  }
}
