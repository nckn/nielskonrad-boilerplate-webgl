import AutoBind from 'auto-bind'
import Prefix from 'prefix'

export default class {
  constructor ({ element, elements }) {
    AutoBind(this)

    const { animationDelay, animationTarget } = element.dataset

    this.delay = animationDelay

    this.element = element
    this.elements = elements

    // console.log('this.element')
    // console.log(this.element.id)

    this.target = animationTarget ? element.closest(animationTarget) : element
    this.transformPrefix = Prefix('transform')

    this.isVisible = false

    if ('IntersectionObserver' in window) {
      this.createObserver()

      this.animateOut()
    } else {
      this.animateIn()
    }
  }

  createObserver () {
    this.observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!this.isVisible && entry.isIntersecting) {
          this.animateIn()
          // console.log('looking for seperator')
          // console.log(entry)
        } else {
          this.animateOut()
        }
      })
    }, {
      rootMargin: this.element.id === 'lineStd' ? '-20% 0px -20% 0px' : ''
      // threshold: 1.0
    }).observe(this.target)
  }

  animateIn () {
    this.isVisible = true
  }

  animateOut () {
    this.isVisible = false
  }
}
