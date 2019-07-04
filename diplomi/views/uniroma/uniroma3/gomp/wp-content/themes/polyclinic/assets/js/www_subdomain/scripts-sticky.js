/**
 * Sticky header and row
 *
 * @package    Polyclinic
 * @copyright  WebMan Design, Oliver Juhas
 *
 * @since    1.0
 * @version  1.1
 */





jQuery( function() {

	if ( 1280 < window.innerWidth ) {





		/**
		 * Scrolling classes on BODY
		 */

			/**
			 * Cache and variables
			 */

				var $window                           = jQuery( window ),
				    $body                             = jQuery( 'body' ),
				    $polyclinicDidScroll              = false,
				    $polyclinicLastScrollTop          = 0,
				    $polyclinicHeaderHeightMultiplier = 2,
				    $polyclinicHeader                 = jQuery( document.getElementById( 'masthead' ) ),
				    $polyclinicHeaderHeight           = $polyclinicHeader.outerHeight(),
				    $polyclinicHeaderOffset           = $polyclinicHeader.offset(),
				    $polyclinicScrollingOffset        = $polyclinicHeaderHeight * $polyclinicHeaderHeightMultiplier + $polyclinicHeaderOffset.top,
				    $polyclinicScreenResized          = true;

			/**
			 * Create site header placeholder
			 */

				jQuery( '<div id="site-header-placeholder" class="site-header-placeholder" />' )
					.insertAfter( '#masthead' );

			/**
			 * Fire on browser window scroll
			 *
			 * Reset on browser window resize.
			 */

				$window
					.on( 'resize orientationchange', function( e ) {

						// Processing

							$polyclinicDidScroll       = false;
							$polyclinicLastScrollTop   = 0;
							$polyclinicHeaderHeight    = $polyclinicHeader.outerHeight();
							$polyclinicScrollingOffset = $polyclinicHeaderHeight * $polyclinicHeaderHeightMultiplier + $polyclinicHeaderOffset.top;
							$polyclinicScreenResized   = true;

					} )
					.on( 'scroll', function( e ) {

						// Processing

							$polyclinicDidScroll = true;

					} );

				setInterval( function() {

					// Processing

						// Fixing Chrome inline styles after JavaScript loaded

							jQuery( '#masthead[style]' )
								.removeAttr( 'style' );

						// Scrolling actions

							if ( $polyclinicDidScroll ) {

								polyclinicHasScrolled();

								$polyclinicDidScroll = false;

							}

				}, 250 );



			/**
			 * Actions when scrolling screen
			 */
			function polyclinicHasScrolled() {

				// Requirements check

					if (
							$polyclinicScreenResized
							&& 1280 > window.innerWidth
						) {
						return;
					}


				// Helper variables

					var $st = $window.scrollTop();


				// Processing

					// Do nothing and remove the scrolling class when not scrolled enough

						if ( $st < $polyclinicScrollingOffset ) {

							$body
								.removeClass( 'scrolling-up scrolling-down has-scrolled' );

							// Setting up global vars

								$polyclinicLastScrollTop = $st;
								$polyclinicScreenResized = false;

							return;

						}

					// Apply the scrolling class

						$body
							.addClass( 'has-scrolled' );

						if ( $st < $polyclinicLastScrollTop ) {

							$body
								.addClass( 'scrolling-up' )
								.removeClass( 'scrolling-down' );

						} else {

							$body
								.removeClass( 'scrolling-up' )
								.addClass( 'scrolling-down' );

						}

					// Setting sticky header placeholder height

						jQuery( document.getElementById( 'site-header-placeholder' ) )
							.css( 'height', $polyclinicHeaderHeight );

					// Setting up global vars

						$polyclinicLastScrollTop = $st;
						$polyclinicScreenResized = false;

			} // /polyclinicHasScrolled





	}

} );
