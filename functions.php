<?php
/**
 * Functions and definitions of the Child Theme
 *
 * @package Sunflower Landingpage
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'SUNFLOWER_CHILD_THEME_VERSION' ) ) {
	$sunflower_childtheme_version = wp_get_theme()->get( 'Version' );
	define( 'SUNFLOWER_CHILD_THEME_VERSION', $sunflower_childtheme_version );
}

add_action(
	'wp_enqueue_scripts',
	function () {

		wp_enqueue_style(
			'sunflower-child-style-base',
			get_stylesheet_directory_uri() . '/style.css',
			array(),
			SUNFLOWER_CHILD_THEME_VERSION
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
				SUNFLOWER_CHILD_THEME_VERSION,
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
			SUNFLOWER_CHILD_THEME_VERSION,
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

require_once 'functions/update.php';
