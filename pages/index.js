import React, {Component, PropTypes} from 'react'
import DocumentTitle from 'react-document-title'
import { config } from 'config'
import ProjectLinks from '../components/ProjectLinks';
import styleHome from './home.module.scss';
import stylesSection from './home-section.module.scss';
import stylesTypography from './typography.module.scss';
import {GetPagesInPath} from '../utils/PageData';



export default class ReactComponent extends Component {


  constructor () {

    super()
  }


  static get propTypes() {

    return {
      route: PropTypes.object
    }
  }


  render () {

    //all page data
    const allPages = this.props.route.pages;
    //render to components
    return (
      <div className={styleHome.home}>

        <section className={stylesSection.section}>
          <div className={stylesSection.header}>
            <h1 className={stylesSection['title--site']}>Pete Miller</h1>
            <p className={stylesTypography.body}>I'm a full-stack developer with people and product management experience</p>
          </div>
          <div className={stylesSection.body}>
            <p className={stylesTypography.body}>I have a passion for the web. I love to work on front-end and back-end problems, whilst architecting data structures, build and deployment setup, and creating cloud infrastructure. I also enjoy the personal nature of devices and apps and am motivated to work on apps which empower people.</p>
            <p className={stylesTypography.body}>I have architected, managed and implemented several high-scale consumer-facing websites, apps and internal tools.</p>
            <p className={stylesTypography.body}>I enjoy working within multi-disciplined teams and have experience creating, empowering and leading them in large and small organizations. I'm passionate about communication strategies and workflow that makes everyone feel happy to work. I've been working on a startup, finesse.io, which helps designers contribute to the front-end code for any website.</p>
            <p className={stylesTypography.body}>I'm a detail-oriented analytical thinker with experience in business analysis using website and social media analytics tools. I also love to take part in UX research and prototyping, empathizing with user-intentions to continuously improve digital experiences.</p>
          </div>
        </section>

        <section className={stylesSection['section']}>
          <div className={stylesSection.header}>
            <h2 className={stylesSection.title}>
              Projects
            </h2>
            <p className={stylesTypography.body}>Select a project to view details of my involvement</p>
          </div>
          <div className={stylesSection.body}>
            <ProjectLinks pages={GetPagesInPath(allPages, 'projects')} />
          </div>
        </section>
      </div>
    )
  }


}
