import React, {Component, PropTypes} from 'react';
const classNames = require('classnames');
const sortBy = require('lodash.sortby');
import ArticleLink from './ArticleLink';
const expansionThreshold = 8;
import stylesContentList from './content-list.module.scss';

export default class ProjectLinks extends Component {

  constructor(props) {

    super(props);
    this.state = {
      showExpanded: props.showExpanded ? true : false
    };
  }

  static get propTypes() {

    return {
      pages: PropTypes.array.isRequired
    }
  }


  render() {

    //get all pages we will render (should be pre-filtered)
    const { pages } = this.props;
    //sort pages to order and categories
    const sortedPages = sortBy(pages, (page) => page.data.created_utc || 0).reverse();
    const displayedPages = this.state.showExpanded ? sortedPages : sortedPages.slice(0,expansionThreshold);
    const hiddenPages = this.state.showExpanded ? [] : sortedPages.slice(expansionThreshold);
    //convert to elements
    return (
      <div className={stylesContentList['content-list']}>

        {displayedPages.map(page => <ArticleLink className={stylesContentList.item} key={page.path} name={page.data.title} path={page.path} description={page.data.description} />)}

        {hiddenPages.map(page => <ArticleLink className={classNames(stylesContentList.item, stylesContentList.overThreshold)} key={page.path} name={page.data.title} path={page.path} description={page.data.description} />)}

        <button type="button" className={classNames(
          stylesContentList['expand-command'], {
          [stylesContentList['-is-expanded']]: this.state.showExpanded
        })} onClick={() => this.toggleExpanded()}>Show {this.state.showExpanded ? "fewer" : "more"} articles</button>

      </div>
    );
  }


  toggleExpanded() {

    this.setState({
      ...this.state,
      showExpanded: !this.state.showExpanded
    });
  }


}
