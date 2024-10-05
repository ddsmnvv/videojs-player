/*! @name @misterben/videojs-poster-time @version 1.0.0 @license MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('video.js')) :
  typeof define === 'function' && define.amd ? define(['video.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.videojsPosterTime = factory(global.videojs));
}(this, (function (videojs) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var videojs__default = /*#__PURE__*/_interopDefaultLegacy(videojs);

  var version = "1.0.0";

  var defaults = {};
  /**
   * Function to invoke when the player is ready.
   *
   * This is a great place for your plugin to initialize itself. When this
   * function is called, the player will have its DOM and child components
   * in place.
   *
   * @function onPlayerReady
   * @param    {Player} player
   *           A Video.js player object.
   *
   * @param    {Object} [options={}]
   *           A plain object containing options for the plugin.
   * @param    {number} [options.duration]
   *           A duration in seconds to use if video el is not returning a duration.
   */

  var onPlayerReady = function onPlayerReady(player, options) {
    player.addClass('vjs-poster-time');
    var durDisplay = player.durDisplay = player.getChild('PosterImage').addChild('Component');
    durDisplay.addClass('vjs-poster-duration');

    var update = function update() {
      var duration;

      if (!isNaN(player.duration()) && player.duration() > 0) {
        duration = player.duration();
      } else if (player.mediainfo && player.mediainfo.duration) {
        duration = player.mediainfo.duration;
      } else if (options.duration) {
        duration = options.duration;
      } else if (player.options()['data-duration']) {
        duration = player.options()['data-duration'];
      } else {
        durDisplay.hide();
        return;
      }

      if (isFinite(duration) && duration > 0) {
        durDisplay.el_.textContent = videojs__default['default'].formatTime(duration, 1000);
      } else {
        durDisplay.el_.textContent = player.localize('LIVE');
      }

      durDisplay.show();
    };

    player.on(['loadstart', 'loadedmetadata', 'durationchange'], update);
    update();
  };
  /**
   * A video.js plugin to add the video duration to the poster.
   *
   * @function posterTime
   * @param    {Object} [options={}]
   *           An object of options left to the plugin author to define.
   */


  var posterTime = function posterTime(options) {
    var _this = this;

    this.ready(function () {
      onPlayerReady(_this, videojs__default['default'].mergeOptions(defaults, options));
    });
  }; // Register the plugin with video.js.


  videojs__default['default'].registerPlugin('posterTime', posterTime); // Include the version number.

  posterTime.VERSION = version;

  return posterTime;

})));
