import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import NormalizeWheel from 'normalize-wheel'
import ASScroll from '@ashthornton/asscroll'
import each from 'lodash/each'

import vertex from 'shaders/vertex.glsl'
import fragment from 'shaders/fragment.glsl'

// import Canvas from 'components/Canvas'
import Navigation from 'components/Navigation'
import Preloader from 'components/Preloader'
import Transition from 'components/Transition'

import Home from 'pages/Home'

class App {
  constructor (options) {
    this.template = window.location.pathname

    this.container = options.domElement
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.time = 0
    this.animationRunning = false

    this.asscroll = new ASScroll({
      disableRaf: true
    })

    this.asscroll.enable({
      horizontalScroll: !document.body.classList.contains('b-subpage')
    })
    this.time = 0

    // this.createCanvas()
    this.setupSettings()
    this.init()

    this.addObjects()
    // this.addTestObject()

    this.createPreloader()
    this.createTransition()
    this.createNavigation()
    this.createPages()

    this.onResize()

    this.addEventListeners()
    this.addClickEventsForImages()
    this.addLinkListeners()

    

    console.log('should react - init')

    // Barba
    // this.setupBarba()

    // setTimeout(_ => {
    //   this.initASScroll()
    //   this.onResize()
    // }, 3000)

    console.log('this.update()')
    this.update()
  }

  setupSettings () {
    this.settings = {
      progress: 0
    }
    this.gui = new dat.GUI()
    this.gui.add(this.settings, 'progress', 0, 1, 0.001)
  }

  init() {

    this.camera = new THREE.PerspectiveCamera( 30, this.width / this.height, 10, 1000 )
    this.camera.position.z = 600
    this.camera.fov = (2 * Math.atan(this.height / 2 / 600) * 180) / Math.PI

    this.imagesAdded = 0

    this.scene = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    // this.renderer.setPixelRatio(2);
    this.container.appendChild(this.renderer.domElement)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.materials = []
  }

