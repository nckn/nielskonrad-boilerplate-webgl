require('dotenv').config()

const logger = require('morgan')
const express = require('express')
const errorHandler = require('errorhandler')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const find = require('lodash/find')

const app = express()
const path = require('path')
const port = 4321

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())
app.use(errorHandler())
app.use(express.static(path.join(__dirname, 'public')))

// const Prismic = require('@prismicio/client')
// const PrismicDOM = require('prismic-dom')
const UAParser = require('ua-parser-js')

// const initApi = req => {
//   return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
//     accessToken: process.env.PRISMIC_ACCESS_TOKEN,
//     req
//   })
// }

const handleLinkResolver = doc => {
  // if (doc.type === 'project') {
  //   return `/detail/${doc.uid}`
  // }

  return '/'
}

app.use((req, res, next) => {
  const ua = UAParser(req.headers['user-agent'])

  res.locals.isDesktop = ua.device.type === undefined
  res.locals.isPhone = ua.device.type === 'mobile'
  res.locals.isTablet = ua.device.type === 'tablet'

  res.locals.Link = handleLinkResolver

  // res.locals.Numbers = index => {
  //   return index == 0 ? 'One' : index == 1 ? 'Two' : index == 2 ? 'Three' : index == 3 ? 'Four' : '';
  // }

  // res.locals.PrismicDOM = PrismicDOM

  next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

const handleRequest = async api => {
  const about = await api.getSingle('about')
  const home = await api.getSingle('home')
  const meta = await api.getSingle('meta')
  const navigation = await api.getSingle('navigation')
  const preloader = await api.getSingle('preloader')

  // console.log(home)

  // console.log('productsData')
  // console.log(productsData[0])
  
  const { results: domains } = await api.query(Prismic.Predicates.at('document.type', 'domain'), {
    fetchLinks: 'project.project_main_image'
  })
  console.log('domains')
  console.log(domains)
  // console.log('domains project url')
  // // console.log(domains[0].data.projects[0].domain_project.data.project_main_image)
  // console.log(domains[0].data)
  
  const { results: projectsData } = await api.query(Prismic.Predicates.at('document.type', 'project'), {
    fetchLinks: 'domain.title',
    pageSize: 100
  })

  const projects = projectsData
  console.log('projectsData')
  console.log(projectsData[0].data.project_main_image)
  
  // const products = []
  
  const domainProjects = []

  domains.forEach(domain => {
    // console.log('domain')
    // console.log(domain)
    domain.data.projects.forEach(({ domain_project: { uid } }, index) => {
      // console.log('projectsData')
      // console.log(projectsData)
      // console.log('domain')
      // console.log(domain.data)
      // if (index === 0) {
      //   console.log('domain')
      //   console.log(domain.data.domain_projects)
      // }
      domainProjects.push(find(projectsData, { uid }))
    })
  })

  const assets = []

  home.data.gallery.forEach(item => {
    assets.push(item.image.url)
  })

  about.data.gallery.forEach(item => {
    assets.push(item.image.url)
  })

  about.data.body.forEach(section => {
    if (section.slice_type === 'gallery') {
      section.items.forEach(item => {
        assets.push(item.image.url)
      })
    }
  })
  
  domains.forEach(domain => {
    domain.data.projects.forEach(item => {
      // console.log('item')
      // console.log(item)
      assets.push(item.domain_project.data.project_main_image.url)
      // assets.push(item.products_product.data.model.url)
    })
  })

  return {
    about,
    assets,
    domains,
    home,
    meta,
    navigation,
    preloader,
    // products,
    domainProjects,
    projects
  }
}

app.get('/', async (req, res) => {
  // const api = await initApi(req)
  // const defaults = await handleRequest(api)

  res.render('base', {
    // ...defaults
  })
})

// app.get('/about', async (req, res) => {
//   const api = await initApi(req)
//   const defaults = await handleRequest(api)

//   res.render('base', {
//     ...defaults
//   })
// })

// app.get('/collections', async (req, res) => {
//   const api = await initApi(req)
//   const defaults = await handleRequest(api)

//   res.render('base', {
//     ...defaults
//   })
// })

// app.get('/domains', async (req, res) => {
//   const api = await initApi(req)
//   const defaults = await handleRequest(api)

//   res.render('base', {
//     ...defaults
//   })
// })

// app.get('/detail/:uid', async (req, res) => {
//   const api = await initApi(req)
//   const defaults = await handleRequest(api)

//   res.render('base', {
//     ...defaults
//   })
// })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
