


/*
	Router.js

	ff.router.add(name, controller, {title, param, hashParams})
		name {String or RegExp} Path to route.
		controller {Object of controller} Controller, which bound to route
		title {String} Title of page
		param {String} name of dynamic param (see doc of jquery-router-plugin)
		hashParams {String or Array of String} Names of parameters in hash, the order is very important

	ff.router.go(path {String}, title {String}, addToHistory {Boolean});
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
					var mainController = controller;
					if(Array.isArray(controller)){
						mainController = controller[controller.length - 1];
					}
					if(!route){
						routes.push({
							name: newName,
							controller: mainController,
							title: params.title,
							hashParams: params.hashParams,
							param: params.param,
							guardError: params.guardError,
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
						if(Array.isArray(controller) && controller.length > 1){
							var controllers = controller;
							var lastControler = controllers.slice(-1)[0];
							var guards = controllers.slice(0, -1).map(function(guard){
								return guard.value(data);
							});
							$.when.apply(null, guards).then(function(){
								lastControler.value(data);
							}, function(error){
								if (!!params.guardError){
									if(typeof params.guardError !== 'function'){
										throw new Error('"guardError" in options of route must be a function');
										return false;
									}
									params.guardError(error);
								}
							});
						} else if(Array.isArray(controller) && controller.length === 1){
							controller[0].value(data);
						} else if(!Array.isArray(controller)){
							controller.value(data);
						}
					});
				},
				
				go: function(name, title, isPushState){

					var router = findRoute(name);

					if(router){
						if(!title){
							title = router.title;
						}
						if(!!activeRoute && activeRoute.controller && typeof activeRoute.controller.clearFunction === 'function'){
							activeRoute.controller.clearFunction(name);
						}
						activeRoute = router;

						if(!!title){
							document.title = title;
						}

						$.router.go(name, title, !isPushState);
					} else {
						console.error('Undefined route ' + name);
					}
					
				},
				
				updateLinks: function(container){
					
					var go = this.go;
					var $cont = $(container);
					$cont.find('a').filter(function(i, el){
						return !!findRoute($(el).attr('href')) && $(el).attr('target') !== '_blank' && $(el).attr('data-ff-route') !== 'bind';
					}).attr('data-ff-route', 'bind').click(function(e){
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
				if(!!activeRoute && activeRoute.controller && typeof activeRoute.controller.clearFunction === 'function'){
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