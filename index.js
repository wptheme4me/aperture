// for production in netlify
var metalsmith = require('metalsmith')
var collections = require('metalsmith-collections');
var markdown = require('metalsmith-markdown')
var sass = require('metalsmith-sass')
var ignore = require('metalsmith-ignore')
var htmlMinifier = require('metalsmith-html-minifier')
var layouts = require('metalsmith-layouts')
var uglify = require('metalsmith-uglify')
var autoprefixer = require('metalsmith-autoprefixer')
var sitemap = require('metalsmith-sitemap')
var robots = require('metalsmith-robots')
var config = require('./config')

metalsmith(__dirname)
  .metadata({
    sitename: config.site_title,
    siteurl: config.prod_siteurl,
    style_sheet: config.style_sheet,
    googleanalytics: config.google_analytics_key,
    facebook_appid: config.facebook_appid
  })
  .source('src')
  .destination('build')
  .clean(true)
  .use(markdown())
  .use(collections({  // Used for navigation purposes
    default: {
      pattern: 'default/**/*.md',
      refer: false, // skip adding the "next" and "previous" links to your articles
      // sortBy: 'title',
      // reverse: true
    }
  }))
  .use(layouts({
    engine: 'pug',
    directory: 'layouts',
    pretty: false // 'false' minifies HTML
  }))
  .use(sass({ // Options https://github.com/sass/node-sass
    outputDir: 'css',
    outputStyle: 'compressed', //Values: nested, expanded, compact, compressed
    includePaths: ['sass', 'sass/partials']
  }))
  .use(autoprefixer())
  .use(uglify())
  .use(htmlMinifier({
    minifierOptions: {
      removeComments: true,
      removeAttributeQuotes: false
    }
  }))
  .use(sitemap({ // https://www.npmjs.com/package/metalsmith-sitemap
    hostname: config.prod_siteurl,
    lastmod: Date()
  }))
  .use(robots({ // https://www.npmjs.com/package/metalsmith-robots
    useragent: '*',
    allow: '/',
    disallow: ['404.html'],
    sitemap: config.prod_siteurl + '/sitemap.xml'
  }))
  // .use(ignore(['**/*']))
  .build(function (err) {
    if (err) throw err
  })