// jQuery MatchHeight
!function(t){"use strict";"function"==typeof define&&define.amd?define(["jquery"],t):"undefined"!=typeof module&&module.exports?module.exports=t(require("jquery")):t(jQuery)}(function(t){var e=-1,o=-1,a=function(t){return parseFloat(t)||0},i=function(e){var o=1,i=t(e),n=null,r=[];return i.each(function(){var e=t(this),i=e.offset().top-a(e.css("margin-top")),s=r.length>0?r[r.length-1]:null;null===s?r.push(e):Math.floor(Math.abs(n-i))<=o?r[r.length-1]=s.add(e):r.push(e),n=i}),r},n=function(e){var o={byRow:!0,property:"height",target:null,remove:!1};return"object"==typeof e?t.extend(o,e):("boolean"==typeof e?o.byRow=e:"remove"===e&&(o.remove=!0),o)},r=t.fn.matchHeight=function(e){var o=n(e);if(o.remove){var a=this;return this.css(o.property,""),t.each(r._groups,function(t,e){e.elements=e.elements.not(a)}),this}return this.length<=1&&!o.target?this:(r._groups.push({elements:this,options:o}),r._apply(this,o),this)};r.version="master",r._groups=[],r._throttle=80,r._maintainScroll=!1,r._beforeUpdate=null,r._afterUpdate=null,r._rows=i,r._parse=a,r._parseOptions=n,r._apply=function(e,o){var s=n(o),h=t(e),l=[h],c=t(window).scrollTop(),p=t("html").outerHeight(!0),d=h.parents().filter(":hidden");return d.each(function(){var e=t(this);e.data("style-cache",e.attr("style"))}),d.css("display","block"),s.byRow&&!s.target&&(h.each(function(){var e=t(this),o=e.css("display");"inline-block"!==o&&"flex"!==o&&"inline-flex"!==o&&(o="block"),e.data("style-cache",e.attr("style")),e.css({display:o,"padding-top":"0","padding-bottom":"0","margin-top":"0","margin-bottom":"0","border-top-width":"0","border-bottom-width":"0",height:"100px",overflow:"hidden"})}),l=i(h),h.each(function(){var e=t(this);e.attr("style",e.data("style-cache")||"")})),t.each(l,function(e,o){var i=t(o),n=0;if(s.target)n=s.target.outerHeight(!1);else{if(s.byRow&&i.length<=1)return void i.css(s.property,"");i.each(function(){var e=t(this),o=e.attr("style"),a=e.css("display");"inline-block"!==a&&"flex"!==a&&"inline-flex"!==a&&(a="block");var i={display:a};i[s.property]="",e.css(i),e.outerHeight(!1)>n&&(n=e.outerHeight(!1)),o?e.attr("style",o):e.css("display","")})}i.each(function(){var e=t(this),o=0;s.target&&e.is(s.target)||("border-box"!==e.css("box-sizing")&&(o+=a(e.css("border-top-width"))+a(e.css("border-bottom-width")),o+=a(e.css("padding-top"))+a(e.css("padding-bottom"))),e.css(s.property,n-o+"px"))})}),d.each(function(){var e=t(this);e.attr("style",e.data("style-cache")||null)}),r._maintainScroll&&t(window).scrollTop(c/p*t("html").outerHeight(!0)),this},r._applyDataApi=function(){var e={};t("[data-match-height], [data-mh]").each(function(){var o=t(this),a=o.attr("data-mh")||o.attr("data-match-height");a in e?e[a]=e[a].add(o):e[a]=o}),t.each(e,function(){this.matchHeight(!0)})};var s=function(e){r._beforeUpdate&&r._beforeUpdate(e,r._groups),t.each(r._groups,function(){r._apply(this.elements,this.options)}),r._afterUpdate&&r._afterUpdate(e,r._groups)};r._update=function(a,i){if(i&&"resize"===i.type){var n=t(window).width();if(n===e)return;e=n}a?-1===o&&(o=setTimeout(function(){s(i),o=-1},r._throttle)):s(i)},t(r._applyDataApi),t(window).bind("load",function(t){r._update(!1,t)}),t(window).bind("resize orientationchange",function(t){r._update(!0,t)})});

