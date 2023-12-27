import { canvas, ctx } from '../defaults/init.js';
import { ctxS } from '../defaults/ctxS.js';
import { asset } from '../scripts/loadAssets.js';

ctx.font = `48px Impact`;
const boundingBox = ctx.measureText('Wave 0123456789');
const waveTextHeight = boundingBox.actualBoundingBoxAscent + boundingBox.actualBoundingBoxDescent;

let cards = [];

class Card {
	constructor(enemyLevel) {
		this.enemyLevel = enemyLevel;
		this.x = canvas.width / 2 - 96 / 4;
		this.vx = 0;
		this.y = waveTextHeight + 40 + 96 / 2;
		this.w = 96;
		this.h = 96;

		if (enemyLevel == 0) {
			this.meta = {
				color: '#080',
				img: asset.enemyT1,
				sw: 16,
				dw: this.w - 20,
				dh: this.h - 20,
			};
		} else if (enemyLevel == 1) {
			this.meta = {
				color: '#FD1',
				img: asset.enemyT2,
				sw: 32,
				dw: this.h - 10,
				dh: this.h / 2 - 10,
			};
		} else if (enemyLevel == 2) {
			this.meta = {
				color: '#04A',
				img: asset.enemyT3,
				sw: 32,
				dw: this.w - 20,
				dh: this.h - 20,
			};
		} else {
			this.meta = {
				color: '#04A',
				img: asset.enemyT4,
				sw: 16,
				dw: this.w - 40,
				dh: this.h - 40,
				notFullHeight: true,
			};
		}
	}

	drawCard() {
		ctxS.roundRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h, [12], 6, this.meta.color + 'A', this.meta.color + '4');
		ctxS.drawImage(this.meta.img, 0, 0, this.meta.sw, this.meta?.notFullHeight ? this.meta.img.height / 2 : this.meta.img.height, this.x - this.meta.dw / 2, this.y - this.meta.dh / 2, this.meta.dw - 2, this.meta.dh - 2);
	}
	arrangeCards(sum, index) {
		let tgx = 112 * (index - (sum - 1) / 2) + canvas.width / 2;
		this.vx = 0.75 * ((tgx - this.x) / 5 + this.vx);
		this.x += this.vx;
	}
}

export function displayCards(levelName, enemiesList) {
	updateCardsArray(enemiesList);
	ctxS.fillText(levelName, '#FFF', 48, canvas.width / 2, 20, 'tc');
	cards.forEach((card, i) => {
		card.arrangeCards(cards.length, i);
		card.drawCard();
	});
}

function updateCardsArray(enemiesList) {
	let negativeCards = [...cards];
	let negativeEnemiesList = [...enemiesList];

	enemiesList.forEach((el, i) => {
		for (let j = 0; j <= negativeCards.length; j++) {
			if (j == negativeCards.length) {
				cards.push(new Card(el.meta.enemyLevel));
			} else {
				const card = negativeCards[j];

				if (card.enemyLevel == el.meta.enemyLevel) {
					negativeCards.splice(j, 1);
					negativeEnemiesList.splice(i, 1);
					return;
				}
			}
		}
	});
	negativeCards.forEach((card) => {
		cards.splice(cards.indexOf(card), 1);
	});
}
