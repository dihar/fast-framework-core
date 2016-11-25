
/*
	CONTROLLER.js
	
	namespace: window.ff.controller
	
	Methods:

	get

	@params: name – name of controller
	@return: Object {value, clearFunction}; 
		value – function, which called when controller activated, 
		clearFunction – when controller deactivated

	set

	@params: name – name of controller,
		value – function, which called when controller activated,
		clearFunction – function, which called when controller deactivated

	@return: undefined
*/
;(function ($){
	var controllers = {};
	if(window.ff === undefined){
		window.ff = {};
	}
	if(window.ff.controller === undefined){
		window.ff.controller = (function initController(){
			var get = function(name){
				if(controllers[name]){
					return { 
						value: controllers[name].value, 
						clearFunction: controllers[name].clearFunction || function(){}
					};
				}
				console.error('Undefined controller ' + name);
			};
			var set = function(name, value, clearFunction){
				if( typeof name !== 'string' ){
					throw new Error('Key of controller must be String!');
				}
				controllers[name] = { value: value, clearFunction: clearFunction };
			};
			return {
				get: get,
				set: set
			};
		})();
	}
})(jQuery);


/*
	Router.js
 */

;(function($){
	var activeRoute;
	if(!ff.router){

		ff.router = (function(){
			var routes = [];

			function findRoute(route){
				if(route === '/'){
					return routes.filter(function(el){
						return el.name === '/' && !el.hashParams;
					})[0] || null;
				}
				var paramRoute = $.router.getParameters(route || '');
				if(!paramRoute.length){
					return null;
				}

				var paramName = paramRoute[0].route.route;

				return routes.filter(function(el){
					var creatingRegExp;
					var check1 = paramName === el.name;
					var check2 = false;
					var check3 = false;

					if(typeof paramName === 'object' && el.name === 'object' && !el.hashParams){
						check2 = paramName.source === el.name.source;
					}

					if(!!el.hashParams && typeof paramName === 'object'){
						creatingRegExp = createRegexpByHash(el.name, el.hashParams);
						if(!el.param){
							check3 = creatingRegExp.source === paramName.source;
						} else {
							creatingRegExp = new RegExp(creatingRegExp.source.replace(':'+el.param, '.+'));
							check3 = creatingRegExp.source === paramName.source;
						}
					}

					return check1 || check2 || check3;
				})[0] || null;
			}

			function getRoute(route, hash){
				var typeOfRoute = typeof route === 'object' || !!hash ? 'regexp' : 'string';
				var routeName = route;

				if(!!hash){
					var routeName = createRegexpByHash(route, hash);
				}

				var equalRoute = routes.filter(function(el){
					return el.type === typeOfRoute && 
						typeOfRoute === 'regexp' ? 
						el.name.source === routeName.source : el.name === routeName;
				});

				return equalRoute[0] || null;
			}

			function createRegexpByHash(base, params){
				if(typeof params === 'string'){
					params = [params];
				}

				var regexpString = base === 'object' ? base.source : base;
				if(regexpString.indexOf('^') === -1){
					regexpString = '^' + regexpString;
				}
				regexpString += '/?#';

				params.forEach(function(param, i, arr){
					if(!!i){
						regexpString += '(?:&';
					}
					regexpString += (!i ? '(?:' : '') + param + '=([^&]+))?';
					if(i === arr.length - 1){
						regexpString += '$';
					}
				});
				return new RegExp(regexpString);
			}

			return {
				add: function(name, controller, params){
					var newName = name;
					var paramStart = 0;

					if(!params){
						params = {};
					}
					var route = getRoute(newName, params.hashParams);
					if(!route){
						routes.push({
							name: newName,
							controller: controller,
							title: params.title,
							hashParams: params.hashParams,
							param: params.param,
							type: typeof newName === 'object' ? 'regexp' : 'string'
						});
					} else {
						route.name = newName;
						route.controller = controller;
						route.title = params.title;
						route.hashParams = params.hashParams;
						route.param = params.param;
						route.type = typeof newName === 'object' ? 'regexp' : 'string';
					}
					if(!!params.hashParams){
						newName = createRegexpByHash(newName, params.hashParams);
						if(!!params.param && typeof name === 'string'){
							paramStart = name.indexOf(':');
							newName = new RegExp(newName.source.replace(':'+params.param, '.+'));
						}
					}
					$.router.add(newName, params.param, function(data){
						data.hash = {};
						var parameters = params.hashParams;
						if(!!parameters){
							if(typeof parameters === 'string'){
								parameters = [parameters];
							}
							parameters.forEach(function(el, i){
								data.hash[el] = data.matches[i + 1];
							});
							delete data.matches;
						}
						var path = window.location.pathname + window.location.hash;
						var regExpSearchingParam;
						var param = {};
						if(paramStart > 0){
							regExpSearchingParam = new RegExp('^.{'+ paramStart +'}([^/#]+)');
							param = path.match(regExpSearchingParam);
							if(!!param[1]){
								data[params.param] = param[1];
							}
						}

						controller.value(data);
					});
				},
				
				go: function(name, title, isPushState){
					var router = findRoute(name);

					if(router){
						if(!title){
							title = router.title;
						}
						if(!!activeRoute){
							activeRoute.controller.clearFunction(name);
						}
						activeRoute = router;

						$.router.go(name, title, !isPushState);
					} else {
						console.error('Undefined route ' + name);
					}
					
				},
				
				updateLinks: function(container){
					
					var go = this.go;
					var $cont = $(container);
					$cont.find('a').filter(function(i, el){
						return !!findRoute($(el).attr('href')) && $(el).attr('target') !== '_blank';
					}).click(function(e){
						e.preventDefault();
						go($(this).attr('href'), findRoute($(this).attr('href')).title, true);
					});
					
					return $cont;
					
			}
				
			}
		})();
	}


	(function(){
		var pathnameNow = window.location.pathname;
		var originHandler;

		// reinit jquery-router-plugin event for using stopPropagation
		if(!!$._data(window, 'events')['popstate'] && !!$._data(window, 'events')['popstate'][0]){
			originHandler = $._data(window, 'events')['popstate'][0].handler;
			$._data(window, 'events')['popstate'][0].handler = function(e){
				if(pathnameNow === window.location.pathname){
					e.preventDefault();
					e.stopPropagation();
					return false;
				}
				originHandler.apply(this, arguments);

				var path = window.location.pathname + window.location.hash;
				if(!!activeRoute){
					activeRoute.controller.clearFunction(path);
				}
				ff.router.go(path);
			}
		}
	})();

})(jQuery);