// MatchMedia
window.matchMedia||(window.matchMedia=function(){"use strict";var e=window.styleMedia||window.media;if(!e){var t=document.createElement("style"),i=document.getElementsByTagName("script")[0],n=null;t.type="text/css",t.id="matchmediajs-test",i.parentNode.insertBefore(t,i),n="getComputedStyle"in window&&window.getComputedStyle(t,null)||t.currentStyle,e={matchMedium:function(e){var i="@media "+e+"{ #matchmediajs-test { width: 1px; } }";return t.styleSheet?t.styleSheet.cssText=i:t.textContent=i,"1px"===n.width}}}return function(t){return{matches:e.matchMedium(t||"all"),media:t||"all"}}}());

// MatchMedia.addListener
!function(){if(window.matchMedia&&window.matchMedia("all").addListener)return!1;var e=window.matchMedia,n=e("only all").matches,i=!1,t=0,a=[],r=function(n){clearTimeout(t),t=setTimeout(function(){for(var n=0,i=a.length;i>n;n++){var t=a[n].mql,r=a[n].listeners||[],o=e(t.media).matches;if(o!==t.matches){t.matches=o;for(var c=0,d=r.length;d>c;c++)r[c].call(window,t)}}},30)};window.matchMedia=function(t){var o=e(t),c=[],d=0;return o.addListener=function(e){n&&(i||(i=!0,window.addEventListener("resize",r,!0)),0===d&&(d=a.push({mql:o,listeners:c})),c.push(e))},o.removeListener=function(e){for(var n=0,i=c.length;i>n;n++)c[n]===e&&c.splice(n,1)},o}}();

// enquire
!function(a,b,c){var d=window.matchMedia;"undefined"!=typeof module&&module.exports?module.exports=c(d):"function"==typeof define&&define.amd?define(function(){return b[a]=c(d)}):b[a]=c(d)}("enquire",this,function(a){"use strict";function b(a,b){var c,d=0,e=a.length;for(d;e>d&&(c=b(a[d],d),c!==!1);d++);}function c(a){return"[object Array]"===Object.prototype.toString.apply(a)}function d(a){return"function"==typeof a}function e(a){this.options=a,!a.deferSetup&&this.setup()}function f(b,c){this.query=b,this.isUnconditional=c,this.handlers=[],this.mql=a(b);var d=this;this.listener=function(a){d.mql=a,d.assess()},this.mql.addListener(this.listener)}function g(){if(!a)throw new Error("matchMedia not present, legacy browsers require a polyfill");this.queries={},this.browserIsIncapable=!a("only all").matches}return e.prototype={setup:function(){this.options.setup&&this.options.setup(),this.initialised=!0},on:function(){!this.initialised&&this.setup(),this.options.match&&this.options.match()},off:function(){this.options.unmatch&&this.options.unmatch()},destroy:function(){this.options.destroy?this.options.destroy():this.off()},equals:function(a){return this.options===a||this.options.match===a}},f.prototype={addHandler:function(a){var b=new e(a);this.handlers.push(b),this.matches()&&b.on()},removeHandler:function(a){var c=this.handlers;b(c,function(b,d){return b.equals(a)?(b.destroy(),!c.splice(d,1)):void 0})},matches:function(){return this.mql.matches||this.isUnconditional},clear:function(){b(this.handlers,function(a){a.destroy()}),this.mql.removeListener(this.listener),this.handlers.length=0},assess:function(){var a=this.matches()?"on":"off";b(this.handlers,function(b){b[a]()})}},g.prototype={register:function(a,e,g){var h=this.queries,i=g&&this.browserIsIncapable;return h[a]||(h[a]=new f(a,i)),d(e)&&(e={match:e}),c(e)||(e=[e]),b(e,function(b){h[a].addHandler(b)}),this},unregister:function(a,b){var c=this.queries[a];return c&&(b?c.removeHandler(b):(c.clear(),delete this.queries[a])),this}},new g});


