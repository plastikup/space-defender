import { ctxS } from '../defaults/ctxS.js';
import { canvas } from '../defaults/init.js';

export function enemies(enemiesList, player, projectilesList, frame) {
	enemiesList.forEach((el) => {
		if (el.meta.health < 0) {
			enemiesList.splice(enemiesList.indexOf(el), 1);
		} else {
			el.drawImage(frame % 2);
			el.pointAtPlayer(player);
			el.wallBounce();
			player = el.move(player);
			projectilesList = el.shoot(frame, projectilesList);
		}
	});
	return [enemiesList, player, projectilesList];
}
