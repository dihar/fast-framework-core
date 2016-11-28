
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