import { ctxS } from '../defaults/ctxS.js';
import { canvas, ctx } from '../defaults/init.js';
import { healthBar } from '../scripts/healthBar.js'; // draw healthbar

export function exePlayer(player, keyPresses, mouse, asset, frame) {
	// update player xy
	[player.x, player.ox] = [player.x + player.vx, player.x];
	[player.y, player.oy] = [player.y + player.vy, player.y];

	// move player
	player.vx = player.vx * 0.825 + ((keyPresses[39] || keyPresses[68]) - (keyPresses[37] || keyPresses[65]));
	player.vy = player.vy * 0.825 + ((keyPresses[40] || keyPresses[83]) - (keyPresses[38] || keyPresses[87]));

	// bounce on wall
	if (Math.abs(player.x - canvas.width / 2) > canvas.width / 2 - player.meta.collisionRadius) {
		if (player.x < canvas.width / 2) {
			player.vx = Math.max(-player.vx, player.vx) * 1.5;
			player.x = player.meta.collisionRadius;
		} else {
			player.vx = Math.min(-player.vx, player.vx) * 1.5;
			player.x = canvas.width - player.meta.collisionRadius;
		}
	}
	if (Math.abs(player.y - canvas.height / 2) > canvas.height / 2 - player.meta.collisionRadius) {
		if (player.y < canvas.height / 2) {
			player.vy = Math.max(-player.vy, player.vy) * 1.5;
			player.y = player.meta.collisionRadius;
		} else {
			player.vy = Math.min(-player.vy, player.vy) * 1.5;
			player.y = canvas.height - player.meta.collisionRadius;
		}
	}

	// point at cursor
	player.a = Math.atan2(player.y - mouse.y, player.x - mouse.x) - Math.PI / 2;

	// draw player
	ctxS.drawImage(asset.player, (player.frame % 4) * 16, Math.floor(player.frame / 4) * 24, 16, 24, player.x, player.y, 60, 90, 1, player.a, 40, 35);
	player.frame = frame % 8;

	// health
	player.meta.health = Math.min(player.meta.health + 0.004, player.meta.maxHealth);
	healthBar(player, '#0F0');

	return player;
}
