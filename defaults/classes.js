import { ctx } from '../defaults/init.js';
import { ctxS } from '../defaults/ctxS.js';
import { canvas } from '../defaults/init.js';
import { asset } from '../scripts/loadAssets.js';

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
		if (this.type == 1) this.s = Math.max(this.s * 0.98, 3);
	}
	collide(projectilesList, enemiesList, player, bulletRaw) {
		if (this.firedByPlayer) {
			// hit enemy
			enemiesList.forEach((el) => {
				if (Math.sqrt((this.x - el.x) ** 2 + (this.y - el.y) ** 2) < el.meta.collisionRadius + 8) {
					el.meta.health -= 1 - 0.25 * this.type;
					projectilesList.splice(projectilesList.indexOf(bulletRaw), 1);
				}
			});
		} else {
			// hit player
			if (Math.sqrt((this.x - player.x) ** 2 + (this.y - player.y) ** 2) < player.collisionRadius + 8) {
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

export class EnemyT1 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.ma = 0;
		this.a = 0;
		this.v = 0;
		this.acc = 0.4;
		this.uri = asset.enemyT1;

		this.bx = 0;
		this.by = 0;

		this.meta = {
			name: 'RAMMER',

			displaySizeW: 48,
			displaySizeH: 48,
			ogSizeX: 16,
			ogSizeY: 16,
			rotShiftX: 56,
			rotShiftY: 96,
			lastProjectile: null,
			collisionRadius: 24,

			hasWallCollisionYet: false,

			health: 8,
			maxHealth: 8,
			healthRatio: 1,
		};
	}

	drawImage(frame) {
		ctxS.drawImage(this.uri, frame * this.meta.ogSizeX, 0, this.meta.ogSizeX, this.meta.ogSizeY, this.x, this.y, this.meta.displaySizeW, this.meta.displaySizeH, 1, this.a - Math.PI / 2, this.meta.rotShiftX / 2, this.meta.rotShiftY / 2);

		stroke_gb(this);
	}
	pointAtPlayer(player) {
		this.a = Math.atan2(player.y - this.y, player.x - this.x);
	}
	move(player) {
		this.ma = Math.atan2(player.y - this.y, player.x - this.x);

		const dToP = Math.sqrt((this.x - player.x) ** 2 + (this.y - player.y) ** 2);
		if (dToP < this.meta.collisionRadius + player.collisionRadius) player = this.collide(player);

		this.v += this.acc;
		this.x += Math.cos(this.ma) * this.v;
		this.y += Math.sin(this.ma) * this.v;

		this.v *= 0.9;
		return player;
	}
	wallBounce() {
		if (!this.meta.hasWallCollisionYet) {
			if (Math.abs(this.x - canvas.width / 2) < canvas.width / 2 - this.meta.collisionRadius * 1.5 && Math.abs(this.y - canvas.height / 2) < canvas.height / 2 - this.meta.collisionRadius * 1.5) this.meta.hasWallCollisionYet = true;
			else return;
		}
		wallBounce_gb(this);
	}
	collide(player) {
		[player.vx, player.vy] = [Math.cos(this.a) * 5, Math.sin(this.a) * 5];
		this.ma = this.a;
		this.v = -10;

		return player;
	}
	shoot(frame, projectilesList) {
		if (frame % 10 == 0 && Date.now() - this.meta.lastProjectile > 100) {
			projectilesList.push(new Projectile(this.x, this.y, this.ma + Math.PI / 2, 6, asset.projectiles, 2, 0, 0));
			this.v -= 8;
			this.meta.lastProjectile = Date.now();
		}
		return projectilesList;
	}
}

export class EnemyT2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.ma = 0;
		this.a = 0;
		this.v = 0;
		this.acc = 0.5;
		this.uri = asset.enemyT2;

		this.bx = 0;
		this.by = 0;

		this.meta = {
			name: 'MACHINE',
			name2: 'GUN',

			displaySizeW: 96,
			displaySizeH: 48,
			ogSizeX: 32,
			ogSizeY: 16,
			rotShiftX: 64,
			rotShiftY: 40,
			lastProjectile: null,
			collisionRadius: 32,
			randomDir: Math.round(Math.random()) * 0.5 - 0.25,
			randomShootingTimingShift: Math.random() * 10000,

			hasWallCollisionYet: false,

			health: 12,
			maxHealth: 12,
			healthRatio: 1,
		};
	}

	drawImage(frame) {
		ctxS.drawImage(this.uri, frame * this.meta.ogSizeX, 0, this.meta.ogSizeX, this.meta.ogSizeY, this.x, this.y, this.meta.displaySizeW, this.meta.displaySizeH, 1, this.a - Math.PI / 2, this.meta.rotShiftX, this.meta.rotShiftY);

		stroke_gb(this);
	}
	pointAtPlayer(player) {
		this.a = Math.atan2(player.y - this.y, player.x - this.x);
	}
	move(player) {
		this.ma = Math.atan2(player.y - this.y, player.x - this.x);

		const dToP = Math.sqrt((this.x - player.x) ** 2 + (this.y - player.y) ** 2);
		if (dToP < this.meta.collisionRadius + player.collisionRadius) player = this.collide(player);

		if (dToP > 400 || (this.meta.hasWallCollisionYet && Math.floor((Date.now() + this.meta.randomShootingTimingShift) / 2000) % 4 == 0)) {
			this.v += this.acc;
		} else if (dToP > 300) {
			this.ma = this.a + Math.PI / 2;
			this.v += this.meta.randomDir;
		} else {
			this.v -= this.acc;
		}

		this.v = this.v * 0.9;
		this.x += Math.cos(this.ma) * this.v;
		this.y += Math.sin(this.ma) * this.v;
		return player;
	}
	wallBounce() {
		if (!this.meta.hasWallCollisionYet) {
			if (Math.abs(this.x - canvas.width / 2) < canvas.width / 2 - this.meta.collisionRadius * 1.5 && Math.abs(this.y - canvas.height / 2) < canvas.height / 2 - this.meta.collisionRadius * 1.5) this.meta.hasWallCollisionYet = true;
			else return;
		}
		wallBounce_gb(this);
	}
	collide(player) {
		[player.vx, player.vy] = [Math.cos(this.a) * 5, Math.sin(this.a) * 5];
		this.ma = this.a;
		this.v = -10;

		return player;
	}
	shoot(_, projectilesList) {
		if (this.meta.hasWallCollisionYet && Math.floor((Date.now() + this.meta.randomShootingTimingShift) / 2000) % 4 == 0 && Date.now() - this.meta.lastProjectile > 100) {
			projectilesList.push(new Projectile(this.x, this.y, this.a + Math.PI / 2 + 0.5 * (Math.random() - 0.5), 10, asset.projectiles, 16, 0, 0));
			this.v -= 5;
			this.meta.lastProjectile = Date.now();
		}
		return projectilesList;
	}
}

