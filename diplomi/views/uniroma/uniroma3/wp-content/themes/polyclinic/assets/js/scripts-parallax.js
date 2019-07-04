/**
 * Parallax header image effect
 *
 * @package    Polyclinic
 * @copyright  WebMan Design, Oliver Juhas
 *
 * @since    1.0
 * @version  1.0
 */





jQuery( function() {

	if (
			jQuery().parallax
			&& 1200 < window.innerWidth
		) {





		/**
		 * Parallax header image effect
		 */

			jQuery( document.getElementById( 'intro-container' ) )
				.find( '.intro' )
					.addClass( 'parallax-enabled' )
					.parallax( '50%', '-0.5', true );





	} // /parallax

} );
