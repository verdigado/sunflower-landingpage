<?php
/**
 * Functions and definitions of the Child Theme
 *
 * @package Sunflower Landingpage
 */

add_action(
	'wp_enqueue_scripts',
	function () {

		wp_enqueue_style(
			'sunflower-child-style-base',
			get_stylesheet_directory_uri() . '/style.css',
			array(),
			wp_get_theme()->get( 'Version' )
		);
	}
);

add_action(
	'wp_enqueue_scripts',
	function () {

		// Remove parent script.
		wp_dequeue_script( 'frontend' );
		wp_deregister_script( 'frontend' );

		// Load child script.
		$child_frontend_path = get_stylesheet_directory() . '/assets/js/frontend.js';

		if ( file_exists( $child_frontend_path ) ) {
			wp_enqueue_script(
				'frontend',
				get_stylesheet_directory_uri() . '/assets/js/frontend.js',
				null,
				filemtime( $child_frontend_path ),
				true
			);
		}
	},
	100
);


/**
 * Decider Script nur auf der Frontpage laden
 */
add_action(
	'wp_enqueue_scripts',
	function () {

		if ( ! is_front_page() ) {
			return;
		}

		wp_enqueue_script(
			'decider-script',
			get_stylesheet_directory_uri() . '/assets/js/decider.js',
			array(),
			'1.0.0',
			true
		);
		wp_localize_script(
			'decider-script',
			'deciderData',
			array(
				'homeUrl' => untrailingslashit( home_url() ),
			)
		);
	}
);

/**
 * Shortcode ausgeben
 */
add_shortcode(
	'decider_quiz',
	function () {

		wp_enqueue_script( 'decider-script' );
		wp_localize_script(
			'decider-script',
			'deciderData',
			array(
				'homeUrl' => untrailingslashit( home_url() ),
			)
		);

		ob_start();

		get_template_part( 'template-parts/decider' );

		return ob_get_clean();
	}
);
