import moment from 'moment';
import { 
  message
} from 'antd'
import { 
  TweenMax,
  Sine,
  // Back
} from 'gsap'

// Here we sort chapters and sections alphabetically
const sortItems = (arr: any[]) => {
  arr.sort(function(a, b) {
    var textA = a.name.toLowerCase()
    var textB = b.name.toLowerCase()
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
  })
}

const radians = (degrees) => {
  return degrees * Math.PI / 180;
}

const distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

const map = (value, start1, stop1, start2, stop2) => {
  return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2
}

const generateRandomNumber = (min, max) => {
  var highlightedNumber = Math.random() * (max - min) + min
  // console.log(highlightedNumber)
  return highlightedNumber
}

const checkIfTouch = (e) => {
  var thisX, thisY
  if (e.touches != undefined) {
    thisX = e.touches[0].pageX
    thisY = e.touches[0].pageY
  }
  else {
    thisX = e.clientX
    thisY = e.clientY
  }
  return { x: thisX, y: thisY }
}

const transformStringToText = (str) => {
  let string = str.replace(/\-/g, ' ')
  // Capitalize it before sending it back
  let capString = string.charAt(0).toUpperCase() + string.slice(1)
  return capString
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const formatDate = isoDate => {
  let localDate = new Date(isoDate);
  let date = moment(localDate);
  let dateComponent = date.format('DD-MM-YYYY');
  let timeComponent = date.format('HH:mm:ss');
  return dateComponent + ', ' + timeComponent
}

// Trigger the success message
const triggerFeedbackMessage = (msg, messageDisplayDuration) => {
  message.success({
    content: msg,
    className: 'custom-class',
    style: {
      top: 'auto',
      bottom: '20px',
      right: '20px',
      left: 'auto'
    },
  }, messageDisplayDuration)
}

// Animation when hover a pillar card
const hoverTitleWrapper = ( classItem, animTime, animOffset ) => {
  // console.log('hover title wrapper')
  TweenMax.staggerTo(classItem, animTime, {
    y: 0,
    autoAlpha: 1,
    ease: Sine.easeOut      
  }, animOffset)
}

// Animation when mouse leaving a pillar card
const leaveTitleWrapper = ( classItem, animTime, animOffset ) => {
  // console.log('leave title wrapper')
  TweenMax.staggerTo(classItem, animTime, {
    // y: -40,
    y: 40,
    autoAlpha: 0,
    ease: Sine.easeOut,
  }, animOffset, () => {
    TweenMax.set(classItem, {
      y: -40,
      autoAlpha: 0
    })
  })
}

const transitionStyleEnter = {
  animation: "inAnimation 250ms ease-in"
}

const transitionStyleLeave = {
  animation: "outAnimation 270ms ease-out",
  animationFillMode: "forwards"
}

// call with transitionStyleEnter(0.01 * index), but does not work well
// const transitionStyleEnter = (delay) => {
//   return {
//     animation: "inAnimation 250ms ease-in",
//     animationDelay: `${delay}s`
//   }
// }

// const transitionStyleLeave = (delay) => {
//   return {
//     opacity: 0,
//     visibility: "hidden"
//   }
// }

export {
  sortItems,
  radians,
  distance,
  map,
  generateRandomNumber,
  checkIfTouch,
  transformStringToText,
  capitalizeFirstLetter,
  formatDate,
  triggerFeedbackMessage,
  hoverTitleWrapper,
  leaveTitleWrapper,
  // variables
  transitionStyleEnter,
  transitionStyleLeave
};
