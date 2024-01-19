'use strict';

/* ~~~ imports ~~~ */
import { ctxS } from './defaults/ctxS.js'; // ctx functions but better

import { default as levels } from './defaults/levels.json' assert { type: 'json' }; // JSON file with all the levels

import { EnemyT1, EnemyT2, EnemyT3, EnemyT4, enemies } from './scripts/enemies.js';
import { exePlayer } from './scripts/player.js';
import { Projectile, projectiles } from './scripts/projectiles.js';

import { displayCards } from './scripts/displayCards.js'; // current level progress

/* ~~~ canvas initialisation ~~~ */
import { canvas, ctx } from './defaults/init.js';
canvas.width = innerWidth;
canvas.height = innerHeight;
ctx.imageSmoothingEnabled = false;

/* ~~~ assets ~~~ */
import { asset, rotatingAsset } from './scripts/loadAssets.js';
let currentTrack = null;

/* ~~~ game variables ~~~ */
let currentLevel = 1; //! levels starts at ONE!!!
let frame;
let projectilesList = [];
let enemiesList = [];
let upcomingEnemies = 0;

const startTS = Date.now();

const devset_playMusic = true; // for me because im annoyed by my own music lol

const mouse = {
	x: 0,
	y: 0,
};
let player = {
	x: canvas.width / 2 + 50,
	y: canvas.height / 2,
	ox: null,
	oy: null,
	vx: 0,
	vy: 0,
	w: undefined,
	h: undefined,
	a: 0,
	meta: {
		frame: 0,
		collisionRadius: 32,
		health: 50,
		maxHealth: 50,
		healthRatio: 0,
		name: 'YOU',
	},
};
const keyPresses = {
	37: false,
	38: false,
	39: false,
	40: false,
	65: false,
	68: false,
	83: false,
	87: false,
};

/* ~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~ */

// pointer lock API + full screen
canvas.addEventListener('mousedown', async () => {
	if (!(document.pointerLockElement || document.mozPointerLockElement)) {
		await canvas.requestPointerLock();
		playMusic();
	}
});

// window resize (related to full screen)
window.addEventListener('resize', () => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	ctx.imageSmoothingEnabled = false;
});

// mousemove
document.addEventListener('mousemove', (e) => {
	if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas) {
		mouse.x = Math.min(Math.max(mouse.x + e.movementX, -0.25 * canvas.width), 1.25 * canvas.width);
		mouse.y = Math.min(Math.max(mouse.y + e.movementY, -0.25 * canvas.height), 1.25 * canvas.height);
	} else {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	}
});

// shoot
document.addEventListener('mousedown', (e) => {
	if (loadingScreenAnimationId !== null) {
		cancelAnimationFrame(loadingScreenAnimationId);
		loadingScreenAnimationId = null;
		loadLevel(currentLevel);
	} else {
		function piew() {
			if (e.button == 0) {
				projectilesList.push(new Projectile(player.x + Math.cos(player.a) * 5, player.y + Math.sin(player.a) * 5, player.a, 10, asset.projectiles, 16, 16, 0, 0, true));
				projectilesList.push(new Projectile(player.x - Math.cos(player.a) * 5, player.y - Math.sin(player.a) * 5, player.a, 10, asset.projectiles, 16, 16, 0, 0, true));

				rotatingAsset.gun2.play();
			} else if (e.button == 2) {
				const rando = Math.random() - 0.5;
				projectilesList.push(new Projectile(player.x, player.y, player.a + rando / 2, 12, asset.projectiles, 2, 16, 1, -1, true));
				projectilesList.push(new Projectile(player.x, player.y, player.a + rando / 2, 12, asset.projectiles, 2, 16, 1, 1, true));

				rotatingAsset.gun2.play();
			}
		}
		piew();
		const projectileInterval = setInterval(() => {
			piew();
		}, 250);
		addEventListener('mouseup', () => {
			clearInterval(projectileInterval);
		});
	}
});
document.addEventListener('contextmenu', (e) => {
	e.preventDefault();
});

// movement
document.addEventListener('keydown', (e) => {
	keyPresses[e.keyCode] = true;
});
document.addEventListener('keyup', (e) => {
	keyPresses[e.keyCode] = false;
});

/* ~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~ */

