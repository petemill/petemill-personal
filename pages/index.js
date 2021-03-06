import React, {Component, PropTypes} from 'react'
import DocumentTitle from 'react-document-title'
import { config } from 'config'
import ProjectLinks from '../components/ProjectLinks';
import ArticleLinks from '../components/ArticleLinks';
import styleHome from './home.module.scss';
import stylesSection from './home-section.module.scss';
import stylesTypography from './typography.module.scss';
import stylesTechnologyList from './technology-list.module.scss';
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

        <section className={stylesSection['section--home']}>
          <div className={stylesSection['header--home']}>
            <h1 className={stylesSection['title--site']}>Pete Miller</h1>
            <p className={stylesSection['subtitle']}>I'm a full-stack developer with people and product management experience</p>
          </div>
          <div className={stylesSection.data}>
            <p className={stylesTypography.subtitle}>I have a passion for the web. I love to work on front-end and server-side problems, whilst architecting data structures, build and deployment setup, and creating cloud infrastructure. I also enjoy the personal nature of devices and am motivated to work on apps which empower people.</p>
            <p className={stylesTypography.subtitle}>I have architected, managed and implemented several high-scale consumer-facing websites, apps and internal tools.</p>
            <p className={stylesTypography.subtitle}>I enjoy working within multi-disciplined teams and have experience creating, empowering and leading them in large and small organizations. I'm passionate about communication strategies and workflow that makes everyone feel happy to work. I've been working on a startup, finesse.io, which helps designers contribute to the front-end code for any website.</p>
            <p className={stylesTypography.subtitle}>I'm a detail-oriented analytical thinker with experience in product strategy and analysis using analytics tools. I also love to take part in UX research and prototyping, empathizing with user-intentions to continuously improve digital products.</p>
          </div>
        </section>

        <section className={stylesSection['section--projects']}>
          
          <h2 className={stylesSection['title--projects']}>
            Projects
          </h2>
        
          <div className={stylesSection.data}>
            
            <div className={stylesSection.intro}>
              <h3 className={stylesSection['subtitle']}>A selection of projects I've worked on.<br />Choose one to view details of my involvement:</h3>
            </div>
            
            <ProjectLinks pages={GetPagesInPath(allPages, 'projects')} />

            <section className={stylesSection['external-link-section--linkedin']}>
              <h3 className={stylesSection['external-link-section__title']}>
                <a href="https://www.linkedin.com/in/petemill/" title="Peter Miller CV and Work Experience" className={stylesSection['external-link-section__link']}>View my work history on LinkedIn</a>
              </h3>
            </section>
          </div>
        </section>



        <section className={stylesSection['section--writing']}>
          
          <h2 className={stylesSection['title--writing']}>
            Writing
          </h2>
          <div className={stylesSection.data}>
            <div className={stylesSection.intro}>
              <h3 className={stylesSection['subtitle']}>Code, Workflow and other industry topics</h3>
            </div>
            
            <ArticleLinks pages={GetPagesInPath(allPages, 'writing')} />
            <section className={stylesSection['external-link-section--twitter']}>
              <h3 className={stylesSection['external-link-section__title']}>
                <a href="https://www.twitter.com/petemill/" title="Pete Miller Twitter" className={stylesSection['external-link-section__link']}>View my Twitter feed</a>
              </h3>
            </section>
          </div>
        </section>



        <section className={stylesSection['section--tech']}>
          
            <h2 className={stylesSection['title--tech']}>Technologies</h2>
          
          <div className={stylesSection.data}>
            <div className={stylesTechnologyList['technology-list-section']}>
              <h3 className={stylesTechnologyList['technology-list-section__title']}>Currently Working With</h3>
              <ul className={stylesTechnologyList['technology-list']}>
                <li className={stylesTechnologyList['technology-list__technology']}>Javascript</li>
                <li className={stylesTechnologyList['technology-list__technology']}>HTML</li>
                <li className={stylesTechnologyList['technology-list__technology']}>CSS</li>
                <li className={stylesTechnologyList['technology-list__technology']}>BEM</li>
                <li className={stylesTechnologyList['technology-list__technology']}>React</li>
                <li className={stylesTechnologyList['technology-list__technology']}>Redux</li>
                <li className={stylesTechnologyList['technology-list__technology']}>NodeJS</li>
                <li className={stylesTechnologyList['technology-list__technology']}>TypeScript</li>
                <li className={stylesTechnologyList['technology-list__technology']}>Flow</li>
                <li className={stylesTechnologyList['technology-list__technology']}>Go</li>
                <li className={stylesTechnologyList['technology-list__technology']}>Redis</li>
                <li className={stylesTechnologyList['technology-list__technology']}>DynamoDB</li>
                <li className={stylesTechnologyList['technology-list__technology']}>Docker</li>
                <li className={stylesTechnologyList['technology-list__technology']}>Cloud Architecture</li>
                <li className={stylesTechnologyList['technology-list__technology']}>Kubernetes</li>
                <li className={stylesTechnologyList['technology-list__technology']}>Linux</li>
                <li className={stylesTechnologyList['technology-list__technology']}>Git</li>
                <li className={stylesTechnologyList['technology-list__technology']}>Codeship / CircleCI</li>
              </ul>
            </div>
            <div className={stylesTechnologyList['technology-list-section']}>
              <h3 className={stylesTechnologyList['technology-list-section__title']}>Previous Experience With</h3>
              <ul className={stylesTechnologyList['technology-list']}>
                <li className={stylesTechnologyList['technology-list__technology']}>SQL</li>
                <li className={stylesTechnologyList['technology-list__technology']}>.net (C#)</li>
                <li className={stylesTechnologyList['technology-list__technology']}>Windows / IIS</li>
                <li className={stylesTechnologyList['technology-list__technology']}>KnockoutJS</li>
                <li className={stylesTechnologyList['technology-list__technology']}>Xamarin (iOS & Android)</li>
                <li className={stylesTechnologyList['technology-list__technology']}>Wordpress</li>
                <li className={stylesTechnologyList['technology-list__technology']}>Umbraco</li>
                <li className={stylesTechnologyList['technology-list__technology']}>Lucene</li>
                <li className={stylesTechnologyList['technology-list__technology']}>Windows Services</li>
                <li className={stylesTechnologyList['technology-list__technology']}>Windows Forms</li>
                <li className={stylesTechnologyList['technology-list__technology']}>Powershell</li>
                <li className={stylesTechnologyList['technology-list__technology']}>Mercurial</li>
                <li className={stylesTechnologyList['technology-list__technology']}>Teamcity</li>
              </ul>
            </div>

            <section className={stylesSection['external-link-section--github']}>
              <h3 className={stylesSection['external-link-section__title']}>
                <a href="https://github.com/petemill/" title="Pete Miller Github code" className={stylesSection['external-link-section__link']}>View my code contributions on Github</a>
              </h3>
            </section>
          </div>
        </section>


      </div>
    )
  }


}
