(function($) {

	skel.breakpoints({
		xlarge: '(min-width: 1281px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)',
		xxsmall: '(max-width: 360px)'
	});



	var lazy = [];

	registerListener('load', setLazy);
	registerListener('load', lazyLoad);
	registerListener('scroll', lazyLoad);
	registerListener('resize', lazyLoad);

	function setLazy(){
			lazy = document.getElementsByClassName('lazy');
			console.log('Found ' + lazy.length + ' lazy images');
	}

	function lazyLoad(){
			for(var i=0; i<lazy.length; i++){
					if(isInViewport(lazy[i])){
							if (lazy[i].getAttribute('data-src')){
									lazy[i].src = lazy[i].getAttribute('data-src');
									lazy[i].removeAttribute('data-src');
							}
					}
			}

			cleanLazy();
	}

	function cleanLazy(){
			lazy = Array.prototype.filter.call(lazy, function(l){ return l.getAttribute('data-src');});
	}

	function isInViewport(el){
			var rect = el.getBoundingClientRect();

			return (
					rect.bottom >= 0 &&
					rect.right >= 0 &&
					rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
					rect.left <= (window.innerWidth || document.documentElement.clientWidth)
			 );
	}

	function registerListener(event, func) {
			if (window.addEventListener) {
					window.addEventListener(event, func)
			} else {
					window.attachEvent('on' + event, func)
			}
	}

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = (skel.vars.browser == 'ie' || skel.vars.browser == 'edge' || skel.vars.mobile) ? function() { return $(this) } : function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				on, off;

			on = function() {

				$t.css('background-position', 'center 100%, center 100%, center 0px');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$t.css('background-position', 'center ' + (pos * (-1 * intensity)) + 'px');

					});

			};

			off = function() {

				$t
					.css('background-position', '');

				$window
					.off('scroll._parallax');

			};

			skel.on('change', function() {

				if (skel.breakpoint('medium').active)
					(off)();
				else
					(on)();

			});

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$wrapper = $('#wrapper'),
			$header = $('#header'),
			$banner = $('#intro');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load pageshow', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Clear transitioning state on unload/hide.
			$window.on('unload pagehide', function() {
				window.setTimeout(function() {
					$('.is-transitioning').removeClass('is-transitioning');
				}, 250);
			});

		// Fix: Enable IE-only tweaks.
			if (skel.vars.browser == 'ie' || skel.vars.browser == 'edge')
				$body.addClass('is-ie');

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Scrolly.
			$('.scrolly').scrolly({
				offset: function() {
					return $header.height() - 2;
				}
			});

		// Tiles.
			var $tiles = $('.tiles > article');

			$tiles.each(function() {

				var $this = $(this),
					$image = $this.find('.image'), $img = $image.find('img'),
					$link = $this.find('.link'),
					x;

				// Image.

					// Set image.
						$this.css('background-image', 'url(' + $img.attr('src') + ')');

					// Set position.
						if (x = $img.data('position'))
							$image.css('background-position', x);

					// Hide original.
						$image.hide();

				// Link.
					if ($link.length > 0) {

						$x = $link.clone()
							.text('')
							.addClass('primary')
							.appendTo($this);

						$link = $link.add($x);

						$link.on('click', function(event) {

							var href = $link.attr('href');

							// Prevent default.
								event.stopPropagation();
								event.preventDefault();

							// Start transitioning.
								$this.addClass('is-transitioning');
								$wrapper.addClass('is-transitioning');

							// Redirect.
								window.setTimeout(function() {

									if ($link.attr('target') == '_blank')
										window.open(href);
									else
										location.href = href;

								}, 500);

						});

					}

			});

		// Header.
			if (skel.vars.IEVersion < 9)
				$header.removeClass('alt');

			if ($banner.length > 0
			&&	$header.hasClass('alt')) {

				$window.on('resize', function() {
					$window.trigger('scroll');
				});

				$window.on('load', function() {

					$banner.scrollex({
						bottom:		$header.height() + 10,
						terminate:	function() { $header.removeClass('alt'); },
						enter:		function() { $header.addClass('alt'); },
						leave:		function() { $header.removeClass('alt'); $header.addClass('reveal'); }
					});

					window.setTimeout(function() {
						$window.triggerHandler('scroll');
					}, 100);

				});

			}



	});

	if ( window.location.pathname == '/' ){
	    // Index (home) page
			if ($('#methodList')) {
				$('#methodList').listnav({
					flagDisabled: true,    // Add a class of 'ln-disabled' to nav items with no content to show
					removeDisabled: true, // Remove those 'ln-disabled' nav items (flagDisabled must be set to true for this to function)
					allText: 'All',        // set custom text in navbar to ALL button
					noMatchText: 'No matching methods', // set custom text for nav items with no content to show
					showCounts: true,
					onClick: lazyLoad
				});
			}

			var mySiema = new Siema({
				duration: 500,
				loop: true
			});

			var prev = document.querySelector('.prev-slide');
			var next = document.querySelector('.next-slide');

			prev.addEventListener('click', function () {
				return mySiema.prev();
			})

			next.addEventListener('click', function () {
				return mySiema.next();
			})

			new ClipboardJS('.copy');

			setInterval(function() {
				 mySiema.next();
			 }, 15000);


	}

})(jQuery);