let lastTs = 0;
function main(ts) {
	let fps = 1000 / (ts - lastTs);
	lastTs = ts;
	ctxS.fillText(Math.round(fps), '#FFF', 21, 0, 0, 'tl');

	frame = Math.floor(Date.now() / 100);

	// background
	ctxS.drawImage(asset.backgroundImage, 0, 0, asset.backgroundImage.width, asset.backgroundImage.height, -128 * (player.x / canvas.width), -128 * (player.y / canvas.height), canvas.width + 128, canvas.height + 128, 0.5);

	// projectiles
	[projectilesList, enemiesList, player] = projectiles(projectilesList, enemiesList, player);

	// enemies
	[enemiesList, player, projectilesList] = enemies(enemiesList, player, projectilesList, frame);

	// player
	player = exePlayer(player, keyPresses, mouse, asset, frame);

	// cursor
	if (Math.abs(mouse.x - canvas.width / 2) < canvas.width / 2 + 16 && Math.abs(mouse.y - canvas.height / 2) < canvas.height / 2 + 16) {
		ctxS.drawImage(asset.crosshair, 0, 0, asset.crosshair.width, asset.crosshair.height, mouse.x - 16, mouse.y - 16, 32, 32);
	} else {
		if (Math.abs(mouse.x - canvas.width / 2) > canvas.width / 2 + 16 && Math.abs(mouse.y - canvas.height / 2) > canvas.height / 2 + 16) {
			if (mouse.x > canvas.width / 2) {
				if (mouse.y < canvas.height / 2) {
					ctxS.drawImage(asset.pointer, 0, 0, asset.pointer.width, asset.pointer.height, canvas.width - 40, 16, 32, 32, 0.25, -Math.PI / 4);
				} else {
					ctxS.drawImage(asset.pointer, 0, 0, asset.pointer.width, asset.pointer.height, canvas.width - 16, canvas.height - 40, 32, 32, 0.25, Math.PI / 4);
				}
			} else {
				if (mouse.y < canvas.height / 2) {
					ctxS.drawImage(asset.pointer, 0, 0, asset.pointer.width, asset.pointer.height, 16, 40, 32, 32, 0.25, -Math.PI * 0.75);
				} else {
					ctxS.drawImage(asset.pointer, 0, 0, asset.pointer.width, asset.pointer.height, 40, canvas.height - 16, 32, 32, 0.25, Math.PI * 0.75);
				}
			}
		} else if (Math.abs(mouse.x - canvas.width / 2) > canvas.width / 2 + 16) {
			if (mouse.x < canvas.width / 2) {
				ctxS.drawImage(asset.pointer, 0, 0, asset.pointer.width, asset.pointer.height, 32, mouse.y + 16, 32, 32, 0.25, Math.PI);
			} else {
				ctxS.drawImage(asset.pointer, 0, 0, asset.pointer.width, asset.pointer.height, canvas.width - 32, mouse.y - 16, 32, 32, 0.25);
			}
		} else {
			if (mouse.y < canvas.height / 2) {
				ctxS.drawImage(asset.pointer, 0, 0, asset.pointer.width, asset.pointer.height, mouse.x - 16, 32, 32, 32, 0.25, -Math.PI / 2);
			} else {
				ctxS.drawImage(asset.pointer, 0, 0, asset.pointer.width, asset.pointer.height, mouse.x + 16, canvas.height - 32, 32, 32, 0.25, Math.PI / 2);
			}
		}
	}

	// load next level if every enemies are down
	// but first, check for health
	if (player.meta.health < 0) {
		diedLOL();
	} else if (enemiesList.length == 0 && upcomingEnemies == 0) {
		currentLevel++;
		loadingScreen();
	} else {
		displayCards(levels[currentLevel].levelName, enemiesList);
		requestAnimationFrame(main);
	}
}

function loadLevel(levelID) {
	if (levels[levelID] == undefined) {
		wonSmh();
	} else {
		levels[levelID].enemySpawn.forEach((el) => {
			upcomingEnemies++;
			setTimeout(() => {
				if (el.enemyType == 4) enemiesList.push(new EnemyT4((el.startX / 100) * canvas.width, (el.startY / 100) * canvas.height));
				else if (el.enemyType == 3) enemiesList.push(new EnemyT3((el.startX / 100) * canvas.width, (el.startY / 100) * canvas.height));
				else if (el.enemyType == 2) enemiesList.push(new EnemyT2((el.startX / 100) * canvas.width, (el.startY / 100) * canvas.height));
				else enemiesList.push(new EnemyT1((el.startX / 100) * canvas.width, (el.startY / 100) * canvas.height));
				upcomingEnemies--;
			}, el.timeout + levels[levelID].globalTimeout);
		});
		player.meta.health = Math.max(player.meta.health, player.meta.maxHealth * 0.8);

		// play music
		playMusic();

		main();
	}
}