$(function(){

	var path = window.location.pathname + window.location.hash;
	if(path.length > 1 && /(.+)\/$/.test(path)){
		path = path.slice(0, path.length - 1);
	}
	ff.router.go(path);

	ff.router.updateLinks($('body'));

});


/** view.js expand ff namespace, simple get views with Mustache
	* @function ff.view(name, data, callback)
	* @param name
		name of view (must equal file name in views folder withot extention)
	* @param data
		if you want mustache rendered template, set obj, without it, result will be template as it is on server;
		specific options: layout – layout name (from view/layouts), dataLayout: data for layout
	* @param callback
		callback succsess function with one parameter: template (template or mustache rendering)
	* @return jQuery Deferrer
*/
;(function ($){
	var views = {};
	if(window.ff === undefined){
		window.ff = {};
	}
	if(window.ff.view === undefined){
		window.ff.view = (function initView(){

			function resolveDfd(dfd, cb, result){
				if(typeof cb === 'function'){
					cb(result);
				}
				dfd.resolve(result);
			}

			return function renderView(name, data, cb){
				var config = window.ff.view.config;
				var dfd = $.Deferred();
				var result;
				if(!views[name]){
					$.get(config.root + name + config.ext)
						.done(function(template){
							views[name] = template;
							if(data && typeof data === 'object'){
								result = Mustache.render(template, data);

								if(typeof data.layout === 'string'){
									renderView('layouts/' + data.layout)
										.then(function(layout){
											result = Mustache.render(layout, data.dataLayout, {partialView: result});
											resolveDfd(dfd, cb, result);
										}, function(err){
											dfd.reject('Can not get layout ' + data.layout);
										});
								} else {
									resolveDfd(dfd, cb, result);
								}

							} else {
								result = template;
								resolveDfd(dfd, cb, result);
							}
						})
						.fail(function(){
							dfd.reject('Can not get view ' + name);
						});
				} else {
					if(data){
						result = Mustache.render(views[name], data);

						if(typeof data.layout === 'string'){
							renderView('layouts/' + data.layout)
								.then(function(layout){
									result = Mustache.render(layout, data.dataLayout, {partialView: result});
									resolveDfd(dfd, cb, result);
								});
						} else {
							resolveDfd(dfd, cb, result);
						}

					} else {
						result = views[name];
						resolveDfd(dfd, cb, result);
					}
				}

				return dfd.promise();
			};

		})();
		window.ff.view.config = {
			root: '/views/',
			ext: '.mst'
		}
	}
})(jQuery);
