/**
 * @EmilioSG11/videojs-logo-control-bar
 * @version 1.0.0
 * @copyright 2024 Emilio Salas (emiliosalasgzz@gmail.com) 
 * @license MIT
 */
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('video.js')) :
    typeof define === 'function' && define.amd ? define(['video.js'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.videojsLogoControlBar = factory(global.videojs));
}(this, (function(videojs) {
  'use strict';

  function _interopDefaultLegacy(e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var videojs__default = /*#__PURE__*/ _interopDefaultLegacy(videojs);

  var version = "1.0.0";

  const Plugin = videojs__default['default'].getPlugin('plugin'); // Default options for the plugin.

  const defaults = {
    image: undefined,
    width: undefined,
    height: undefined,
    opacity: 1
  };

  /**
   * A videojs plugin to add logo image in Control Bar.
   */

  class LogoControlBar extends Plugin {
    /**
     * Create a Logo Control Bar instance.
     *
     * @param {Player} player A Video.js Player instance.
     * @param {Object} options An optional options object.
     * @param {string} options.image The URL to the logo controlbar image.
     * @param {number} [options.width] The width of the logo controlbar image (px). If not specified, it will be the width of the original image.
     * @param {number} [options.height] The height of the logo controlbar image (px). If not specified, it will be the height of the original image.
     * @param {number} [options.opacity=1] The opacity of the image. If not specified it will default to 1.
     */

    constructor(player, options) {
      super(player);
      this.tid = null;
      this.div = null;
      this.options = videojs__default['default'].obj.merge(defaults, options);
      this.player.ready(() => this._onPlayerReady());
    }
    /**
     * Start the plugin after the player is ready.
     *
     * @private
     */
    _onPlayerReady() {
      if (!this.options.image)
        return
      this._setup();
    }


    /**
     * Setup the plugin.
     */
    _setup() {
      const video = this.player.el();
      const div = videojs.dom.createEl(
        'div',
        {
          className: 'vjs-logo-control-bar',
        }, {},
      );

      const img = document.createElement('img');

      img.src = this.options.image;
      const {
        width,
        height,
        opacity
      } = this.options;

      if (width) {
        img.width = width;
      }

      if (height) {
        img.height = height;
      }

      if (opacity) {
        img.style.opacity = opacity;
      }

      if (this.options.url) {
        // Create a element for the image link
        const a = document.createElement('a'); // eslint-disable-line no-undef

        a.href = this.options.url;

        a.onclick = e => {
          e.preventDefault();
          window.open(this.options.url); // eslint-disable-line no-undef
        };

        a.appendChild(img);
        div.appendChild(a);
      } else {
        div.appendChild(img);
      }

      video.appendChild(div);

      player.controlBar.el().insertBefore(div, player.controlBar.playbackRateMenuButton.el());
    }
  }
  // Define default values for the plugin's `state` object here.
  LogoControlBar.defaultState = {}; // Include the version number.

  LogoControlBar.VERSION = version; // Register the plugin with video.js.

  videojs__default['default'].registerPlugin('logocontrolbar', LogoControlBar);

  return LogoControlBar;

})));