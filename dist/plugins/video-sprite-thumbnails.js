/*! @name videojs-sprite-thumbnails @version 2.2.2 @license MIT */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("video.js")):"function"==typeof define&&define.amd?define(["video.js"],t):(e="undefined"!=typeof globalThis?globalThis:e||self).videojsSpriteThumbnails=t(e.videojs)}(this,(function(e){"use strict";function t(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var o=t(e);const n=o.default.getPlugin("plugin"),r={url:"",idxTag:e=>e,urlArray:[],width:0,height:0,columns:0,rows:0,interval:1,responsive:600,downlink:1.5};class s extends n{constructor(e,t){super(e,t),this.options=o.default.obj.merge(r,t),this.player.ready((()=>{((e,t,n)=>{const r=window.navigator,s=o.default.dom,i=o.default.obj,a=t.log,l=a.debug,u={...t.state},d=()=>{t.setState(u)},c=["ControlBar","ProgressControl","SeekBar","MouseTimeDisplay","TimeTooltip"],[h,p,f,g]=c.toSpliced(3,1),y=t=>{const o=c.indexOf(t),n=e.getDescendant(c.slice(0,o+1));return n||(d(),l(`component tree ${c.join(" > ")} required`)),n};let m,b;const x=e=>{const t=n.urlArray;return t.length?t[e]:n.url.replace("{index}",n.idxTag(e))},w=t=>{if(!y(g))return;const o=y(f).el(),r=s.findPosition(y(h).el()).top,a=e.currentWidth(),l=e.duration(),u=n.interval,d=n.columns,c=n.responsive,p=u*d,b=p*(n.rows||Math.ceil(l/p));let w=s.getPointerPosition(o,t).x*l;const v=Math.floor(w/b);w=(w-b*v)/u;const j=c&&a<c?a/c:1,$=n.width*j,S=n.height*j,k=Math.floor(w%d)*-$,P=Math.floor(w/d)*-S,T=s.findPosition(o).top,A=-S-Math.max(0,T-r),C={backgroundImage:`url("${x(v)}")`,backgroundRepeat:"no-repeat",backgroundPosition:`${k}px ${P}px`,backgroundSize:$*d+"px auto",top:`${A}px`,color:"#fff",textShadow:"1px 1px #000",border:"1px solid #000",width:`${$+2}px`,height:`${S+2}px`};i.each(C,((e,t)=>{m.style[t]=e}))},v=e=>{const t=n[e],o="rows"!==e?1:0,r=parseInt(t,10)===t&&t>=o;return r||a.warn(`${e} must be an integer greater than ${o-1}`),r},j=()=>{const e=r.connection||r.mozConnection||r.webkitConnection,t="downlink",o=!e||e[t]>=n[t];return o||a(`connection.${t} < ${n[t]}`),o},$=o=>{e.off("loadstart",$),d();const r=t.name,s=e.currentSources().find((e=>e.hasOwnProperty(r)));let a=s&&s[r];if(a){const e=a.urlArray;Object.keys(a).length?e&&e.length?a.url="":a.url&&(a.urlArray=[]):a={url:"",urlArray:[]},t.options=n=i.merge(n,a)}const l=y(g);l&&"loadstart"!==o.type&&(m=l.el(),b=m.style,t.setState({ready:!!((n.urlArray.length||n.url)&&v("width")&&v("height")&&v("columns")&&v("rows")&&j())}))};t.on("statechanged",(o=>{const r=t.state,s=["mousemove","touchmove"],i=y(p);r.ready?(l("ready to show thumbnails"),i.on(s,w)):(n.url||n.urlArray.length||l("no urls given, resetting"),i&&(i.off(s,w),m.style=b)),e.toggleClass("vjs-thumbnails-ready",r.ready)})),e.on(["loadstart","loadedmetadata"],$),e.addClass("vjs-sprite-thumbnails")})(this.player,this,this.options)}))}}return s.defaultState={ready:!1},s.VERSION="2.2.2",o.default.registerPlugin("spriteThumbnails",s),s}));