const containerPlugin = require('markdown-it-container');

module.exports = function(md, options) {

	//register actual container plugin
  md.use(containerPlugin, 'timeline');
  md.use(containerPlugin, 'timeline__item');
};
