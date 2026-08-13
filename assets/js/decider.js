// Quiz-Logik mit Live-Auswertung, Tarif-Empfehlung und Zahlen-Navigation

/* global deciderData */

document.addEventListener( 'DOMContentLoaded', function () {
	const homeUrl =
		typeof deciderData !== 'undefined' && deciderData.homeUrl
			? deciderData.homeUrl
			: '';
	const quizContainer = document.getElementById( 'quiz' );
	const resultChart = document.getElementById( 'result-chart' );
	const resultSummary = document.getElementById( 'result-summary' );
	const backButton = document.getElementById( 'back' );
	const restartButton = document.getElementById( 'restart' );
	const quizCompleteMessage = document.getElementById(
		'quiz-complete-message'
	);
	const navContainer = document.getElementById( 'quiz-nav' );
	const decider = document.querySelector( '.decider' );

	if ( resultSummary ) {
		resultSummary.innerHTML =
			'<h3 class="decider-hint tarife__tarif has-gruener-sand-background-color has-background">Bitte trefft eine Auswahl, um Tarif-Empfehlungen zu erhalten.</h3>';
	}

	let currentQuestionIndex = 0;
	let maxVisitedQuestionIndex = 0; // bis wohin man springen darf
	let answers = [];
	let isCompleted = false;

	const products = [
		'TYPO3 Basis',
		'TYPO3 Premium',
		'WordPress Basis',
		'WordPress Premium',
	];
	const points = {
		'TYPO3 Basis': 0,
		'TYPO3 Premium': 0,
		'WordPress Basis': 0,
		'WordPress Premium': 0,
	};

	const questions = [
		{
			question: 'Für wen ist die Seite?',
			options: [
				{
					text: 'Landesverband',
					score: { 'TYPO3 Premium': 1, 'WordPress Premium': 1 },
				},
				{
					text: 'Kreisverband',
					score: {
						'TYPO3 Basis': 1,
						'TYPO3 Premium': 1,
						'WordPress Basis': 1,
						'WordPress Premium': 1,
					},
				},
				{
					text: 'Ortsverband',
					score: { 'TYPO3 Basis': 1, 'WordPress Basis': 1 },
				},
				{
					text: 'Einzelperson',
					score: {
						'TYPO3 Basis': 1,
						'WordPress Basis': 1,
						'WordPress Premium': 1,
					},
				},
			],
		},
		{
			question:
				'Möchtet ihr Websites weiterer Gliederungen oder Personen integrieren?',
			options: [
				{
					text: 'Ja',
					score: {
						'TYPO3 Basis': 1,
						'TYPO3 Premium': 1,
						'WordPress Premium': 1,
					},
				},
				{ text: 'Nein', score: {} },
				{ text: 'Weiß ich nicht', score: {} },
			],
		},
		{
			question: 'Möchtet ihr Inhalte mit weiteren Gliederungen teilen?',
			options: [
				{
					text: 'Ja',
					score: { 'TYPO3 Premium': 1, 'WordPress Premium': 1 },
				},
				{
					text: 'Nein',
					score: { 'TYPO3 Premium': 1, 'WordPress Premium': 1 },
				},
			],
		},
		{
			question: 'Wie viel Erfahrung habt ihr mit dem Content Management?',
			options: [
				{
					text: 'Etwas – TYPO3',
					score: { 'TYPO3 Basis': 1, 'TYPO3 Premium': 1 },
				},
				{
					text: 'Viel – TYPO3',
					score: { 'TYPO3 Basis': 1, 'TYPO3 Premium': 2 },
				},
				{
					text: 'Etwas – WordPress',
					score: { 'WordPress Basis': 1, 'WordPress Premium': 1 },
				},
				{
					text: 'Viel – WordPress',
					score: { 'WordPress Basis': 1, 'WordPress Premium': 2 },
				},
				{
					text: 'Wenig oder keine Erfahrung',
					score: { 'TYPO3 Basis': 2, 'WordPress Basis': 1 },
				},
			],
		},
		{
			question: 'Möchtet ihr Betreuung oder viel selbst verwalten?',
			options: [
				{
					text: 'Betreuung erwünscht',
					score: {
						'TYPO3 Basis': 2,
						'TYPO3 Premium': 2,
						'WordPress Premium': 1,
					},
				},
				{
					text: 'Selbst verwalten',
					score: { 'WordPress Basis': 2, 'WordPress Premium': 2 },
				},
			],
		},
		{
			question: 'Braucht ihr ein geschütztes Intranet?',
			options: [
				{ text: 'Ja', score: { 'TYPO3 Premium': 7 } },
				{
					text: 'Nein',
					score: {
						'TYPO3 Basis': 1,
						'WordPress Basis': 1,
						'WordPress Premium': 1,
					},
				},
			],
		},
		{
			question: 'Wie viele E-Mail-Konten und Mailinglisten braucht ihr?',
			options: [
				{
					text: 'Bis 20',
					score: {
						'TYPO3 Basis': 1,
						'TYPO3 Premium': 1,
						'WordPress Basis': 1,
						'WordPress Premium': 1,
					},
				},
				{
					text: 'Mehr als 20',
					score: { 'TYPO3 Premium': 2, 'WordPress Premium': 2 },
				},
			],
		},
		{
			question: 'Wollt ihr Themes oder Plugins installieren können?',
			options: [
				{
					text: '100% frei gestalten',
					score: { 'WordPress Premium': 2 },
				},
				{
					text: 'Im geschützten Rahmen',
					score: { 'TYPO3 Premium': 2, 'WordPress Premium': 1 },
				},
				{
					text: 'Nein',
					score: { 'TYPO3 Basis': 1, 'WordPress Basis': 1 },
				},
				{ text: 'Weiß ich nicht', score: {} },
			],
		},
		{
			question: 'Sind zentrale Inhalte von gruene.de für euch wichtig?',
			options: [
				{
					text: 'Ja',
					score: {
						'TYPO3 Basis': 1,
						'TYPO3 Premium': 1,
						'WordPress Premium': 1,
					},
				},
				{
					text: 'Nein',
					score: { 'WordPress Basis': 1, 'WordPress Premium': 1 },
				},
			],
		},
	];

	function renderNav() {
		if ( ! navContainer ) {
			return;
		}

		navContainer.innerHTML =
			'<div class="quiz-nav__track">' +
			questions
				.map( ( q, idx ) => {
					const isActive =
						! isCompleted && idx === currentQuestionIndex;
					const isAnswered = answers[ idx ] !== undefined;
					const isDisabled =
						idx > maxVisitedQuestionIndex || isCompleted;

					const classes = [
						'quiz-nav__item',
						isActive ? 'is-active' : '',
						isAnswered ? 'is-answered' : '',
						isDisabled ? 'is-disabled' : '',
					]
						.filter( Boolean )
						.join( ' ' );

					const disabledAttr = isDisabled
						? ' disabled="disabled"'
						: '';

					return `<button class="${ classes }" data-index="${ idx }"${ disabledAttr }>${
						idx + 1
					}</button>`;
				} )
				.join( '' ) +
			'</div>';
	}

	function renderQuestion() {
		if ( isCompleted ) {
			return;
		}

		quizCompleteMessage.style.display = 'none';

		const q = questions[ currentQuestionIndex ];
		quizContainer.innerHTML =
			`<h3>${ q.question }</h3><div class="options">` +
			q.options
				.map(
					( opt, idx ) =>
						`<button class="option" data-index="${ idx }">${ opt.text }</button>`
				)
				.join( '' ) +
			`</div><div style="margin-top: 20px;"></div>`;

		document.querySelectorAll( '.option' ).forEach( ( btn ) => {
			btn.addEventListener( 'click', () => {
				const idx = parseInt( btn.dataset.index, 10 );
				answers[ currentQuestionIndex ] = idx;

				if ( currentQuestionIndex > maxVisitedQuestionIndex ) {
					maxVisitedQuestionIndex = currentQuestionIndex;
				}

				// Punkte / Tarif immer nach jeder Antwort aktualisieren
				updateScores();

				// letzte Frage?
				const isLastQuestion =
					currentQuestionIndex === questions.length - 1;

				if ( isLastQuestion ) {
					// alle Fragen beantwortet → Abschluss-Screen (10. Seite)
					isCompleted = true;
					maxVisitedQuestionIndex = questions.length - 1;
					showFinalMessage();
					renderNav();
					return;
				}

				// sonst: zur nächsten Frage
				currentQuestionIndex = Math.min(
					currentQuestionIndex + 1,
					questions.length - 1
				);

				if ( currentQuestionIndex > maxVisitedQuestionIndex ) {
					maxVisitedQuestionIndex = currentQuestionIndex;
				}

				renderQuestion();
				renderNav();
			} );
		} );

		backButton.style.display =
			currentQuestionIndex > 0 ? 'inline-block' : 'none';

		renderNav();
	}

	function updateScores() {
		products.forEach( ( p ) => ( points[ p ] = 0 ) );

		answers.forEach( ( selectedIdx, i ) => {
			if (
				selectedIdx !== undefined &&
				questions[ i ] &&
				questions[ i ].options[ selectedIdx ]
			) {
				const selected = questions[ i ].options[ selectedIdx ];
				for ( const [ key, value ] of Object.entries(
					selected.score
				) ) {
					points[ key ] += value;
				}
			}
		} );

		const sorted = Object.entries( points ).sort(
			( a, b ) => b[ 1 ] - a[ 1 ]
		);

		resultChart.innerHTML = sorted
			.map( ( [ product, value ] ) => {
				return `<div class="result-bar">
                            <div class="bar-container">
                            <h3 class="label">${ product }</h3>
                            <span class="has-small-font-size">${ value } Punkte</span>
                                <div class="bar-wrapper">
                                <div class="bar" style="--points: ${ value };"></div>
                                </div>
                            </div>
                        </div>`;
			} )
			.join( '' );

		renderBestTariff();
	}

	function renderBestTariff() {
		const values = Object.values( points );
		const maxPoints = Math.max( ...values );

		if ( maxPoints === 0 ) {
			resultSummary.innerHTML = `<h3 class="decider-hint tarife__tarif has-gruener-sand-background-color has-background"><img class="arrow" src="${ homeUrl }/wp-content/themes/sunflower-landingpage/assets/img/arrow-left.svg" alt="Pfeil nach links">Triff eine Auswahl, um das für dich passende Modell zu berechnen.</h3>`;
			return;
		}

		const best = Object.entries( points ).reduce( ( a, b ) =>
			a[ 1 ] > b[ 1 ] ? a : b
		)[ 0 ];

		const id = best.toLowerCase().replace( /\s+/g, '-' );
		const card = document.getElementById( id );

		resultSummary.innerHTML = '';
		if ( card ) {
			resultSummary.appendChild( card.cloneNode( true ) );
		}
	}

	function showFinalMessage() {
		decider.classList.add( 'quiz--complete' );
		quizContainer.style.display = 'none';
		quizCompleteMessage.innerHTML =
			'<h3>Die Befragung ist abgeschlossen.</h3>';
		quizCompleteMessage.style.display = 'block';
		backButton.style.display = 'none';
	}

	if ( navContainer ) {
		navContainer.addEventListener( 'click', ( event ) => {
			const btn = event.target.closest( '.quiz-nav__item' );
			if ( ! btn || isCompleted ) {
				return;
			}
			const idx = parseInt( btn.dataset.index, 10 );
			if ( Number.isNaN( idx ) ) {
				return;
			}
			if ( idx > maxVisitedQuestionIndex ) {
				return;
			}
			currentQuestionIndex = idx;
			renderQuestion();
			updateScores();
		} );
	}

	backButton.addEventListener( 'click', () => {
		if ( isCompleted ) {
			return;
		}
		if ( currentQuestionIndex > 0 ) {
			currentQuestionIndex--;
			renderQuestion();
			updateScores();
		}
	} );

	restartButton.addEventListener( 'click', () => {
		decider.classList.remove( 'quiz--complete' );
		currentQuestionIndex = 0;
		maxVisitedQuestionIndex = 0;
		answers = [];
		products.forEach( ( p ) => ( points[ p ] = 0 ) );
		resultSummary.innerHTML =
			'<h3 class="decider-hint tarife__tarif has-gruener-sand-background-color has-background">Triff eine Auswahl, um das für dich passende Modell zu berechnen.</h3>';
		quizCompleteMessage.style.display = 'none';
		quizContainer.style.display = 'block';
		isCompleted = false;
		renderQuestion();
		updateScores();
		renderNav();
	} );

	renderQuestion();
	updateScores();
	renderNav();
} );
