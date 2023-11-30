'use strict';

/* ~~~ imports ~~~ */
import { ctxS } from './defaults/ctxS.js'; // ctx functions simplified
import { default as theme } from './defaults/theme.json' assert { type: 'json' }; // JSON file containing color theme

import { exePlayer } from './scripts/player.js';
import { projectiles } from './scripts/projectiles.js';

/* ~~~ canvas initialisation ~~~ */
import { canvas, ctx } from './defaults/init.js';
canvas.width = innerWidth;
canvas.height = innerHeight;
ctx.imageSmoothingEnabled = false;

/* ~~~ assets ~~~ */
// none atm

/* ~~~ game variables ~~~ */
let frame;

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

let projectilesList = [];
class Projectile {
	constructor(x, y, a, v, uri, sx, sy, type, dir = 0) {
		this.x = x;
		this.y = y;
		this.startX = this.x;
		this.startY = this.y;
		this.a = a;
		this.v = v;
		this.uri = uri;
		this.sx = sx;
		this.sy = sy;
		this.type = type;
		this.dir = dir;
		this.creationTime = Date.now();
	}

	introduce() {
		console.log(`Hello, my name is undefined`);
	}
	drawImage() {
		let sinus = Math.cos((Date.now() - this.creationTime) / 80 + Math.PI / 8) * 25 * (this.type == 1) * this.dir;
		ctxS.drawImage(this.uri, this.sx, this.sy, 16, 16, this.x + sinus * Math.cos(this.a), this.y + sinus * Math.sin(this.a), this.uri.width, this.uri.height, 1, this.a, this.uri.width / 2, this.uri.height / 2);
	}
	move() {
		this.x += Math.cos(this.a - Math.PI / 2) * this.v;
		this.y += Math.sin(this.a - Math.PI / 2) * this.v;
		if (this.type == 1) this.v = Math.max(this.v * 0.98, 3);
	}
	isOutsideCanvas() {
		return Math.abs(this.x - canvas.width / 2) > canvas.width / 2 + this.uri.width * 2 || Math.abs(this.y - canvas.height / 2) > canvas.height / 2 + this.uri.height * 2;
	}
	isTooFar() {
		return Math.sqrt((this.x - this.startX) ** 2 + (this.y - this.startY) ** 2) > (this.type == 1 ? 500 : 900);
	}
}

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

	// player
	player = exePlayer(player, keyPresses, mouse, asset, frame);

	// cursor
	ctxS.drawImage(asset.crosshair, 0, 0, asset.crosshair.width, asset.crosshair.height, mouse.x - 16, mouse.y - 16, 32, 32);

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
	crosshair: new Image(),
	projectiles: new Image(),
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
	asset.crosshair.src = './assets/crosshair.png';
	asset.projectiles.src = './assets/ships/projectiles.png';
}

loadAssets();
console.log(theme);