//
// To change this license header, choose License Headers in Project Properties.
// To change this template file, choose Tools | Templates
// and open the template in the editor.
//

jQuery(function(){
	function setTopBarPadding(){
		var bottomBarHeight = jQuery('.site-header .header-info-widgets-container').height();
		
		jQuery('.site-header-inner').css('padding-top',bottomBarHeight+'px');
	}
	
	setTopBarPadding();
	
	var resizeTimer;
	jQuery(window).resize(function() {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function(){
			setTopBarPadding();
		}, 100);
	});
	
	var heightHook = jQuery('.js-equalHeight');
	heightHook.each(function(index){
		var currentTarget = jQuery(this).attr('data-heightTarget'),
			rowTarget = jQuery(this).attr('data-heightRow'),
			context = jQuery(this);

		if(currentTarget){
			if(currentTarget === 'itself'){
				// Visto che l'elemento in questione è il context, devo prima resettare l'altezza e poi reimpostarla ogni volta
				context.css('height','').css('height',context.outerHeight()+'px');

				body.imagesLoaded(function(){
					context.css('height','').css('height',context.outerHeight()+'px');
				});

				var resizeTimer;
				jQuery(window).resize(function() {
					clearTimeout(resizeTimer);
					resizeTimer = setTimeout(function(){
						context.css('height','').css('height',context.outerHeight()+'px');
					}, 100);
				});
			} else if(currentTarget.indexOf('is target') >= 0 ) {
				jQuery(this).matchHeight({
					target: jQuery(this).parents(currentTarget.replace(' is target',''))
				});
			} else {
				jQuery(this).matchHeight({
					target: jQuery(currentTarget)
				});
			}

		} else if(rowTarget) {
			jQuery(this).children().not('.hidden').matchHeight();
		}
	});
	
	jQuery('.toggle-search').click(function(e){
		e.preventDefault();
		
		jQuery(this).toggleClass('is-active');
		if(jQuery(this).hasClass('is-active')){
			jQuery(this).next('form').find('.search-field').focus();
		}
		jQuery('body').toggleClass('form-active');
	});
	
	jQuery('<a href="#" class="blue-menu-toggle"><span class="screen-reader-text">Apri il menu secondario</span><span class="icon-bar" aria-hidden="true"></span><span class="icon-bar" aria-hidden="true"></span><span class="icon-bar" aria-hidden="true"></span></a>').insertBefore('.site-header .header-info-widgets-container .header-info-widgets');
	
	jQuery('.blue-menu-toggle').click(function(e){
		e.preventDefault();

		jQuery(this).toggleClass('is-active');
		jQuery('body').toggleClass('blue-sub-menu-active');
	});
	
	var testSearchTerm = /[?&]s=([^&]+)/i,
		searchTerm = window.location.href,
		getSearchTerm = testSearchTerm.exec(searchTerm) === null ? '' : testSearchTerm.exec(searchTerm)[1];
	
	jQuery('.site-header .search-form .search-field').attr('value',unescape(decodeURI(getSearchTerm.replace(/\+/g, ' '))));
	
	jQuery('.special-iframe').each(function(){
		var context = jQuery(this);
		context.wrap('<div class="container-video-inline" />');
	});

	if(!jQuery('#site-header-placeholder').length){
		jQuery('<div id="site-header-placeholder" class="site-header-placeholder"></div><div id="site-header-placeholder_auto-sub" class="site-header-placeholder"></div>').insertAfter('#masthead');
	} else {
		jQuery('<div id="site-header-placeholder_auto-sub" class="site-header-placeholder" />').insertAfter('#masthead');
	}
});