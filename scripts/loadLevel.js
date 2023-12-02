import { canvas } from '../defaults/init.js';
import { default as levels } from '../defaults/levels.json' assert { type: 'json' };
import { EnemyT1, EnemyT2, EnemyT3 } from '../defaults/classes.js';

export function loadLevel(levelID, enemiesList) {
	levels[levelID].forEach((el) => {
		if (el.enemyType == 3) enemiesList.push(new EnemyT3(el.startX / 100 * canvas.width, el.startY / 100 * canvas.height));
		else if (el.enemyType == 2) enemiesList.push(new EnemyT2(el.startX / 100 * canvas.width, el.startY / 100 * canvas.height));
		else enemiesList.push(new EnemyT1(el.startX / 100 * canvas.width, el.startY / 100 * canvas.height));
	});

	return enemiesList;
}
