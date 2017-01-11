


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
	var loadingViews = {};
	if(!window.Mustache){
		throw new Error('Mustache must be required for ff.view !');
	}
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

			function loadTemplate(name){
				var dfd = $.Deferred();
				var config = window.ff.view.config;

				if(!!loadingViews[name]){
					dfd = loadingViews[name];
				} else if(!views[name]){
					loadingViews[name] = dfd;
					$.get(config.root + name + config.ext)
						.then(function(template){
							views[name] = template;
							resolveDfd(dfd, null, template);
							loadingViews[name] = null;
							delete loadingViews[name];
						}, function(err){
							console.error(`Can't get view "${name}"`);
							console.error(err);
						});
				} else {
					resolveDfd(dfd, null, views[name]);
				}

				return dfd.promise();
			}

			return function renderView(name, data, cb){
				var dfd = $.Deferred();
				var result;

				loadTemplate(name)
					.then(function(template){
						if(data && typeof data === 'object'){
							result = Mustache.render(template, data);

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
							result = template;
							resolveDfd(dfd, cb, result);
						}
					});

				return dfd.promise();
			};

		})();
		window.ff.view.config = {
			root: '/views/',
			ext: '.mst'
		}
	}
})(jQuery);
