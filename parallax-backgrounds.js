/*
* parallaxBackgrounds plugin
* Copyright (c) 2017 Adam Lafene
*
* Licensed under the terms of the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*/

(function (window) {

    'use strict';
    //
    // Variables
    //

    var supports = !!document.querySelector; // Feature test
    var $ = window.jQuery;

    //////////////////////////////////////
    // HELPER FUNCTIONS
    //////////////////////////////////////
    

    /**
     * A simple forEach() implementation for Arrays, Objects and NodeLists
     * @private
     * @param {Array|Object|NodeList} collection Collection of items to iterate
     * @param {Function} callback Callback function for each iteration
     * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
     */
    var forEach = function (collection, callback, scope) {
        if (Object.prototype.toString.call(collection) === '[object Object]') {
            for (var prop in collection) {
                if (Object.prototype.hasOwnProperty.call(collection, prop)) {
                    callback.call(scope, collection[prop], prop, collection);
                }
            }
        } else {
            for (var i = 0, len = collection.length; i < len; i++) {
                callback.call(scope, collection[i], i, collection);
            }
        }
    };

    /**
     * To set multiple style properties on either a single DOM object or multiple DOM objects:
     * (pass properties in as an object of property/value pairs)
     */
    var setProperties = function(objArray, properties) {

        var setProp = function(obj, prop, val) {
            obj.style[prop] = val;
        }

        if(objArray.length) {
            forEach(objArray, function (obj) {
                for (var property in properties)
                    setProp(obj, property, properties[property]);
            });
        }
        else {
            for (var property in properties)
                setProp(objArray, property, properties[property]);
        }
        return objArray;
    };

    /**
     * To get offset values for a DOM object:
     */
    var getOffsets = function (obj) {
        var rect = obj.getBoundingClientRect();
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

		return {
		  top : parseInt(rect.top) + scrollTop,
		  left : parseInt(rect.left) + scrollLeft
		}
    };

	/**
     * Document ready function
     */
    var documentReady = function(fn) {
	  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
	    fn();
	  } else {
	    document.addEventListener('DOMContentLoaded', fn);
	  }
	}

	/**
	* Throttle function
	* Nicked from _underscore JS library: https://github.com/jashkenas/underscore
	*/
	// Returns a function, that, when invoked, will only be triggered at most once
	// during a given window of time. Normally, the throttled function will run
	// as much as it can, without ever going more than once per `wait` duration;
	// but if you'd like to disable the execution on the leading edge, pass
	// `{leading: false}`. To disable execution on the trailing edge, ditto.
	var throttle = function(func, wait, options) {
		var context, args, result;
		var timeout = null;
		var previous = 0;

		if (!options) 
			options = {};

		var later = function() {
			previous = options.leading === false ? 0 : (Date.now || function(){ return new Date().getTime(); } )();
			timeout = null;
			result = func.apply(context, args);
			if (!timeout) 
				context = args = null;
		};
		return function() {
			var now = (Date.now || function(){ return new Date().getTime(); } )();
			if (!previous && options.leading === false) 
				previous = now;
			var remaining = wait - (now - previous);
			context = this;
			args = arguments;

			if (remaining <= 0 || remaining > wait) {
			  if (timeout) {
			    clearTimeout(timeout);
			    timeout = null;
			  }
			  previous = now;
			  result = func.apply(context, args);

			  if (!timeout) 
			  	context = args = null;

			} else if (!timeout && options.trailing !== false) {
				timeout = setTimeout(later, remaining);
			}
			return result;
		};
	};


    //////////////////////////////////////
    // prototype
    //////////////////////////////////////
    
    /**
     * For non-jQuery implementation use 'PBg' namespace
     */
    if (!$) {
        var PBg = function(selector) {
            
            if (!(this instanceof PBg))
                return new PBg(selector);

            this.domObj = document.querySelectorAll(selector);
        };

        PBg.fn = PBg.prototype = {};
    
        window.PBg = PBg;

        $ = window.PBg;
    }


    /**
     * cssAnimate public method
     */

    $.fn.parallaxBackgrounds = function(fixedHeader) {

        var domObj = this.domObj || this;

        if (domObj.length < 1 || !supports)
            return false;

        var header = fixedHeader || '';
        var objectMetrics = [];


        var headerHeight, windowHeight;

        var getObjectMetrics = function () {
                headerHeight = (header.length > 0) ? parseInt(window.getComputedStyle(header).getPropertyValue('height')) : 0;
                windowHeight = window.innerHeight - headerHeight;

                forEach(domObj, function(obj, i) {		
	                // for iterating through jQuery objects
		            if (obj.nodeType !== 1)
		                return;		
		                	
                	objectMetrics[i] = {
                        height: parseInt(window.getComputedStyle(obj).getPropertyValue('height')),
                        top: getOffsets(obj).top
                    };
                });
            };

        var setScrollPosition = function () {
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                forEach(domObj, function(obj, i) {
	                // for iterating through jQuery objects
		            if (obj.nodeType !== 1)
		                return;	

                    if (!objectMetrics[i])
                        return;
	                    var objHeight = objectMetrics[i].height;
	                    var objTop = objectMetrics[i].top;
	                    var scrollArea = (objTop - headerHeight > windowHeight) ? windowHeight + objHeight : (objTop - headerHeight) + objHeight;
	                    var scrollPosition = (objTop - scrollTop - headerHeight) + objHeight;
	                    var percentage = Math.round(scrollPosition / (scrollArea / 100));

	                percentage = (percentage > 100) ? 100 : 
                                 ((percentage < 0) ? 0 : percentage);

                 	setProperties(obj, {  
                 		'background-position' : '50% ' + percentage + '%'
                 	});
                });
            };

        var update = this.update = function () {
            getObjectMetrics();
            setScrollPosition();
        };

        documentReady(function () {
            update();
        });

        window.addEventListener('scroll', throttle(function() {
			setScrollPosition();
        }, 10));

        return (this);
    };
    
})(window);