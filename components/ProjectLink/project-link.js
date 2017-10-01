import React, {Component, PropTypes} from 'react';
import stylesProjectLink from './project-link.module.scss';
import {Link} from 'react-router';
import { prefixLink } from 'gatsby-helpers';

export default class ProjectLink extends Component {


  static propTypes() {

    return {
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      daterange: PropTypes.string.isRequired,
    }
  }


  render() {

    //collect data
    const {name, path, daterange} = this.props;
    //render markup
    return (
      <div className={stylesProjectLink['project-link']}>
          <Link to={prefixLink(path)} title={name}  className={stylesProjectLink['title']}>{name}</Link>
          <Link to={prefixLink(path)} title={name}  className={stylesProjectLink['year']}>{ daterange }</Link>
      </div>
    )
  }
}
