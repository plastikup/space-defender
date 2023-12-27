import { ctxS } from '../defaults/ctxS.js';
import { canvas } from '../defaults/init.js';
import { asset, rotatingAsset } from '../scripts/loadAssets.js';
import { healthBar } from '../scripts/healthBar.js';
import { Projectile } from '../scripts/projectiles.js';

export function enemies(enemiesList, player, projectilesList, frame) {
	enemiesList.forEach((el, i) => {
		if (el.meta.health < 0) {
			if ('dieDance' in el) [projectilesList, enemiesList] = el?.dieDance(projectilesList, enemiesList);
			enemiesList.splice(i, 1);
		} else {
			el.drawImage(frame % 2);
			el.pointAtPlayer(player);
			el.wallBounce();
			player = el.move(player);
			[projectilesList, enemiesList] = el.shoot(frame, projectilesList, enemiesList);
		}
	});
	return [enemiesList, player, projectilesList];
}

export class EnemyT1 {
	constructor(x, y, v = 0) {
		this.x = x;
		this.y = y;
		this.ma = 0;
		this.a = 0;
		this.v = v;
		this.acc = 0.4;
		this.uri = asset.enemyT1;

		this.bx = 0;
		this.by = 0;

		this.meta = {
			name: 'RAMMER',
			enemyLevel: 0,

			displaySizeW: 48,
			displaySizeH: 48,
			ogSizeX: 16,
			ogSizeY: 16,
			rotShiftX: 56,
			rotShiftY: 96,
			lastProjectile: null,
			collisionRadius: 24,

			hasWallCollisionYet: false,

			health: 20,
			maxHealth: 20,
			healthRatio: 1,
		};
	}

	drawImage(frame) {
		ctxS.drawImage(this.uri, frame * this.meta.ogSizeX, 0, this.meta.ogSizeX, this.meta.ogSizeY, this.x, this.y, this.meta.displaySizeW, this.meta.displaySizeH, 1, this.a - Math.PI / 2, this.meta.rotShiftX / 2, this.meta.rotShiftY / 2);

		healthBar(this);
	}
	pointAtPlayer(player) {
		this.a = Math.atan2(player.y - this.y, player.x - this.x);
	}
	move(player) {
		this.ma = Math.atan2(player.y - this.y, player.x - this.x);

		const dToP = Math.sqrt((this.x - player.x) ** 2 + (this.y - player.y) ** 2);
		if (dToP < this.meta.collisionRadius + player.meta.collisionRadius) player = this.collide(player);

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
		[player.vx, player.vy] = [Math.cos(this.ma) * 5, Math.sin(this.ma) * 5];
		this.v = -10;

		this.meta.health--;
		player.meta.health--;

		return player;
	}
	shoot(frame, projectilesList, enemiesList) {
		if (frame % 10 == 0 && Date.now() - this.meta.lastProjectile > 100) {
			this.meta.lastProjectile = Date.now();

			setTimeout(() => {
				projectilesList.push(new Projectile(this.x, this.y, this.ma + Math.PI / 2, 6, asset.projectiles, 2, 0, 0));
				rotatingAsset.gun1.play();
				this.v -= 8;
			}, Math.random() * 200);
		}
		return [projectilesList, enemiesList];
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
			enemyLevel: 1,

			displaySizeW: 96,
			displaySizeH: 48,
			ogSizeX: 32,
			ogSizeY: 16,
			rotShiftX: 64,
			rotShiftY: 40,
			lastProjectile: null,
			collisionRadius: 32,
			randomDir: Math.round(Math.random()) * 0.5 - 0.25,
			randomShootingTimingShift: Math.random() * 8000,

			hasWallCollisionYet: false,

			health: 35,
			maxHealth: 35,
			healthRatio: 1,
		};
	}

	drawImage(frame) {
		ctxS.drawImage(this.uri, frame * this.meta.ogSizeX, 0, this.meta.ogSizeX, this.meta.ogSizeY, this.x, this.y, this.meta.displaySizeW, this.meta.displaySizeH, 1, this.a - Math.PI / 2, this.meta.rotShiftX, this.meta.rotShiftY);

		healthBar(this);
	}
	pointAtPlayer(player) {
		this.a = Math.atan2(player.y - this.y, player.x - this.x);
	}
	move(player) {
		this.ma = Math.atan2(player.y - this.y, player.x - this.x);

		const dToP = Math.sqrt((this.x - player.x) ** 2 + (this.y - player.y) ** 2);
		if (dToP < this.meta.collisionRadius + player.meta.collisionRadius) player = this.collide(player);

		if (dToP > 400 || (this.meta.hasWallCollisionYet && Math.floor((Date.now() + this.meta.randomShootingTimingShift) / 2000) % 3 == 0)) {
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
		[player.vx, player.vy] = [Math.cos(this.ma) * 5, Math.sin(this.ma) * 5];
		this.v = -10;

		this.meta.health--;
		player.meta.health--;

		return player;
	}
	shoot(_, projectilesList, enemiesList) {
		if (this.meta.hasWallCollisionYet && Math.floor((Date.now() + this.meta.randomShootingTimingShift) / 2000) % 3 == 0 && Date.now() - this.meta.lastProjectile > 100) {
			this.meta.lastProjectile = Date.now();

			projectilesList.push(new Projectile(this.x, this.y, this.a + Math.PI / 2 + 0.5 * (Math.random() - 0.5), 10, asset.projectiles, 16, 0, 2));
			rotatingAsset.gun1.play();
			this.v -= 5;
		}
		return [projectilesList, enemiesList];
	}
}