  addTestObject() {
    const geometry = new THREE.BoxGeometry( 100, 100, 100 )
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} )
    const cube = new THREE.Mesh( geometry, material )
    this.scene.add( cube )
  }

  addObjects () {
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 100, 100)
    console.log(this.geometry)
    this.material = new THREE.ShaderMaterial({
      // wireframe: true,
      uniforms: {
        time: { value: 1.0 },
        uProgress: { value: 0 },
        uTexture: { value: null },
        uTextureSize: { value: new THREE.Vector2(100, 100) },
        uCorners: { value: new THREE.Vector4(0, 0, 0, 0) },
        uResolution: { value: new THREE.Vector2(this.width, this.height) },
        uQuadSize: { value: new THREE.Vector2(300, 300) }
      },
      vertexShader: vertex,
      fragmentShader: fragment
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.scale.set(300, 300, 1)
    // this.scene.add( this.mesh );
    this.mesh.position.x = 300

    this.images = [...document.querySelectorAll('.js-image')]

    this.imageStore = this.images.map(img => {
      let bounds = img.getBoundingClientRect()
      let m = this.material.clone()
      this.materials.push(m)
      let texture = new THREE.Texture(img)
      texture.needsUpdate = true

      m.uniforms.uTexture.value = texture

      // img.addEventListener('mouseout',()=>{
      //     this.tl = gsap.timeline()
      //     .to(m.uniforms.uCorners.value,{
      //         x:0,
      //         duration: 0.4
      //     })
      //     .to(m.uniforms.uCorners.value,{
      //         y:0,
      //         duration: 0.4
      //     },0.1)
      //     .to(m.uniforms.uCorners.value,{
      //         z:0,
      //         duration: 0.4
      //     },0.2)
      //     .to(m.uniforms.uCorners.value,{
      //         w:0,
      //         duration: 0.4
      //     },0.3)
      // })

      let mesh = new THREE.Mesh(this.geometry, m)
      this.scene.add(mesh)
      mesh.scale.set(bounds.width, bounds.height, 1)
      return {
        img: img,
        mesh: mesh,
        width: bounds.width,
        height: bounds.height,
        top: bounds.top,
        left: bounds.left
      }
    })
  }

  initASScroll() {
    this.asscroll = new ASScroll({
      disableRaf: true,
      containerElement: document.querySelector(
        '[asscroll-container]'
      )
    })

    this.asscroll.enable({
      horizontalScroll: !document.body.classList.contains('b-subpage')
    })
  }

  createNavigation () {
    this.navigation = new Navigation({
      template: this.template
    })
  }

  createPreloader () {
    console.log('creating preloader')
    console.log('canvas')
    // console.log(this.canvas)

    this.preloader = new Preloader({
      // canvas: this.canvas,
      callbackFakingPreloading: () => {
        console.log('faking preloading works')
        // this.onPreloaded()
        // Update the 3D scene and camera
        console.log('after preloader - initScroll')
        this.initASScroll()
        this.onResize()
      }
    })

    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

  // createCanvas () {
  //   this.canvas = new Canvas({
  //     template: this.template
  //   })
  // }

  createTransition () {
    this.transition = new Transition()
  }

  createPages () {
    // console.log('creates page?')
    this.home = new Home()
    // this.about = new About()
    // console.log('home')
    // console.log(this.home)

    this.pages = {
      '/': this.home,
      // '/about': this.about
    }

    this.page = this.pages[this.template]

    this.page.show()
  }

  /**
   * Events.
   */
  async onPreloaded () {
    this.onResize()

    // this.canvas.onPreloaded()

    console.log('we are done preloading')
    // await this.page.show()
    // setTimeout(_ => {
    //   this.page.show()
    // }, 2000)
  }

  onPopState () {
    alert('pop state')
    this.onChange({
      url: window.location.pathname,
      push: false
    })
  }

  async onChange ({ url, push = true }) {
    url = url.replace(window.location.origin, '')

    const page = this.pages[url]

    await this.transition.show({
      color: page.element.getAttribute('data-color')
    })

    if (push) {
      window.history.pushState({}, '', url)
    }

    this.template = window.location.pathname

    this.page.hide()

    this.navigation.onChange(this.template)
    // this.canvas.onChange(this.template)

    this.page = page
    this.page.show()

    this.onResize()

    this.transition.hide()
  }

  onResize () {
    if (this.page && this.page.onResize) {
      this.page.onResize()
    }

    this.resizeSceneAndViewPort()
  }

  resizeSceneAndViewPort() {
    console.log('resizeSceneAndViewPort 1c')
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()

    this.camera.fov = (2 * Math.atan(this.height / 2 / 600) * 180) / Math.PI

    this.materials.forEach(m => {
      m.uniforms.uResolution.value.x = this.width
      m.uniforms.uResolution.value.y = this.height
    })

    this.imageStore.forEach(i => {
      let bounds = i.img.getBoundingClientRect()
      i.mesh.scale.set(bounds.width, bounds.height, 1)
      i.top = bounds.top
      i.left = bounds.left + this.asscroll.currentPos
      i.width = bounds.width
      i.height = bounds.height

      i.mesh.material.uniforms.uQuadSize.value.x = bounds.width
      i.mesh.material.uniforms.uQuadSize.value.y = bounds.height

      i.mesh.material.uniforms.uTextureSize.value.x = bounds.width
      i.mesh.material.uniforms.uTextureSize.value.y = bounds.height
    })
  }

  onTouchDown (event) {
    console.log('should react - OnTouchDown')
    // if (this.canvas && this.canvas.onTouchDown) {
    //   this.canvas.onTouchDown(event)
    // }

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchDown(event)
    }
  }

  onTouchMove (event) {
    if (this.page && this.page.onTouchDown) {
      this.page.onTouchMove(event)
    }
  }

  onTouchUp (event) {
    if (this.page && this.page.onTouchDown) {
      this.page.onTouchUp(event)
    }
  }

  onWheel (event) {
    // console.log('onWheel app/index')
    // console.log('this.page')
    // console.log(this.page)
    console.log('should react')
    // this.onResize()
    const normalizedWheel = NormalizeWheel(event)

    if (this.page && this.page.onWheel) {
      this.page.onWheel(normalizedWheel)
    }
  }

  setPosition () {
    // console.log(this.asscroll.currentPos)
    if (!this.animationRunning) {
      this.imageStore.forEach(o => {
        o.mesh.position.x =
          -this.asscroll.currentPos + o.left - this.width / 2 + o.width / 2
        o.mesh.position.y = -o.top + this.height / 2 - o.height / 2
      })
    }
  }

  /**
   * Loop.
   */
  update () {
    // if (this.page && this.page.update) {
    //   this.page.update()
    // }

    // if (this.canvas && this.canvas.update) {
    //   this.canvas.update(this.page.scroll)
    // }
    // console.log('update')

    this.time += 0.05
    this.material.uniforms.time.value = this.time

    this.asscroll.update()
    this.setPosition()
    this.renderer.render(this.scene, this.camera)
    // requestAnimationFrame(this.render.bind(this))

    this.frame = window.requestAnimationFrame(this.update.bind(this))
  }

  addClickEventsForImages () {
    this.imageStore.forEach(i => {
      i.img.addEventListener('click', () => {
        let tl = gsap
          .timeline()
          .to(i.mesh.material.uniforms.uCorners.value, {
            x: 1,
            duration: 0.4
          })
          .to(
            i.mesh.material.uniforms.uCorners.value,
            {
              y: 1,
              duration: 0.4
            },
            0.1
          )
          .to(
            i.mesh.material.uniforms.uCorners.value,
            {
              z: 1,
              duration: 0.4
            },
            0.2
          )
          .to(
            i.mesh.material.uniforms.uCorners.value,
            {
              w: 1,
              duration: 0.4
            },
            0.3
          )
      })
    })
  }

  /***
   * Listeners.
   */
  addEventListeners () {
    window.addEventListener('popstate', this.onPopState.bind(this))
    window.addEventListener('mousewheel', this.onWheel.bind(this))

    window.addEventListener('mousedown', this.onTouchDown.bind(this))
    window.addEventListener('mousemove', this.onTouchMove.bind(this))
    window.addEventListener('mouseup', this.onTouchUp.bind(this))

    window.addEventListener('touchstart', this.onTouchDown.bind(this))
    window.addEventListener('touchmove', this.onTouchMove.bind(this))
    window.addEventListener('touchend', this.onTouchUp.bind(this))

    window.addEventListener('resize', this.onResize.bind(this))
  }

  addLinkListeners () {
    const links = document.querySelectorAll('a')

    each(links, link => {
      const isLocal = link.href.indexOf(window.location.origin) > -1

      const isNotEmail = link.href.indexOf('mailto') === -1
      const isNotPhone = link.href.indexOf('tel') === -1

      if (isLocal) {
        link.onclick = event => {
          event.preventDefault()

          this.onChange({
            url: link.href
          })
        }

        link.onmouseenter = event => this.onLinkMouseEnter(link)
        link.onmouseleave = event => this.onLinkMouseLeave(link)
      } else if (isNotEmail && isNotPhone) {
        link.rel = 'noopener'
        link.target = '_blank'
      }
    })
  }
}

new App({
  domElement: document.getElementById('container')
})
