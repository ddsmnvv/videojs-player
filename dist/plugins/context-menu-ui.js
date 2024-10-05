/*! @name videojs-contextmenu-ui @version 7.0.0 @license Apache-2.0 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('video.js')) :
  typeof define === 'function' && define.amd ? define(['video.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.videojsContextmenuUi = factory(global.videojs));
})(this, (function (videojs) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var videojs__default = /*#__PURE__*/_interopDefaultLegacy(videojs);

  const MenuItem = videojs__default["default"].getComponent('MenuItem');

  class ContextMenuItem extends MenuItem {
    handleClick(e) {
      super.handleClick();
      this.options_.listener(); // Close the containing menu after the call stack clears.

      window.setTimeout(() => {
        this.player().contextmenuUI.menu.dispose();
      }, 1);
    }

  }

  const Menu = videojs__default["default"].getComponent('Menu'); // support VJS5 & VJS6 at the same time

  const dom = videojs__default["default"].dom || videojs__default["default"];

  class ContextMenu extends Menu {
    constructor(player, options) {
      super(player, options); // Each menu component has its own `dispose` method that can be
      // safely bound and unbound to events while maintaining its context.

      this.dispose = this.dispose.bind(this);
      options.content.forEach(c => {
        let fn = function () {};

        if (typeof c.listener === 'function') {
          fn = c.listener;
        } else if (typeof c.href === 'string') {
          fn = () => window.open(c.href);
        }

        this.addItem(new ContextMenuItem(player, {
          label: c.label,
          listener: fn.bind(player)
        }));
      });
    }

    createEl() {
      const el = super.createEl();
      dom.addClass(el, 'vjs-contextmenu-ui-menu');
      el.style.left = this.options_.position.left + 'px';
      el.style.top = this.options_.position.top + 'px';
      return el;
    }

  }

  // For now, these are copy-pasted from video.js until they are exposed.

  /**
   * Offset Left
   * getBoundingClientRect technique from
   * John Resig http://ejohn.org/blog/getboundingclientrect-is-awesome/
   *
   * @function findElPosition
   * @param {Element} el Element from which to get offset
   * @return {Object}
   */
  function findElPosition(el) {
    let box;

    if (el.getBoundingClientRect && el.parentNode) {
      box = el.getBoundingClientRect();
    }

    if (!box) {
      return {
        left: 0,
        top: 0
      };
    }

    const docEl = document.documentElement;
    const body = document.body;
    const clientLeft = docEl.clientLeft || body.clientLeft || 0;
    const scrollLeft = window.pageXOffset || body.scrollLeft;
    const left = box.left + scrollLeft - clientLeft;
    const clientTop = docEl.clientTop || body.clientTop || 0;
    const scrollTop = window.pageYOffset || body.scrollTop;
    const top = box.top + scrollTop - clientTop; // Android sometimes returns slightly off decimal values, so need to round

    return {
      left: Math.round(left),
      top: Math.round(top)
    };
  }
  /**
   * Get pointer position in element
   * Returns an object with x and y coordinates.
   * The base on the coordinates are the bottom left of the element.
   *
   * @function getPointerPosition
   * @param {Element} el Element on which to get the pointer position on
   * @param {Event} event Event object
   * @return {Object}
   *         This object will have x and y coordinates corresponding to the
   *         mouse position
   */

  function getPointerPosition(el, event) {
    const position = {};
    const box = findElPosition(el);
    const boxW = el.offsetWidth;
    const boxH = el.offsetHeight;
    const boxY = box.top;
    const boxX = box.left;
    let pageY = event.pageY;
    let pageX = event.pageX;

    if (event.changedTouches) {
      pageX = event.changedTouches[0].pageX;
      pageY = event.changedTouches[0].pageY;
    }

    position.y = Math.max(0, Math.min(1, (boxY - pageY + boxH) / boxH));
    position.x = Math.max(0, Math.min(1, (pageX - boxX) / boxW));
    return position;
  }

  var version = "7.0.0";

  /**
   * Whether or not the player has an active context menu.
   *
   * @param  {Player} player
   * @return {boolean}
   */

  function hasMenu(player) {
    return player.hasOwnProperty('contextmenuUI') && player.contextmenuUI.hasOwnProperty('menu') && player.contextmenuUI.menu.el();
  }
  /**
   * Defines which elements should be excluded from displaying the context menu
   *
   * @param  {Object} targetEl The DOM element that is being targeted
   * @return {boolean} Whether or not the element should be excluded from displaying the context menu
   */


  function excludeElements(targetEl) {
    const tagName = targetEl.tagName.toLowerCase();
    return tagName === 'input' || tagName === 'textarea';
  }
  /**
   * Calculates the position of a menu based on the pointer position and player
   * size.
   *
   * @param  {Object} pointerPosition
   * @param  {Object} playerSize
   * @return {Object}
   */


  function findMenuPosition(pointerPosition, playerSize) {
    return {
      left: Math.round(playerSize.width * pointerPosition.x),
      top: Math.round(playerSize.height - playerSize.height * pointerPosition.y)
    };
  }
  /**
   * Handles contextmenu events.
   *
   * @param  {Event} e
   */


  function onContextMenu(e) {
    // If this event happens while the custom menu is open, close it and do
    // nothing else. This will cause native contextmenu events to be intercepted
    // once again; so, the next time a contextmenu event is encountered, we'll
    // open the custom menu.
    if (hasMenu(this)) {
      this.contextmenuUI.menu.dispose();
      return;
    }

    if (this.contextmenuUI.options_.excludeElements(e.target)) {
      return;
    } // Calculate the positioning of the menu based on the player size and
    // triggering event.


    const pointerPosition = getPointerPosition(this.el(), e);
    const playerSize = this.el().getBoundingClientRect();
    const menuPosition = findMenuPosition(pointerPosition, playerSize); // A workaround for Firefox issue  where "oncontextmenu" event
    // leaks "click" event to document https://bugzilla.mozilla.org/show_bug.cgi?id=990614

    const documentEl = videojs__default["default"].browser.IS_FIREFOX ? document.documentElement : document;
    e.preventDefault();
    const menu = this.contextmenuUI.menu = new ContextMenu(this, {
      content: this.contextmenuUI.content,
      position: menuPosition
    }); // This is for backward compatibility. We no longer have the `closeMenu`
    // function, but removing it would necessitate a major version bump.

    this.contextmenuUI.closeMenu = () => {
      videojs__default["default"].log.warn('player.contextmenuUI.closeMenu() is deprecated, please use player.contextmenuUI.menu.dispose() instead!');
      menu.dispose();
    };

    menu.on('dispose', () => {
      videojs__default["default"].off(documentEl, ['click', 'tap'], menu.dispose);
      this.removeChild(menu);
      delete this.contextmenuUI.menu;
    });
    this.addChild(menu);
    const menuSize = menu.el_.getBoundingClientRect();
    const bodySize = document.body.getBoundingClientRect();

    if (this.contextmenuUI.keepInside || menuSize.right > bodySize.width || menuSize.bottom > bodySize.height) {
      menu.el_.style.left = Math.floor(Math.min(menuPosition.left, this.player_.currentWidth() - menu.currentWidth())) + 'px';
      menu.el_.style.top = Math.floor(Math.min(menuPosition.top, this.player_.currentHeight() - menu.currentHeight())) + 'px';
    }

    videojs__default["default"].on(documentEl, ['click', 'tap'], menu.dispose);
  }
  /**
   * Creates a menu for contextmenu events.
   *
   * @function contextmenuUI
   * @param    {Object} options
   * @param    {Array}  options.content
   *           An array of objects which populate a content list within the menu.
   * @param    {boolean}  options.keepInside
   *           Whether to always keep the menu inside the player
   * @param    {function}  options.excludeElements
   *           Defines which elements should be excluded from displaying the context menu
   */


  function contextmenuUI(options) {
    const defaults = {
      keepInside: true,
      excludeElements
    };
    options = videojs__default["default"].obj.merge(defaults, options);

    if (!Array.isArray(options.content)) {
      throw new Error('"content" required');
    } // If we have already invoked the plugin, teardown before setting up again.


    if (hasMenu(this)) {
      this.contextmenuUI.menu.dispose();
      this.off('contextmenu', this.contextmenuUI.onContextMenu); // Deleting the player-specific contextmenuUI plugin function/namespace will
      // restore the original plugin function, so it can be called again.

      delete this.contextmenuUI;
    } // Wrap the plugin function with an player instance-specific function. This
    // allows us to attach the menu to it without affecting other players on
    // the page.


    const cmui = this.contextmenuUI = function () {
      contextmenuUI.apply(this, arguments);
    };

    cmui.onContextMenu = onContextMenu.bind(this);
    cmui.content = options.content;
    cmui.keepInside = options.keepInside;
    cmui.options_ = options;
    cmui.VERSION = version;
    this.on('contextmenu', cmui.onContextMenu);
    this.ready(() => this.addClass('vjs-contextmenu-ui'));
  }

  videojs__default["default"].registerPlugin('contextmenuUI', contextmenuUI);
  contextmenuUI.VERSION = version;

  return contextmenuUI;

}));
