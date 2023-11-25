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
let game = {
	x: 0,
	y: 0,
};

/* ~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~ */

function main() {
	ctxS.fillRect(0, 0, canvas.width, canvas.height, theme.primary_background_color + '33');

	ctxS.fillRect(canvas.width / 2, canvas.height / 2, 100, 100, '#333');
	requestAnimationFrame(main);
}

main();
console.log(theme);
