import frontMatter from 'front-matter'
import markdownIt from 'markdown-it'
const blockEmbedPlugin = require("markdown-it-block-embed");
import hljs from 'highlight.js'
import objectAssign from 'object-assign'

const highlight = (str, lang) => {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(lang, str).value
    } catch (_error) {
      console.error(_error)
    }
  }
  try {
    return hljs.highlightAuto(str).value
  } catch (_error) {
    console.error(_error)
  }
  return '';
};

const md = markdownIt({
  html: true,
  linkify: false,
  typographer: true,
  highlight,
})
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-deflist'))
  .use(require('markdown-it-abbr'))
  .use(require('markdown-it-attrs'))
  .use(blockEmbedPlugin, {
    containerClassName: 'media-embed',
    outputPlayerSize: false,
    outputPlayerAspectRatio: true,
    allowInstancePlayerSizeDefinition: true,
    vimeo: {
      isBackground: true
    }
  })
  .use(require('./TimelineContainer'))

module.exports = function (content) {
  this.cacheable()
  const meta = frontMatter(content)
  const body = md.render(meta.body)
  const result = objectAssign({}, meta.attributes, {
    body,
  })
  this.value = result
  return `module.exports = ${JSON.stringify(result)}`
}
