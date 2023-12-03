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
