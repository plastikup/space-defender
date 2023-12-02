import { ctxS } from '../defaults/ctxS.js';
import { canvas } from '../defaults/init.js';

export function enemies(enemiesList, player, projectilesList, frame) {
    enemiesList.forEach((el) => {
		el.drawImage(frame % 2);
        el.pointAtPlayer(player);
        player = el.move(player);
        projectilesList = el.shoot(frame, projectilesList);
	});
    return [enemiesList, player, projectilesList];
}
