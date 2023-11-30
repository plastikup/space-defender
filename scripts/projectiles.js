import { ctxS } from '../defaults/ctxS.js';
import { canvas } from '../defaults/init.js';

export function projectiles(projectilesList) {
	projectilesList.forEach((el) => {
		el.drawImage();
		el.move();
		if (el.isOutsideCanvas()) projectilesList.splice(projectilesList.indexOf(el), 1);
	});
	return projectilesList;
}
