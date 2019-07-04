/**
 * Accessible navigation
 *
 * @link  http://a11yproject.com/
 * @link  https://codeable.io/community/wordpress-accessibility-creating-accessible-dropdown-menus/
 *
 * @package    Polyclinic
 * @copyright  WebMan Design, Oliver Juhas
 *
 * @since    1.0
 * @version  1.1
 *
 * Contents:
 *
 * 10) Accessibility
 * 20) Mobile navigation
 */





jQuery( function() {





	/**
	 * Cache
	 */

		var $polyclinicSiteNavigation   = jQuery( document.getElementById( 'site-navigation' ) ),
		    $polyclinicSiteMenuPrimary  = jQuery( document.getElementById( 'menu-primary' ) ),
		    $polyclinicMenuToggleButton = jQuery( '#menu-toggle, #menu-toggle-bar' );





	/**
	 * 10) Accessibility
	 */

		/**
		 * Adding ARIA attributes
		 */

			$polyclinicSiteNavigation
				.find( 'li' )
					.attr( 'role', 'menuitem' );

			$polyclinicSiteNavigation
				.find( '.menu-item-has-children' )
					.attr( 'aria-haspopup', 'true' );

			$polyclinicSiteNavigation
				.find( '.sub-menu' )
					.attr( 'role', 'menu' );



		/**
		 * Setting `.focus` class for menu parent
		 */

			$polyclinicSiteNavigation
				.on( 'focus.aria mouseenter.aria', '.menu-item-has-children', function( e ) {

					// Processing

						jQuery( e.currentTarget )
							.addClass( 'focus' );

				} );

			$polyclinicSiteNavigation
				.on( 'blur.aria mouseleave.aria', '.menu-item-has-children', function( e ) {

					// Processing

						jQuery( e.currentTarget )
							.removeClass( 'focus' );

				} );



		/**
		 * Touch-enabled
		 */

			$polyclinicSiteNavigation
				.on( 'touchstart click', '.menu-item-has-children > a .expander', function( e ) {

					// Helper variables

						var $this = jQuery( this ).parent().parent(); // Get the LI element


					// Processing

						e.preventDefault();

						$this
							.toggleClass( 'focus' )
							.siblings()
								.removeClass( 'focus' );

				} );



		/**
		 * Menu navigation with arrow keys
		 */

			$polyclinicSiteNavigation
				.on( 'keydown', 'a', function( e ) {

					// Helper variables

						var $this = jQuery( this );


					// Processing

						if ( e.which === 37 ) {

							// Left key

								e.preventDefault();

								$this
									.parent()
									.prev()
										.children( 'a' )
											.focus();

						} else if ( e.which === 39 ) {

							// Right key

								e.preventDefault();

								$this
									.parent()
									.next()
										.children( 'a' )
											.focus();

						} else if ( e.which === 40 ) {

							// Down key

								e.preventDefault();

								if ( $this.next().length ) {

									$this
										.next()
											.find( 'li:first-child a' )
											.first()
												.focus();

								} else {

									$this
										.parent()
										.next()
											.children( 'a' )
												.focus();

								}

						} else if ( e.which === 38 ) {

							// Up key

								e.preventDefault();

								if ( $this.parent().prev().length ) {

									$this
										.parent()
										.prev()
											.children( 'a' )
												.focus();

								} else {

									$this
										.parents( 'ul' )
										.first()
										.prev( 'a' )
											.focus();

								}

						}

				} );





	/**
	 * 20) Mobile navigation
	 */

		/**
		 * Mobile navigation
		 */

			/**
			 * Mobile menu actions
			 */
			function polyclinicMobileMenuActions() {

				// Processing

					if ( ! $polyclinicSiteNavigation.hasClass( 'active' ) ) {

						$polyclinicSiteMenuPrimary
							.attr( 'aria-hidden', 'true' );

						$polyclinicMenuToggleButton
							.attr( 'aria-expanded', 'false' );

					}

					$polyclinicSiteNavigation
						.on( 'keydown', function( e ) {

							// Processing

								if ( e.which === 27 ) {

									// ESC key

										e.preventDefault();

										$polyclinicSiteNavigation
											.removeClass( 'active' );

										$polyclinicSiteMenuPrimary
											.attr( 'aria-hidden', 'true' );

										$polyclinicMenuToggleButton
											.focus();

								}

						} );

			} // /polyclinicMobileMenuActions

			// Default mobile menu setup

				if ( 880 >= window.innerWidth ) {

					$polyclinicSiteNavigation
						.removeClass( 'active' );

					polyclinicMobileMenuActions();

				}

			// Clicking the menu toggle button

				$polyclinicMenuToggleButton
					.on( 'click', function( e ) {

						// Processing

							e.preventDefault();

							$polyclinicSiteNavigation
								.toggleClass( 'active' );

							if ( $polyclinicSiteNavigation.hasClass( 'active' ) ) {

								$polyclinicSiteMenuPrimary
									.attr( 'aria-hidden', 'false' );

								$polyclinicMenuToggleButton
									.attr( 'aria-expanded', 'true' );

							} else {

								$polyclinicSiteMenuPrimary
									.attr( 'aria-hidden', 'true' );

								$polyclinicMenuToggleButton
									.attr( 'aria-expanded', 'false' );

							}

					} );

			// Refocus to menu toggle button once the end of the menu is reached

				$polyclinicSiteNavigation
					.on( 'focus.aria', '.menu-toggle-skip-link', function( e ) {

						// Processing

							$polyclinicMenuToggleButton
								.focus();

					} );

			// Disable mobile navigation on wider screens

				jQuery( window )
					.on( 'resize orientationchange', function( e ) {

						// Processing

							if ( 880 < window.innerWidth ) {

								// On desktops

								$polyclinicSiteNavigation
									.removeClass( 'active' );

								$polyclinicSiteMenuPrimary
									.attr( 'aria-hidden', 'false' );

								$polyclinicMenuToggleButton
									.attr( 'aria-expanded', 'true' );

							} else {

								// On mobiles

								polyclinicMobileMenuActions();

							}

					} );





} );
