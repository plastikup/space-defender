import { ctxS } from '../defaults/ctxS.js';
import { canvas } from '../defaults/init.js';

export function enemies(enemiesList, player, frame) {
    enemiesList.forEach((el) => {
		el.drawImage(frame % 2);
        el.pointAtPlayer(player);
	});
    return enemiesList;
}
