import {UIContainerPlugin, Events} from 'clappr'
import templater from 'clappr/src/base/template'

import {calculateSize} from './utils'
import logoHTML from './templates/logo.html'
import logoStyle from './styles/logo.scss'


export default class LogoPlugin extends UIContainerPlugin {
  get name() { return 'logo' }
  get template() {return templater(logoHTML)}

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
    this.listenTo(this.container, Events.CONTAINER_READY, this.render)
    this.listenTo(this.container, Events.CONTAINER_LOADEDMETADATA, this.setPosition)
  }

  render() {
    if (!this.shouldRender) {return}
    this.$el.html(this.template())
    this.setLogoStyles()
    this.setLogoImgAttrs()
    this.$el.hide()
    this.container.$el.append(this.$el.get(0))
    return this
  }

  setLogoImgAttrs() {
    const {logo, logo: {path: imgUrl, width = 60, height = 60}} = this.options
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

    this.$el.show()
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
    this.$el.find('.clappr-style').html(templater(logoStyle.toString()))
  }
}