function loadingScreen(timestamp) {
	if (levels[currentLevel]?.loadingScreen === undefined) loadLevel(currentLevel);
	else {
		const lds = levels[currentLevel].loadingScreen;

		// reset sandbox
		projectilesList = [];
		enemiesList = [];
		player.x = canvas.width / 2;
		player.y = canvas.height / 2;
		player.meta.health = player.meta.maxHealth;

		// background
		ctxS.drawImage(asset.backgroundImage, 0, 0, asset.backgroundImage.width, asset.backgroundImage.height, -128 * (player.x / canvas.width), -128 * (player.y / canvas.height), canvas.width + 128, canvas.height + 128, 0.1);
		// black square for contrast
		ctxS.fillRect(0, 0, canvas.width, canvas.height, '#0002');
		// title and subtitle
		const titleHeight = ctxS.fillText(lds.title, '#faa', 48, canvas.width / 2, 20, 'tc');
		ctxS.fillText(lds.subtitle, '#fff', 36, canvas.width / 2, 40 + titleHeight, 'tc');
		// body content
		const bodyHeight = bodyHeightTest();
		lds.content.forEach((line, i) => {
			ctxS.fillText(line, '#fff', 28 + 8 * (line.charAt(0) == '-'), canvas.width / 2, canvas.height / 2 - bodyHeight * ((lds.content.length - 1) / 2 - i), 'c');
		});
		// footer content
		ctxS.fillText(lds.tip, '#aaf', 24, canvas.width / 2, canvas.height - (40 + titleHeight), 'c');
		// indication to click to continue
		if (Math.sin(Date.now() / 64) > 0.5) {
			ctxS.fillText('click to continue', '#666', 18, canvas.width / 2, canvas.height, 'norm-c');
		}
		// play music
		playMusic();

		loadingScreenAnimationId = requestAnimationFrame(loadingScreen);
	}
}
let loadingScreenAnimationId = null;

function playMusic() {
	if (devset_playMusic) {
		if (asset.music[currentTrack] !== asset.music[levels[currentLevel].track]) {
			try {
				asset.music[currentTrack].pause();
			} catch (error) {
				console.info('No track to pause.');
			}
			currentTrack = levels[currentLevel].track;
			asset.music[currentTrack].play();
			console.info('Now playing:', currentTrack);
		}
	}
}

function init() {
	player.w = asset.player.width;
	player.h = asset.player.height;

	console.info('ready');

	loadingScreen();
}

function diedLOL() {
	// dark contrast bg
	ctxS.fillRect(0, 0, canvas.width, canvas.height, '#000A');
	// title message
	const titleHeight = ctxS.fillText('YOU DIED LOL', '#faa', 48, canvas.width / 2, 20, 'tc');
	ctxS.fillText('(skill issue)', '#fff', 36, canvas.width / 2, 40 + titleHeight, 'tc');
	// body content
	drawBody(false);
	// footer content
	ctxS.fillText('reload the page to play again! :)', '#aaf', 24, canvas.width / 2, canvas.height - (40 + titleHeight), 'c');

	// exit pointer lock
	document.exitPointerLock();
}

function wonSmh() {
	// dark contrast bg
	ctxS.fillRect(0, 0, canvas.width, canvas.height, '#000A');
	// title message
	const titleHeight = ctxS.fillText('🥳 YOU WON 🥳', '#faa', 48, canvas.width / 2, 20, 'tc');
	ctxS.fillText('you are impressive', '#fff', 36, canvas.width / 2, 40 + titleHeight, 'tc');
	// body content
	drawBody(true);
	// footer content
	ctxS.fillText('reload the page to play again! :)', '#aaf', 24, canvas.width / 2, canvas.height - (40 + titleHeight), 'c');

	// exit pointer lock
	document.exitPointerLock();
}

function drawBody(won) {
	const bodyHeight = bodyHeightTest();
	if (won) ctxS.fillText(`You won all ${currentLevel} waves!`, '#fff', 32, canvas.width / 2, canvas.height / 2 - bodyHeight, 'c');
	else ctxS.fillText(`You died at wave ${currentLevel}`, '#fff', 32, canvas.width / 2, canvas.height / 2 - bodyHeight, 'c');
	ctxS.fillText(`You survived for ${Math.floor((Date.now() - startTS) / 60000)} minutes and ${Math.floor((Date.now() - startTS) / 1000) % 60} seconds`, '#fff', 32, canvas.width / 2, canvas.height / 2, 'c');
	ctxS.fillText('deception smh.', '#fff', 32, canvas.width / 2, canvas.height / 2 + bodyHeight, 'c');
}

const bodyHeightTest = () => ctxS.fillText('lg', '#fff', 40, canvas.width / 2, 20, 'test_purposes');

init();
