import Page from 'classes/Page'

import Titles from './Titles'
// import Link from 'animations/Link'
// import { mapEach } from 'utils/dom'

export default class extends Page {
  constructor () {
    super({
      id: 'home',

      classes: {
        active: 'home--active'
      },

      element: '.home',
      elements: {
        wrapper: '.home__wrapper',

        navigation: document.querySelector('.navigation'),
        // link: '.home__link',
        list: '.home',
        items: '.section--home', // The ones that are translated
        titles: '.home__titles__title__text'
      }
    })

    // Make the titles animation
    // const allProjectTitles = document.querySelectorAll('.home__titles__title')
    // console.log(allProjectTitles)
    // this.allProjectTitles = mapEach(allProjectTitles, element => {
    //   return new Link({
    //     element
    //   })
    // })
  }

  create () {
    // console.log('elements titles')
    // console.log(this.elements)

    super.create()

    this.titles = new Titles({
      element: document.body,
      elements: {
        list: this.elements.wrapper,
        items: this.elements.items,
        titles: this.elements.titles
      }
    })

    this.titles.enable()
  }

  /**
   * Animations.
   */
  async show (url) {
    // console.log('elem')
    // console.log(this.element)
    this.element.classList.add(this.classes.active)

    return super.show(url)
  }

  async hide (url) {
    this.element.classList.remove(this.classes.active)

    return super.hide(url)
  }

  /**
   * Events.
   */
  onResize () {
    super.onResize()

    this.titles.onResize()
  }

  onTouchDown (event) {
    this.titles.onTouchDown(event)
  }

  onTouchMove (event) {
    this.titles.onTouchMove(event)
  }

  onTouchUp (event) {
    this.titles.onTouchUp(event)
  }

  onWheel (event) {
    console.log('onWheel pages/Home')
    this.titles.onWheel(event)
  }

  /**
   * Loop.
   */
  update () {
    super.update()

    this.titles.update()
  }

  /**
   * Destroy.
   */
  destroy () {
    super.destroy()
  }
}
