/**
 * Theme frontend scripts
 *
 * @package    Polyclinic
 * @copyright  WebMan Design, Oliver Juhas
 *
 * @since    1.0
 * @version  1.4
 *
 * Contents:
 *
 * 10) Basics
 * 20) Content
 */





( function( $ ) {





	/**
	 * 10) Basics
	 */

		/**
		 * Tell CSS that JS is enabled...
		 */

			$( '.no-js' )
				.removeClass( 'no-js' );



		/**
		 * Fixing Recent Comments widget multiple appearances
		 */

			$( '.widget_recent_comments ul' )
				.attr( 'id', '' );



		/**
		 * Back to top buttons
		 */

			if ( 1280 < window.innerWidth ) {

				$( '.back-to-top' )
					.on( 'click', function( e ) {

						// Processing

							e.preventDefault();

							$( 'html, body' )
								.animate( {
									scrollTop : 0
								}, 600 );

					} );

			}



		/**
		 * Responsive videos
		 */

			if ( $().fitVids ) {

				$( document.getElementById( 'content' ) )
					.fitVids();

			} // /fitVids





	/**
	 * 20) Content
	 */

		/**
		 * Comment form improvements
		 *
		 * Set input fields placeholders from field labels.
		 * Set textarea rows.
		 */

			$( document.getElementById( 'commentform' ) )
				.find( 'input[type="text"], input[type="email"], input[type="url"], textarea' )
					.each( function( index, el ) {

						// Helper variables

							var $this = $( el );


						// Processing

							$this
								.attr( 'placeholder', $this.prev( 'label' ).text() )
								.prev( 'label' )
									.addClass( 'screen-reader-text' );

					} )
				.end()
				.find( 'textarea' )
					.attr( 'rows', 4 );





} )( jQuery );
