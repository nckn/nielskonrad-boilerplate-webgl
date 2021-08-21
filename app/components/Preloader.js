import { Texture } from 'ogl'
import GSAP from 'gsap'

import each from 'lodash/each'

import Component from 'classes/Component'

import { DEFAULT as ease } from 'utils/easings'
import { split } from 'utils/text'

export default class Preloader extends Component {
  constructor ({ canvas, callbackFakingPreloading }) {
    super({
      element: '.preloader',
      elements: {
        title: '.preloader__text',
        number: '.preloader__number',
        numberText: '.preloader__number__text'
      }
    })

    this.canvas = canvas

    this.callback = callbackFakingPreloading

    // If no data is loaded from anywhere such as Prismic then skip the preloader process
    this.hasDataToLoad = false

    window.TEXTURES = {}

    this.elements.titleSpans = split({
      append: true,
      element: this.elements.title,
      expression: '<br>'
    })

    each(this.elements.titleSpans, element => {
      split({
        append: false,
        element,
        expression: ''
      })
    })

    this.length = 0

    if (this.hasDataToLoad) {
      this.createLoader()
      console.log('has data')
    }
    // Faking the preloader
    else {
      console.log('no data')
      this.onLoaded()
      // console.log('callback')
      this.callback()
      // animate and remove the .preloader elem after 1000 ms
      // setTimeout(_ => {
      //   this.animateOut.to(this.element, {
      //     autoAlpha: 0,
      //     duration: 1
      //   })
      //   this.animateOut.call(_ => {
      //     this.destroy()
      //   })
      // }, 1000)
      // console.log(this)
    }
  }

  createLoader () {
    this.animateIn = GSAP.timeline()

    this.animateIn.set(this.elements.title, {
      autoAlpha: 1
    })

    each(this.elements.titleSpans, (line, index) => {
      const letters = line.querySelectorAll('span')

      const onStart = _ => {
        GSAP.fromTo(letters, {
          autoAlpha: 0,
          display: 'inline-block',
          y: '100%'
        }, {
          autoAlpha: 1,
          delay: 0.2,
          display: 'inline-block',
          duration: 1,
          ease: 'back.inOut',
          stagger: 0.015,
          y: '0%'
        })
      }

      this.animateIn.fromTo(line, {
        autoAlpha: 0,
        y: '100%'
      }, {
        autoAlpha: 1,
        delay: 0.2 * index,
        duration: 1.5,
        onStart,
        ease: 'expo.inOut',
        y: '0%'
      }, 'start')
    })

    this.animateIn.call(_ => {
      window.ASSETS.forEach(image => {
        const texture = new Texture(this.canvas.gl, {
          generateMipmaps: false
        })

        const media = new window.Image()

        media.crossOrigin = 'anonymous'
        media.src = image
        media.onload = _ => {
          texture.image = media

          this.onAssetLoaded()
        }

        window.TEXTURES[image] = texture
      })
    })
  }

  // Run every time an image asset has been loaded
  onAssetLoaded (image) {
    this.length += 1

    const percent = this.length / window.ASSETS.length

    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`

    if (percent === 1) {
      this.onLoaded()
    }

    // console.log('an image asset has been loaded')
    // console.log(percent)
  }

  onLoaded () {
    let self = this
    console.log('onLoaded method')
    // console.log(this)
    // window.requestAnimationFrame(_ => {
    //   self.emit('completed')
    // })
    // if (!this.hasDataToLoad) {
    //   console.log('has no data should tell that to parent')
    //   self.emit('completed')
    //   return
    // }
    return new Promise(resolve => {
      this.emit('completed')

      this.animateOut = GSAP.timeline({
        delay: 1
      })

      each(this.elements.titleSpans, (line, index) => {
        const letters = line.querySelectorAll('span')

        const onStart = _ => {
          GSAP.to(letters, {
            autoAlpha: 0,
            delay: 0.2,
            display: 'inline-block',
            duration: 1,
            ease: 'back.inOut',
            stagger: 0.015,
            y: '-100%'
          })
        }

        this.animateOut.to(line, {
          autoAlpha: 0,
          delay: 0.2 * index,
          duration: 1.5,
          onStart,
          ease: 'expo.inOut',
          y: '-100%'
        }, 'start')
      })

      this.animateOut.to(this.elements.numberText, {
        autoAlpha: 0,
        duration: 1,
        ease
      }, 'start')

      this.animateOut.to(this.element, {
        autoAlpha: 0,
        duration: 1
      })

      this.animateOut.call(_ => {
        this.destroy()
      })
    })
  }

  destroy () {
    console.log('trying to destroy')
    this.element.parentNode.removeChild(this.element)
  }
}
