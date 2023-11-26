'use strict';

/* ~~~ imports ~~~ */
import { ctxS } from './defaults/ctxS.js'; // ctx functions simplified
import { default as theme } from './defaults/theme.json' assert { type: 'json' }; // JSON file containing color theme

import { exePlayer } from './scripts/player.js';

/* ~~~ canvas initialisation ~~~ */
import { canvas, ctx } from './defaults/init.js';
canvas.width = innerWidth;
canvas.height = innerHeight;
ctx.imageSmoothingEnabled = false;

/* ~~~ assets ~~~ */
// none atm

/* ~~~ game variables ~~~ */
const mouse = {
	x: 0,
	y: 0,
};
let player = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	ox: null,
	oy: null,
	vx: 0,
	vy: 0,
	w: undefined,
	h: undefined,
	a: 0,
	frame: 0,
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

document.addEventListener('mousemove', (e) => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
});

document.addEventListener('keydown', (e) => {
	keyPresses[e.keyCode] = true;
});
document.addEventListener('keyup', (e) => {
	keyPresses[e.keyCode] = false;
});

/* ~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~ */

function main() {
	ctxS.fillRect(0, 0, canvas.width, canvas.height, theme.primary_background_color + '33');

	// background
	ctxS.drawImage(asset.backgroundImage, 0, 0, asset.backgroundImage.width, asset.backgroundImage.height, -128 * (player.x / canvas.width), -128 * (player.y / canvas.height), canvas.width + 128, canvas.height + 128, 0.5);

	// player
	player = exePlayer(player, keyPresses, mouse, asset);

	requestAnimationFrame(main);
}

function init() {
	player.w = asset.player.width;
	player.h = asset.player.height;

	main();
}

/* ~~~ PROPERLY LOAD MULTIMEDIA ~~~ */
let asset = {
	backgroundImage: new Image(),
	player: new Image(),
};

function loadAssets() {
	let totalNbImgs = Object.keys(asset).length;

	Object.entries(asset).forEach(([, multimedia]) => {
		multimedia.onload = () => {
			if (--totalNbImgs <= 0) {
				ctxS.fillRect(0, 0, canvas.width, canvas.height, theme.primary_background_color);
				init();
			}
		};
	});

	// assets sources:
	asset.backgroundImage.src = './assets/background/background.png';
	asset.player.src = './assets/ships/ship.png';
}

loadAssets();
console.log(theme);