export class EnemyT3 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.ma = 0;
		this.a = 0;
		this.v = 0;
		this.acc = 0.6;
		this.uri = asset.enemyT3;

		this.bx = 0;
		this.by = 0;

		this.meta = {
			name: 'BOSS',

			displaySizeW: 96,
			displaySizeH: 96,
			ogSizeX: 32,
			ogSizeY: 32,
			rotShiftX: 128,
			rotShiftY: 224,
			lastProjectile: null,
			collisionRadius: 48,

			hasWallCollisionYet: false,

			health: 25,
			maxHealth: 25,
			healthRatio: 1,
		};
	}

	drawImage(frame) {
		ctxS.drawImage(this.uri, frame * this.meta.ogSizeX, 0, this.meta.ogSizeX, this.meta.ogSizeY, this.x, this.y, this.meta.displaySizeW, this.meta.displaySizeH, 1, this.a, this.meta.rotShiftX / 2, this.meta.rotShiftY / 2);

		stroke_gb(this);
	}
	pointAtPlayer(player) {
		this.a = Math.atan2(this.y - player.y, this.x - player.x) + Math.PI / 2;
	}
	move(player) {
		const dToP = Math.sqrt((this.x - player.x) ** 2 + (this.y - player.y) ** 2);
		const aToP = Math.atan2(this.y - player.y, this.x - player.x) + Math.PI / 2;

		return player;
	}
	wallBounce() {
		if (!this.meta.hasWallCollisionYet) {
			if (Math.abs(this.x - canvas.width / 2) < canvas.width / 2 - this.meta.collisionRadius * 1.5 && Math.abs(this.y - canvas.height / 2) < canvas.height / 2 - this.meta.collisionRadius * 1.5) this.meta.hasWallCollisionYet = true;
			else return;
		}
		wallBounce_gb(this);
	}
	shoot(frame, projectilesList) {
		/*
		if (frame % 4 == 0 && Date.now() - this.meta.lastProjectile > 100) {
			projectilesList.push(new Projectile(this.x, this.y, this.ma + Math.PI / 2, 6, asset.projectiles, 2, 0, 0));
			this.v -= 8;
			this.meta.lastProjectile = Date.now();
		}
		*/
		return projectilesList;
	}
}

function wallBounce_gb(el) {
	if (Math.abs(el.x - canvas.width / 2) > canvas.width / 2 - el.meta.collisionRadius) {
		if (el.x < canvas.width / 2) {
			el.bx = 10;
			el.x = el.meta.collisionRadius;
		} else {
			el.bx = -10;
			el.x = canvas.width - el.meta.collisionRadius;
		}
	}
	if (Math.abs(el.y - canvas.height / 2) > canvas.height / 2 - el.meta.collisionRadius) {
		if (el.y < canvas.height / 2) {
			el.by = 10;
			el.y = el.meta.collisionRadius;
		} else {
			el.by = -10;
			el.y = canvas.height - el.meta.collisionRadius;
		}
	}
	el.bx *= 0.9;
	el.by *= 0.9;
	el.x += el.bx;
	el.y += el.by;
}

function stroke_gb(el) {
	ctx.lineCap = 'round';

	ctx.beginPath();
	ctx.lineWidth = 8;
	ctx.strokeStyle = '#222';
	ctx.moveTo(el.x - 30, el.y + el.meta.collisionRadius * 1.2);
	ctx.lineTo(el.x + 30, el.y + el.meta.collisionRadius * 1.2);
	ctx.stroke();

	const newHealthRatio = el.meta.health / el.meta.maxHealth;
	el.meta.healthRatio = (el.meta.healthRatio * 4 + newHealthRatio) / 5;

	ctx.beginPath();
	ctx.lineWidth = 6;
	ctx.strokeStyle = '#0F0';
	ctx.moveTo(el.x - 30, el.y + el.meta.collisionRadius * 1.2);
	ctx.lineTo(el.x + 60 * (el.meta.healthRatio - 0.5), el.y + el.meta.collisionRadius * 1.2);
	ctx.stroke();

	ctx.save()
	ctx.shadowColor = 'black';
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 5;
	const textHeight = ctxS.fillText(el.meta.name, 'white', 14, el.x + 30, el.y + el.meta.collisionRadius * 1.2 + 6, 'tr');
	if (el.meta.name == 'MACHINE') ctxS.fillText(el.meta.name2, 'white', 14, el.x + 30, el.y + el.meta.collisionRadius * 1.2 + textHeight + 8, 'tr');
	ctx.restore();
}
