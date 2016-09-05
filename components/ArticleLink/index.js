import React, {Component, PropTypes} from 'react';
import stylesArticleLink from './article-link.module.scss';
const classNames = require('classnames');
import {Link} from 'react-router';
import { prefixLink } from 'gatsby-helpers';
const moment = require('moment');

export default class ArticleLink extends Component {


  static propTypes() {

    return {
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      description: PropTypes.string,
      publishDate: PropTypes.date
    }
  }


  render() {

    //collect data
    const {name, path, description, publishDate} = this.props;
    //render markup
    return (
      <div className={classNames(this.props.className, stylesArticleLink['article-link'])}>
        <Link to={prefixLink(path)} title={name}  className={stylesArticleLink['title']}>{name}</Link>
      {description
        && <Link to={prefixLink(path)} title={name} className={stylesArticleLink['description']}>{description}</Link>
      }
      {publishDate
        && <Link to={prefixLink(path)} title={name} className={stylesArticleLink['publish-date']}>{moment(publishDate).fromNow()}</Link>
      }
      </div>
    )
  }
}
