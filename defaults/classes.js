import { ctxS } from '../defaults/ctxS.js';
import { canvas } from '../defaults/init.js';
import { asset } from '../scripts/loadAssets.js';

export class Projectile {
	constructor(x, y, a, v, uri, sx, sy, type, dir = 0) {
		this.x = x;
		this.y = y;
		this.startX = this.x;
		this.startY = this.y;
		this.a = a;
		this.s = v;
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
		this.x += Math.cos(this.a - Math.PI / 2) * this.s;
		this.y += Math.sin(this.a - Math.PI / 2) * this.s;
		if (this.type == 1) this.s = Math.max(this.s * 0.98, 3);
	}
	isOutsideCanvas() {
		return Math.abs(this.x - canvas.width / 2) > canvas.width / 2 + this.uri.width * 2 || Math.abs(this.y - canvas.height / 2) > canvas.height / 2 + this.uri.height * 2;
	}
	isTooFar() {
		return Math.sqrt((this.x - this.startX) ** 2 + (this.y - this.startY) ** 2) > (this.type == 1 ? 500 : 900);
	}
}

export class EnemyT1 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.a = 0;
		this.v = 0;
		this.uri = asset.enemyT1;

		this.meta = {
			displaySizeW: 48,
			displaySizeH: 48,
			ogSizeX: 16,
			ogSizeY: 16,
            rotShiftX: 56,
            rotShiftY: 96,
		};
	}

	drawImage(frame) {
		ctxS.drawImage(this.uri, frame * this.meta.ogSizeX, 0, this.meta.ogSizeX, this.meta.ogSizeY, this.x, this.y, this.meta.displaySizeW, this.meta.displaySizeH, 1, this.a, this.meta.rotShiftX / 2, this.meta.rotShiftY / 2);
	}
	pointAtPlayer(player) {
		this.a = Math.atan2(this.y - player.y, this.x - player.x) + Math.PI / 2;
	}
}

export class EnemyT2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.a = 0;
		this.v = 0;
		this.uri = asset.enemyT2;

		this.meta = {
			displaySizeW: 96,
			displaySizeH: 48,
			ogSizeX: 32,
			ogSizeY: 16,
            rotShiftX: 64,
            rotShiftY: 40,
		};
	}

	drawImage(frame) {
		ctxS.drawImage(this.uri, frame * this.meta.ogSizeX, 0, this.meta.ogSizeX, this.meta.ogSizeY, this.x, this.y, this.meta.displaySizeW, this.meta.displaySizeH, 1, this.a, this.meta.rotShiftX, this.meta.rotShiftY);
	}
	pointAtPlayer(player) {
		this.a = Math.atan2(this.y - player.y, this.x - player.x) + Math.PI / 2;
	}
}

export class EnemyT3 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.a = 0;
		this.v = 0;
		this.uri = asset.enemyT3;

		this.meta = {
			displaySizeW: 96,
			displaySizeH: 96,
			ogSizeX: 32,
			ogSizeY: 32,
            rotShiftX: 128,
            rotShiftY: 224,
		};
	}

	drawImage(frame) {
		ctxS.drawImage(this.uri, frame * this.meta.ogSizeX, 0, this.meta.ogSizeX, this.meta.ogSizeY, this.x, this.y, this.meta.displaySizeW, this.meta.displaySizeH, 1, this.a, this.meta.rotShiftX / 2, this.meta.rotShiftY / 2);
	}
	pointAtPlayer(player) {
		this.a = Math.atan2(this.y - player.y, this.x - player.x) + Math.PI / 2;
	}
}
