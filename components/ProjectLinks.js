import React, {Component, PropTypes} from 'react';
const sortBy = require('lodash.sortby');
import ProjectLink from './ProjectLink/project-link';

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
    const sortedPages = sortBy(pages, (page) => page.data.sort || 0).reverse();
    //convert to elements
    return (
      <div className="project-links">
        {sortedPages.map(page => <ProjectLink key={page.path} name={page.data.title} path={page.path} daterange={page.data.daterange || ''} />)}
      </div>
    );
  }


}
