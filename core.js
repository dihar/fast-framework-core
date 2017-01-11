"use strict";function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}();!function(){void 0===window.ff&&(window.ff={}),window.ff.config||(window.ff.config={root:"/views/",ext:".mst"}),window.ff.state||!function(){window.ff.state={loaderIsActive:"true",loaderInError:"false"};var e=window.ff.state;e.showLoader=function(){e.loaderIsActive=!0,$(".ff-loader").addClass("ff-loader_show")},e.hideLoader=function(){e.loaderIsActive=!1,$(".ff-loader").removeClass("ff-loader_show")},e.errorLoader=function(t){e.loaderIsActive=!0,e.loaderInError=!1,$(".ff-loader").addClass("ff-loader_show").addClass("ff-loader_error").attr("data-error",t),setTimeout(function(){e.hideLoader(),e.loaderInError=!1,$(".ff-loader").removeClass("ff-loader_error").attr("data-error","")},1e4)}}(),ff.fastResolve=function(e){return $.Deferred().resolve(e).promise()},ff.fastReject=function(e){return $.Deferred().reject(e).promise()},ff.async=function(e,t,r){var n=$.Deferred();return setTimeout(function(){!!t&&t(r),n.resolve(r)},e),n.promise()};var e=[];ff.event={on:function(t,r){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=n.context,a=void 0===o?{}:o,i=n.order,f=void 0===i?1:i,u=n.bubble,l=void 0===u||u,s=n.label,c=n.once,d=void 0!==c&&c;if("string"!=typeof t)throw new Error("Event name must be string!");if("function"!=typeof r)throw new Error("Event callback must be function!");t in e||(e[t]=[]),e[t].push({callback:r,context:a,order:f,bubble:l,label:s,once:d})},off:function(t,r){if("string"!=typeof t)throw new Error("Event name must be string!");var n=e[t];return!(!n||!n.length)&&("string"==typeof r?(e[t]=n.filter(function(e){return e.label!==r}),!1):"function"!=typeof r?(delete e[t],!1):void(e[t]=n.filter(function(e){return e.callback!==r})))},trigger:function(t,r){if("string"!=typeof t)throw new Error("Event name must be string!");return t in e&&(e[t].sort(function(e,t){var r=e.order,n=t.order;return n-r}).some(function(e){return e.callback.call(e.context,r),e.once&&(e.toDelete=!0),!e.bubble}),void e[t].filter(function(e){return!e.toDelete}))}},ff.HashOfTree=function(){function e(t){_classCallCheck(this,e),this.name=t,this.length=0,this.hash=_defineProperty({},this.name+"_-1",{meta:this.name+"_-1",childrenArr:[],level:0})}return _createClass(e,[{key:"push",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,r=this.name+"_"+this.length++;return this.hash[r]=Object.assign(e,{parentMeta:t,meta:r,childrenArr:e.el.has_child?[]:null,level:t?this.hash[t].level+1:1}),t?this.hash[t].childrenArr.push(r):this.hash[this.name+"_-1"].childrenArr.push(r),r}},{key:"getRegistry",value:function(e){return this.hash[e]}},{key:"getParentRegistry",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=this.getRegistry(e);t<0&&(t=r.level+t);for(var n=1;n<=t&&r.level>1;n++)r=this.getRegistry(r.parentMeta);return r}},{key:"showRegistries",value:function(){console.log(this.hash)}},{key:"getNodeByMeta",value:function(e){var t=this.getRegistry(e);if(!t._node){var r=$("#mustache-target").find('[data-ff="'+e+'"]');t._node=r}return t._node}},{key:"setNodeByMeta",value:function(e,t){var r=this.getRegistry(e);r._node=t}},{key:"getFirstLevelMeta",value:function(){return this.hash[this.name+"_-1"].childrenArr}}]),e}()}(),function(e){var t={};void 0===window.ff&&(window.ff={}),void 0===window.ff.controller&&(window.ff.controller=function(){var e=function(e){return t[e]?{value:t[e].value,clearFunction:t[e].clearFunction||function(){}}:void console.error("Undefined controller "+e)},r=function(e,r,n){if("string"!=typeof e)throw new Error("Key of controller must be String!");t[e]={value:r,clearFunction:n}};return{get:e,set:r}}())}(jQuery);var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(e){var t;ff.router||(ff.router=function(){function r(t){if("/"===t)return a.filter(function(e){return"/"===e.name&&!e.hashParams})[0]||null;var r=e.router.getParameters(t||"");if(!r.length)return null;var n=r[0].route.route;return a.filter(function(e){var t,r=n===e.name,a=!1,i=!1;return"object"!==("undefined"==typeof n?"undefined":_typeof(n))||"object"!==e.name||e.hashParams||(a=n.source===e.name.source),e.hashParams&&"object"===("undefined"==typeof n?"undefined":_typeof(n))&&(t=o(e.name,e.hashParams),e.param?(t=new RegExp(t.source.replace(":"+e.param,".+")),i=t.source===n.source):i=t.source===n.source),r||a||i})[0]||null}function n(e,t){var r="object"===("undefined"==typeof e?"undefined":_typeof(e))||t?"regexp":"string",n=e;if(t)var n=o(e,t);var i=a.filter(function(e){return e.type===r&&"regexp"===r?e.name.source===n.source:e.name===n});return i[0]||null}function o(e,t){"string"==typeof t&&(t=[t]);var r="object"===e?e.source:e;return r.indexOf("^")===-1&&(r="^"+r),r+="/?#",t.forEach(function(e,t,n){t&&(r+="(?:&"),r+=(t?"":"(?:")+e+"=([^&]+))?",t===n.length-1&&(r+="$")}),new RegExp(r)}var a=[];return{add:function(t,r,i){var f=t,u=0;i||(i={});var l=n(f,i.hashParams);l?(l.name=f,l.controller=r,l.title=i.title,l.hashParams=i.hashParams,l.param=i.param,l.type="object"===("undefined"==typeof f?"undefined":_typeof(f))?"regexp":"string"):a.push({name:f,controller:r,title:i.title,hashParams:i.hashParams,param:i.param,type:"object"===("undefined"==typeof f?"undefined":_typeof(f))?"regexp":"string"}),i.hashParams&&(f=o(f,i.hashParams),i.param&&"string"==typeof t&&(u=t.indexOf(":"),f=new RegExp(f.source.replace(":"+i.param,".+")))),e.router.add(f,i.param,function(e){e.hash={};var t=i.hashParams;t&&("string"==typeof t&&(t=[t]),t.forEach(function(t,r){e.hash[t]=e.matches[r+1]}),delete e.matches);var n,o=window.location.pathname+window.location.hash,a={};u>0&&(n=new RegExp("^.{"+u+"}([^/#]+)"),a=o.match(n),a[1]&&(e[i.param]=a[1])),r.value(e)})},go:function(n,o,a){var i=r(n);i?(o||(o=i.title),t&&t.controller.clearFunction(n),t=i,e.router.go(n,o,!a)):console.error("Undefined route "+n)},updateLinks:function(t){var n=this.go,o=e(t);return o.find("a").filter(function(t,n){return!!r(e(n).attr("href"))&&"_blank"!==e(n).attr("target")}).click(function(t){t.preventDefault(),n(e(this).attr("href"),r(e(this).attr("href")).title,!0)}),o}}}()),function(){var r,n=window.location.pathname;e._data(window,"events").popstate&&e._data(window,"events").popstate[0]&&(r=e._data(window,"events").popstate[0].handler,e._data(window,"events").popstate[0].handler=function(e){if(n===window.location.pathname)return e.preventDefault(),e.stopPropagation(),!1;r.apply(this,arguments);var o=window.location.pathname+window.location.hash;t&&t.controller.clearFunction(o),ff.router.go(o)})}()}(jQuery),$(function(){var e=window.location.pathname+window.location.hash;e.length>1&&/(.+)\/$/.test(e)&&(e=e.slice(0,e.length-1)),ff.router.go(e),ff.router.updateLinks($("body"))});var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(e){var t={},r={};if(!window.Mustache)throw new Error("Mustache must be required for ff.view !");void 0===window.ff&&(window.ff={}),void 0===window.ff.view&&(window.ff.view=function(){function n(e,t,r){"function"==typeof t&&t(r),e.resolve(r)}function o(o){var a=e.Deferred(),i=window.ff.view.config;return r[o]?a=r[o]:t[o]?n(a,null,t[o]):(r[o]=a,e.get(i.root+o+i.ext).then(function(e){t[o]=e,n(a,null,e),r[o]=null,delete r[o]},function(e){console.error("Can't get view \""+o+'"'),console.error(e)})),a.promise()}return function t(r,a,i){var f,u=e.Deferred();return o(r).then(function(e){a&&"object"===("undefined"==typeof a?"undefined":_typeof(a))?(f=Mustache.render(e,a),"string"==typeof a.layout?t("layouts/"+a.layout).then(function(e){f=Mustache.render(e,a.dataLayout,{partialView:f}),n(u,i,f)}):n(u,i,f)):(f=e,n(u,i,f))}),u.promise()}}(),window.ff.view.config={root:"/views/",ext:".mst"})}(jQuery);
//# sourceMappingURL=core.js.map
