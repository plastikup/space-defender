'use strict';

/* ~~~ imports ~~~ */
import { ctxS } from './defaults/ctxS.js'; // ctx functions simplified
import { default as theme } from './defaults/theme.json' assert { type: 'json' }; // JSON file containing color theme

import { default as levels } from '../defaults/levels.json' assert { type: 'json' };

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
let currentLevel = 0;
let frame;
let projectilesList = [];
let enemiesList = [];
let upcomingEnemies = 0;

//enemiesList.push(new EnemyT2(200, 200), new EnemyT2(300, 300), new EnemyT2(400, 400));

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
	collisionRadius: 32,
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
canvas.addEventListener('click', async () => {
	if (!(document.pointerLockElement || document.mozPointerLockElement)) {
		await canvas.requestPointerLock();
		canvas.requestFullscreen();
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
	if (e.button == 0) projectilesList.push(new Projectile(player.x, player.y, player.a, 10, asset.projectiles, 16, 16, 0, 0, true));
	else if (e.button == 2) {
		const rando = Math.random() - 0.5;
		projectilesList.push(new Projectile(player.x, player.y, player.a + rando / 2, 12, asset.projectiles, 2, 16, 1, -1, true));
		projectilesList.push(new Projectile(player.x, player.y, player.a + rando / 2, 12, asset.projectiles, 2, 16, 1, 1, true));
	}
	if (asset.music.bravePilots.paused) asset.music.bravePilots.play();
});
document.addEventListener('contextmenu', (event) => {
	event.preventDefault();
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

function main() {
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
	if (enemiesList.length == 0 && upcomingEnemies == 0) {
		if (loadLevel(++currentLevel)) requestAnimationFrame(main);
	} else requestAnimationFrame(main);
}

function loadLevel(levelID) {
	if (levels[levelID] == undefined) {
		alert('(this is a placeholder) you finished every level!');
		return false;
	} else {
		levels[levelID].forEach((el) => {
			upcomingEnemies++;
			setTimeout(() => {
				if (el.enemyType == 3) enemiesList.push(new EnemyT3((el.startX / 100) * canvas.width, (el.startY / 100) * canvas.height));
				else if (el.enemyType == 2) enemiesList.push(new EnemyT2((el.startX / 100) * canvas.width, (el.startY / 100) * canvas.height));
				else enemiesList.push(new EnemyT1((el.startX / 100) * canvas.width, (el.startY / 100) * canvas.height));
				upcomingEnemies--;
			}, el.timeout + 5000);
		});
		return true;
	}
}

function init() {
	player.w = asset.player.width;
	player.h = asset.player.height;

	console.info('ready');

	main();
}

init();
console.log(theme);