export class EnemyT3 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.ma = 0;
		this.a = 0;
		this.vx = 0;
		this.vy = 0;
		this.acc = [0.22, 0.5, 0, 0];
		this.uri = asset.enemyT3;

		this.bx = 0;
		this.by = 0;

		this.meta = {
			name: 'MEGA',
			enemyLevel: 2,

			displaySizeW: 96,
			displaySizeH: 96,
			ogSizeX: 32,
			ogSizeY: 32,
			rotShiftX: 128,
			rotShiftY: 224,
			lastProjectile: null,
			collisionRadius: 40,

			hasWallCollisionYet: false,

			health: 100,
			maxHealth: 100,
			healthRatio: 1,

			attackStatus: 0,
			attackStatusCount: 0,
			attackStatusDuration: {
				0: 600,
				1: 400,
				2: 400,
				3: 600,
			},
			attackStatusProgress: 0,
		};
	}
	/*
	0 - normal shoot & move forward
	1 - rammer
	2 - make birth
	3 - static but better shooting
	*/

	drawImage(frame) {
		ctxS.drawImage(this.uri, frame * this.meta.ogSizeX, 0, this.meta.ogSizeX, this.meta.ogSizeY, this.x, this.y, this.meta.displaySizeW, this.meta.displaySizeH, 1, this.a - Math.PI / 2, this.meta.rotShiftX / 2, this.meta.rotShiftY / 2);

		if (++this.meta.attackStatusCount > this.meta.attackStatusDuration[this.meta.attackStatus]) {
			this.meta.attackStatus = ++this.meta.attackStatus % Object.keys(this.meta.attackStatusDuration).length;
			this.meta.attackStatusCount = 0;
			this.meta.attackStatusProgress = 0;
		}

		healthBar(this);
	}
	pointAtPlayer(player) {
		if (this.meta.attackStatus == 3) {
			let v = Math.sqrt(player.vx ** 2 + player.vy ** 2);
			let w = 10;
			let alpha = Math.atan2(this.y - player.y, this.x - player.x) - Math.atan2(player.vy, player.vx);

			let extra = Math.asin((Math.sin(alpha) * v) / w);

			if (isNaN(extra)) console.error('The aiming calculation of Enemy3 could not be done because it is not in the living range of arcsin.');

			let tga = extra + Math.atan2(player.y - this.y, player.x - this.x);
			this.a = (this.a * 4 + tga) / 5;
		} else {
			this.a = this.ma;
		}
	}
	move(player) {
		this.ma = Math.atan2(player.y - this.y, player.x - this.x);

		const dToP = Math.sqrt((this.x - player.x) ** 2 + (this.y - player.y) ** 2);
		if (dToP < this.meta.collisionRadius + player.meta.collisionRadius) player = this.collide(player);

		this.vx += Math.cos(this.ma) * this.acc[this.meta.attackStatus];
		this.vy += Math.sin(this.ma) * this.acc[this.meta.attackStatus];
		this.x += this.vx;
		this.y += this.vy;

		this.vx *= 0.97;
		this.vy *= 0.97;
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
		[player.vx, player.vy] = [Math.cos(this.ma) * 10, Math.sin(this.ma) * 10];
		this.vx = -2.5 * Math.cos(this.ma);
		this.vy = -2.5 * Math.sin(this.ma);

		this.meta.health--;
		player.meta.health -= 2;

		return player;
	}
	shoot(frame, projectilesList, enemiesList) {
		if ((frame % (2 + (this.meta.attackStatus == 3)) == 0 && Date.now() - this.meta.lastProjectile > 100 && this.meta.attackStatus != 1 && this.meta.attackStatus != 2) || (this.meta.attackStatus == 1 && ++this.meta.attackStatusProgress % 4 == 0)) {
			projectilesList.push(new Projectile(this.x, this.y, this.a + Math.PI / 2 - (this.meta.attackStatus == 1) * Math.PI + (this.meta.attackStatus != 3) * 0.2 * (Math.random() - 0.5), 12 - (this.meta.attackStatus == 1) * 5, asset.projectiles, 2, 0, 3));
			rotatingAsset.gun1.play();
			if (this.meta.attackStatus == 3) {
				this.vx = -1 * Math.cos(this.a);
				this.vy = -1 * Math.sin(this.a);
			}
			this.meta.lastProjectile = Date.now();
		} else if (this.meta.attackStatus == 2 && ++this.meta.attackStatusProgress % 100 == 50) {
			enemiesList.push(new EnemyT1(this.x, this.y, -10));
		}
		return [projectilesList, enemiesList];
	}
	dieDance(projectilesList, _) {
		for (let i = 0; i < 36; i++) {
			projectilesList.push(new Projectile(this.x, this.y, ((i * 10) / 180) * Math.PI, 10, asset.projectiles, 2, 0, 3));
		}
		return [projectilesList, _];
	}
}

