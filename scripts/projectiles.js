import { ctxS } from '../defaults/ctxS.js';
import { canvas } from '../defaults/init.js';

export function projectiles(projectilesList, enemiesList, player) {
	projectilesList.forEach((el) => {
		el.drawImage();
		el.move();
		[projectilesList, enemiesList, player] = el.collide(projectilesList, enemiesList, player, el);
		if (el.isOutsideCanvas() || el.isTooFar()) projectilesList.splice(projectilesList.indexOf(el), 1);
	});
	return [projectilesList, enemiesList, player];
}

export class Projectile {
	constructor(x, y, a, v, uri, sx, sy, type, dir = 0, firedByPlayer = false) {
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
		this.firedByPlayer = firedByPlayer;
	}

	drawImage() {
		let sinus = Math.cos((Date.now() - this.creationTime) / 80 + Math.PI / 8) * 25 * (this.type == 1) * this.dir;
		ctxS.drawImage(this.uri, this.sx, this.sy, 16, 16, this.x + sinus * Math.cos(this.a), this.y + sinus * Math.sin(this.a), this.uri.width, this.uri.height, 1, this.a, this.uri.width / 2, this.uri.height / 2);
	}
	move() {
		this.x += Math.cos(this.a - Math.PI / 2) * this.s;
		this.y += Math.sin(this.a - Math.PI / 2) * this.s;
		if (this.type == 1) this.s = Math.max(this.s * 0.9825, 3);
	}
	collide(projectilesList, enemiesList, player, bulletRaw) {
		if (this.firedByPlayer) {
			// hit enemy
			enemiesList.forEach((el) => {
				if (Math.sqrt((this.x - el.x) ** 2 + (this.y - el.y) ** 2) < el.meta.collisionRadius + 8) {
					el.meta.health -= 1 + 0.5 * this.type;
					projectilesList.splice(projectilesList.indexOf(bulletRaw), 1);
				}
			});
		} else {
			// hit player
			if (Math.sqrt((this.x - player.x) ** 2 + (this.y - player.y) ** 2) < player.meta.collisionRadius + 8) {
				player.meta.health -= 1 + (this.type == 2);
				projectilesList.splice(projectilesList.indexOf(bulletRaw), 1);
			}
		}
		return [projectilesList, enemiesList, player];
	}
	isOutsideCanvas() {
		return Math.abs(this.x - canvas.width / 2) > canvas.width / 2 + this.uri.width * 2 || Math.abs(this.y - canvas.height / 2) > canvas.height / 2 + this.uri.height * 2;
	}
	isTooFar() {
		return Math.sqrt((this.x - this.startX) ** 2 + (this.y - this.startY) ** 2) > (this.type == 1 ? 500 : 900);
	}
}