import React, {Component, PropTypes} from 'react';
const sortBy = require('lodash.sortby');
import ArticleLink from './ArticleLink';

export default class ProjectLinks extends Component {


  static get propTypes() {

    return {
      pages: PropTypes.array.isRequired
    }
  }


  render() {

    //get all pages we will render (should be pre-filtered)
    const { pages } = this.props;
    //page sort order
    const sortedPages = sortBy(pages, (page) => page.data.created_utc || 0).reverse();
    //convert to elements
    return (
      <div className="article-links">
        {sortedPages.map(page => <ArticleLink key={page.path} name={page.data.title} path={page.path} description={page.data.description} />)}
      </div>
    );
  }


}
