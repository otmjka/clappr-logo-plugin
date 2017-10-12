import {UIContainerPlugin, Events} from 'clappr'
import t from 'clappr/src/base/template'

import {calculateSize} from './utils'
import logoHTML from './templates/logo.html'
import logoStyle from './styles/logo.scss'


export default class LogoPlugin extends UIContainerPlugin {

  get name() {return 'logo'}

  get template() {return t(logoHTML)}

  get attributes() {
    return {
      'class': 'player-logo',
      'data-logo': ''
    }
  }

  get shouldRender() {
    return !!this.options.logo.path
  }

  bindEvents() {
    window.addEventListener("resize", this.setPosition);
    this.listenTo(this.container, Events.CONTAINER_STOP, this.onStop)
    this.listenTo(this.container, Events.CONTAINER_PLAY, this.onPlay)
    this.listenTo(this.container, Events.CONTAINER_LOADEDMETADATA, this.setPosition)
  }

  stopListening() {
    window.removeEventListener("resize", this.setPosition);
    super.stopListening()
  }

  onPlay() {
    this.hasStartedPlaying = true
    this.update()
  }

  onStop() {
    this.hasStartedPlaying = false
    this.playRequested = false
    this.update()
  }

  update() {
    if (!this.shouldRender) {return}

    if (!this.hasStartedPlaying) {
      this.$el.hide()
    } else {
      this.$el.show()
    }
  }

  constructor(container) {
    super(container)
    this.setPosition = this.setPosition.bind(this)
    this.hasStartedPlaying = false
    this.playRequested = false
    this.render()
  }

  render() {
    if (!this.shouldRender) {return}
    this.$el.html(this.template())
    this.setLogoStyles()
    this.setLogoImgAttrs()
    this.container.$el.append(this.$el.get(0))
    this.update()
    return this
  }

  setLogoImgAttrs() {
    const {logo: {path: imgUrl, width = 60, height = 60}} = this.options
    this.$logoContainer = this.$el.find('.clappr-logo')
    const $logo = this.$logoContainer.find('.clappr-logo-img')
    $logo.attr({
      'src': `${imgUrl}`,
      'style': `width: ${width}px;height: ${height}px;`
    })
  }

  setPosition() {
    if (!this.shouldRender) {return}
    const $el = this.container.$el
    const targetRect = $el.get(0).getBoundingClientRect()
    const $video = $el.find('video[data-html5-video]')

    const {videoWidth, videoHeight} = $video.get(0)
    const dimensions = calculateSize({
      dom: {
        width: targetRect.width,
        height: targetRect.height
      },
      media: {
        width: videoWidth,
        height: videoHeight
      }
    })

    const {logo} = this.options
    const {letterboxing: {vertical, horizontal}} = dimensions
    const el = this.$logoContainer.get(0)

    this.setStyles(logo, ['top', 'bottom'], el, vertical)
    this.setStyles(logo, ['left', 'right'], el, horizontal)

    this.update()
  }

  setStyles(opts, props, el, value) {
    props.forEach(p => this.setStyle(opts, p, el, value))
  }

  setStyle(opts, p, el, value) {
    if (opts[p]) {
      el.style[p] = `${parseInt(opts[p], 10) + value}px`
    }
  }

  setLogoStyles() {
    // put inline styles
    this.$el.append('<style class="clappr-style"></style>')
    this.$el.find('.clappr-style').html(t(logoStyle.toString()))
  }
}
