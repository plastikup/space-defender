'use strict';

/* ~~~ imports ~~~ */
import { ctxS } from './defaults/ctxS.js'; // ctx functions simplified
import { default as theme } from './defaults/theme.json' assert { type: 'json' }; // JSON file containing color theme

import { Projectile, EnemyT1, EnemyT2, EnemyT3 } from './defaults/classes.js';

import { exePlayer } from './scripts/player.js';
import { projectiles } from './scripts/projectiles.js';
import { enemies } from './scripts/enemies.js';

/* ~~~ canvas initialisation ~~~ */
import { canvas, ctx } from './defaults/init.js';
canvas.width = innerWidth;
canvas.height = innerHeight;
ctx.imageSmoothingEnabled = false;

/* ~~~ assets ~~~ */
import { asset } from './scripts/loadAssets.js';

/* ~~~ game variables ~~~ */
let frame;
let projectilesList = [];
let enemiesList = [];

enemiesList.push(new EnemyT1(200, 200), new EnemyT2(300, 300), new EnemyT3(400, 400));

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
document.addEventListener('mousedown', (e) => {
	if (e.button == 0) projectilesList.push(new Projectile(player.x, player.y, player.a, 10, asset.projectiles, 16, 16, 0));
	else if (e.button == 2) {
		const rando = Math.random() - 0.5;
		projectilesList.push(new Projectile(player.x, player.y, player.a + rando / 2, 12, asset.projectiles, 2, 16, 1, -1));
		projectilesList.push(new Projectile(player.x, player.y, player.a + rando / 2, 12, asset.projectiles, 2, 16, 1, 1));
	}
	if (asset.music.bravePilots.paused) asset.music.bravePilots.play();
});
document.addEventListener('contextmenu', (event) => {
	event.preventDefault();
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
	frame = Math.floor(Date.now() / 100);

	// background
	ctxS.drawImage(asset.backgroundImage, 0, 0, asset.backgroundImage.width, asset.backgroundImage.height, -128 * (player.x / canvas.width), -128 * (player.y / canvas.height), canvas.width + 128, canvas.height + 128, 0.5);

	// projectiles
	projectilesList = projectiles(projectilesList);

	// enemies
	enemiesList = enemies(enemiesList, player, frame);

	// player
	player = exePlayer(player, keyPresses, mouse, asset, frame);

	// cursor
	ctxS.drawImage(asset.crosshair, 0, 0, asset.crosshair.width, asset.crosshair.height, mouse.x - 16, mouse.y - 16, 32, 32);

	requestAnimationFrame(main);
}

function init() {
	player.w = asset.player.width;
	player.h = asset.player.height;

	console.info('ready');

	main();
}

init();
console.log(theme);
