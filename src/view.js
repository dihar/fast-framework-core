


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
