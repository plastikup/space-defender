import { ctxS } from '../defaults/ctxS.js';

export function exePlayer(player, keyPresses, mouse, asset) {
	// update player xy
	[player.x, player.ox] = [player.x + player.vx, player.x];
	[player.y, player.oy] = [player.y + player.vy, player.y];

	// move player
	player.vx = player.vx * 0.9 + ((keyPresses[39] || keyPresses[68]) - (keyPresses[37] || keyPresses[65])) * 1;
	player.vy = player.vy * 0.9 + ((keyPresses[40] || keyPresses[83]) - (keyPresses[38] || keyPresses[87])) * 1;

	// point at cursor
	player.a = Math.atan2(player.y - mouse.y, player.x - mouse.x) - Math.PI / 2;

	// draw player
	ctxS.drawImage(asset.player, (player.frame % 4) * 16, Math.floor(player.frame / 4) * 24, 16, 24, player.x, player.y, 60, 90, 1, player.a, 30, 30);
	player.frame = Math.floor(Date.now() / 100) % 8;

	return player;
}
