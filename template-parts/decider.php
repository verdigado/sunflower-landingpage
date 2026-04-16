<?php
/**
 * Decider Template
 *
 * @package Sunflower Landingpage
 */

?>

<section class="decider__wrapper">

	<h2>Den richtigen Tarif finden</h2>

	<div class="decider">

		<div class="decider-cols" style="display: flex; flex-wrap: wrap;">

			<!-- Linke Spalte -->
			<div class="decider-cols__left" style="flex: 1;">

				<div id="quiz-nav" class="quiz-nav"></div>
				<div id="quiz">
					<h2>Für wen ist die Seite?</h2>
					<div class="options">
						<button class="option" data-index="0">Landesverband</button>
						<button
								class="option" data-index="1">Kreisverband
						</button>
						<button class="option"
								data-index="2">Ortsverband
						</button>
						<button class="option"
								data-index="3">Einzelperson
						</button>
						<button class="option" data-index="4">Keine
							Antwort
						</button>
					</div>
					<div style="margin-top: 20px;"></div>
				</div>

				<div id="quiz-complete-message" style="display: none;">
					<h3>Die Befragung ist abgeschlossen!</h3>
					<!-- Button wird durch JS hinzugefügt -->
				</div>

				<footer style="margin-top: 20px;">
					<button id="back" style="display:none;">Vorherige Frage</button>
					<button id="restart">Alles zurücksetzen</button>
				</footer>
			</div>

			<!-- Rechte Spalte -->
			<div class="decider-cols__right">
				<div id="result-summary" class="tarife"></div>
				<div id="result-chart">
					<div class="result-bar">
						<h3 class="label">TYPO3 <br>Basis</h3>
						<div class="bar-container">
							<span class="has-small-font-size">0 Punkte</span>
							<div class="bar-wrapper">
								<div class="bar" style="width: 0px;"></div>
							</div>
						</div>
					</div>
					<div class="result-bar">
						<h3 class="label">TYPO3 <br>Premium</h3>
						<div class="bar-container">
							<span class="has-small-font-size">0 Punkte</span>
							<div class="bar-wrapper">
								<div class="bar" style="width: 0px;"></div>
							</div>
						</div>
					</div>
					<div class="result-bar">
						<h3 class="label">WordPress <br>Basis</h3>
						<div class="bar-container">
							<span class="has-small-font-size">0 Punkte</span>
							<div class="bar-wrapper">
								<div class="bar" style="width: 0px;"></div>
							</div>
						</div>
					</div>
					<div class="result-bar">
						<h3 class="label">WordPress <br>Premium</h3>
						<div class="bar-container">
							<span class="has-small-font-size">0 Punkte</span>
							<div class="bar-wrapper">
								<div class="bar" style="width: 0px;"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
