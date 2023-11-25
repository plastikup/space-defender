'use strict';

/* ~~~ imports ~~~ */
import { ctxS } from './defaults/ctxS.js'; // ctx functions simplified
import { default as theme } from './defaults/theme.json' assert { type: 'json' }; // JSON file containing color theme

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

/* ~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~ */

document.addEventListener('mousemove', (e) => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
});

/* ~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~ */

function main() {
	ctxS.fillRect(0, 0, canvas.width, canvas.height, theme.primary_background_color + '33');


	ctxS.drawImage(asset.backgroundImage, 0, 0, asset.backgroundImage.width, asset.backgroundImage.height, -128 * (mouse.x / canvas.width), -128 * (mouse.y / canvas.height), canvas.width + 128, canvas.height + 128);

	ctxS.fillRect(canvas.width / 2, canvas.height / 2, 100, 100, '#333');
	requestAnimationFrame(main);
}

/* ~~~ PROPERLY LOAD MULTIMEDIA ~~~ */
let asset = {
	roundedSquare: new Image(),
	backgroundImage: new Image(),
};

function loadAssets() {
	let totalNbImgs = Object.keys(asset).length;

	onload = () => {
		if (--totalNbImgs <= 0) {
			ctxS.fillRect(0, 0, canvas.width, canvas.height, theme.primary_background_color);
			main();
		}
	};

	Object.entries(asset).forEach(([, multimedia]) => {
		multimedia.onload = onload;
	});

	// assets sources:
	asset.roundedSquare.src = './assets/rounded_square_fill.png';
	asset.backgroundImage.src = './assets/background/background.png';
}

loadAssets();
console.log(theme);