export class EnemyT4 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.ma = 0;
		this.uri = asset.enemyT4;

		this.bx = 0;
		this.by = 0;

		this.meta = {
			name: 'DYNAMITE',
			enemyLevel: 3,

			displaySizeW: 32,
			displaySizeH: 32,
			ogSizeX: 16,
			ogSizeY: 16,
			rotShiftX: 40,
			rotShiftY: 40,
			lastProjectile: null,
			collisionRadius: 22,

			health: 7,
			maxHealth: 7,
			healthRatio: 1,
		};
	}

	drawImage(frame) {
		ctxS.drawImage(this.uri, frame * this.meta.ogSizeX, 0, this.meta.ogSizeX, this.meta.ogSizeY, this.x, this.y, this.meta.displaySizeW, this.meta.displaySizeH, 1, 0, this.meta.rotShiftX / 2, this.meta.rotShiftY / 2);

		healthBar(this);
	}
	pointAtPlayer() {}
	move(player) {
		this.ma = Math.atan2(player.y - this.y, player.x - this.x);

		const dToP = Math.sqrt((this.x - player.x) ** 2 + (this.y - player.y) ** 2);
		if (dToP < this.meta.collisionRadius + player.meta.collisionRadius) player = this.collide(player);
		return player;
	}
	wallBounce() {}
	collide(player) {
		[player.vx, player.vy] = [Math.cos(this.ma) * 5, Math.sin(this.ma) * 5];

		this.meta.health -= 2;
		player.meta.health -= 2;

		return player;
	}
	shoot(frame, projectilesList, enemiesList) {
		if (frame % 60 == 0 && Date.now() - this.meta.lastProjectile > 100) {
			this.meta.lastProjectile = Date.now();

			setTimeout(() => {
				projectilesList.push(new Projectile(this.x, this.y, 0, 6, asset.projectiles, 2, 0, 0));
				projectilesList.push(new Projectile(this.x, this.y, Math.PI / 2, 6, asset.projectiles, 2, 0, 0));
				projectilesList.push(new Projectile(this.x, this.y, Math.PI, 6, asset.projectiles, 2, 0, 0));
				projectilesList.push(new Projectile(this.x, this.y, Math.PI * 1.5, 6, asset.projectiles, 2, 0, 0));
				rotatingAsset.gun1.play();

				this.meta.health -= 0.4;
			}, Math.random() * 200);
		}
		return [projectilesList, enemiesList];
	}
	dieDance(projectilesList, enemiesList) {
		for (let i = 0; i < 18; i++) {
			projectilesList.push(new Projectile(this.x, this.y, ((i * 20) / 180) * Math.PI, 10, asset.projectiles, 2, 0, 3));
		}

		if (enemiesList.length == 1) {
			// if dynamite is the last enemy in the sandbox, there will always be 1T3, 1T2 and 1T1
			enemiesList.push(new EnemyT3(this.x, this.y));
			enemiesList.push(new EnemyT2(this.x, this.y));
			enemiesList.push(new EnemyT1(this.x, this.y, -10));
		} else {
			const rando = Math.random();
			if (rando < 0.2) {
				// 20% chance to pop TWO dynamites
				enemiesList.push(new EnemyT4(this.x + Math.random() * 50 - 25, this.y + Math.random() * 50 - 25));
				enemiesList.push(new EnemyT4(this.x + Math.random() * 50 - 25, this.y + Math.random() * 50 - 25));
			} else if (rando < 0.6) {
				// 40% chance to pop 2T2 & 1T1
				enemiesList.push(new EnemyT2(this.x, this.y));
				enemiesList.push(new EnemyT2(this.x, this.y));
				enemiesList.push(new EnemyT1(this.x, this.y, -10));
			} else if (rando < 0.9) {
				// 40% chance to pop 2T2
				enemiesList.push(new EnemyT2(this.x, this.y));
				enemiesList.push(new EnemyT2(this.x, this.y));
			} else {
				// 10% chance to pop a 1T3
				enemiesList.push(new EnemyT3(this.x, this.y));
			}
		}

		return [projectilesList, enemiesList];
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
