import each from 'lodash/each'

import Animation from 'classes/Animation'
import GSAP from 'gsap'

import { getOffset } from 'utils/dom'
import { CSS } from 'utils/easings'
// import { calculate, split } from 'utils/text'

export default class extends Animation {
  constructor ({ element }) {

    super({
      element
    })

    this.onResize()

    console.log('this is the element:')
    console.log(this.element)

    // this.setToZero()

    if ('IntersectionObserver' in window) {
      this.animateOut()
    }
  }

  animateIn () {

    super.animateIn()

    console.log('should animate in')

    GSAP.to(this.element, 1, {
      width: '100%',
      ease: 'expo.out',
      delay: 1
    })
  }

  animateOut () {
    super.animateOut()

    GSAP.to(this.element, 1, {
      width: '0%',
      ease: 'expo.out',
      delay: 1
    })
  }

  onResize () {
    this.offset = getOffset(this.element)
    console.log('the offset:')
    console.log(this.offset)
    // this.lines = calculate(this.elements.lines)
  }

  // update (scroll) {
  //   if (!this.offset) {
  //     return
  //   }

  //   const { innerHeight } = window

  //   const offsetBottom = scroll.current + innerHeight

  //   if (offsetBottom >= this.offset.top) {
  //     this.parallax = clamp(-this.amount, this.amount, map(this.offset.top - scroll.current, -this.offset.height, innerHeight, this.amount, -this.amount))
  //     this.scale = clamp(1, 1.15, map(this.offset.top - scroll.current, -this.offset.height, innerHeight, 1, 1.15))

  //     // this.media.style[this.transform] = `translate3d(0, ${this.parallax}px, 0) scale(${this.scale})`
  //     this.media.style[this.transform] = `translate3d(0, ${this.parallax}px, 0)`
  //   } else {
  //     // this.media.style[this.transform] = `translate3d(0, -${this.amount}px, 0) scale(1.15)`
  //     this.media.style[this.transform] = `translate3d(0, -${this.amount}px, 0)`
  //   }
  // }

}
