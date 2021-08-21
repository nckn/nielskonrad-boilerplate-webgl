import each from 'lodash/each'

import Animation from 'classes/Animation'
import GSAP from 'gsap'

import { CSS } from 'utils/easings'
import { calculate, split } from 'utils/text'

export default class extends Animation {
  constructor ({ element }) {
    const lines = []
    const paragraphs = element.querySelectorAll('h1, h2, p')

    if (paragraphs.length !== 0) {
      each(paragraphs, element => {
        split({ element })
        split({ element })

        lines.push(...element.querySelectorAll('span span'))
      })
    } else {
      split({ element })
      split({ element })

      lines.push(...element.querySelectorAll('span span'))
    }

    super({
      element,
      elements: {
        lines
      }
    })

    this.onResize()

    // this.setToZero()

    if ('IntersectionObserver' in window) {
      this.animateOut()
    }
  }

  animateIn () {
    // this.elementAttr = this.element.getBoundingClientRect()
    // if (this.elementAttr.top < window.innerHeight) {
    //   return
    // }

    super.animateIn()

    // console.log('element ')
    // console.log(this.element)
    // console.log(this.element.getBoundingClientRect())
    // console.log('window.scrollY')
    // console.log(window.scrollY)
    // console.log('window inner height')
    // console.log(window.innerHeight)

    each(this.lines, (line, lineIndex) => {
      each(line, word => {
        word.style.transition = `transform 1.5s ${lineIndex * 0.1}s ${CSS}`
        word.style[this.transformPrefix] = 'translateY(0)'
      })
    })
  }

  animateOut () {
    super.animateOut()

    each(this.lines, line => {
      each(line, word => {
        word.style[this.transformPrefix] = 'translateY(100%)'
      })
    })
  }

  setToZero () {
    super.animateOut()

    console.log('setToZero')
    
    // window.requestAnimationFrame(_ => {
    //   this.animateOut()
    // })
    // each(this.lines, (line, lineIndex) => {
    //   each(line, word => {
    //     word.style[this.transformPrefix] = 'translateY(100%)'
    //   })
    //   // GSAP.set(line, {
    //   //   // opacity: 0,
    //   //   transform: `translateY(${0}%)`
    //   // })
    // })
    each(this.lines, (line, lineIndex) => {
      each(line, word => {
        // word.style[this.transformPrefix] = 'translateY(100%)'
        GSAP.set(line, {
          // opacity: 0,
          transform: `translateY(${100}%)`
        })
      })
    })
  }

  onResize () {
    this.lines = calculate(this.elements.lines)
  }
}
