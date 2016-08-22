import React, {Component, PropTypes} from 'react'
import DocumentTitle from 'react-document-title'
import { config } from 'config'
import ProjectLinks from '../components/ProjectLinks';
import styleHome from './home.module.scss';



export default class ReactComponent extends Component {


  constructor () {

    super()
  }


  static get propTypes() {

    return {
      route: PropTypes.object
    }
  }


  renderProjectLinks() {

    //get all page data
    const allPages = this.props.route.pages;
    //filter to only project pages
    const projectPages = this.props.route.pages.filter(page => !page.path.includes('/404') && page.file.dirname.split('/')[0] === 'projects');
    //render to a project-link list
    return <ProjectLinks pages={projectPages} />;
  }


  render () {

    return (
      <div className={styleHome.home}>
        <div className={styleHome.intro}>
          <h1 className={styleHome['site-title']}>Pete Miller</h1>
          <p className={styleHome['site-subtitle']}>I'm a full-stack developer with people and product management experience</p>
        </div>

        <section className={styleHome.section}>
          <h2 className={styleHome['section-title']}>Intro</h2>
          <p className={styleHome['section-body']}>I have a passion for the web. I love to work on front-end and back-end problems, whilst architecting data structures, build and deployment setup, and creating cloud infrastructure. I also enjoy the personal nature of devices and apps and am motivated to work on apps which empower people.</p>
          <p className={styleHome['section-body']}>I have architected, managed and implemented several high-scale consumer-facing websites, apps and internal tools.</p>
          <p className={styleHome['section-body']}>I enjoy working within multi-disciplined teams and have experience creating, empowering and leading them in large and small organizations. I'm passionate about communication strategies and workflow that makes everyone feel happy to work. I've been working on a startup, finesse.io, which helps designers contribute to the front-end code for any website.</p>
          <p className={styleHome['section-body']}>I'm a detail-oriented analytical thinker with experience in business analysis using website and social media analytics tools. I also love to take part in UX research and prototyping, empathizing with user-intentions to continuously improve digital experiences.</p>
        </section>

        <section className={styleHome['section-body']}>
          <h2 className={styleHome['section-title']}>
            Projects
          </h2>
          <p className={styleHome['section-body']}>Select a project to view details of my involvement</p>
          {this.renderProjectLinks()}
        </section>
      </div>
    )
  }


}
