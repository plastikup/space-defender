import { ctx } from '../defaults/init.js';
import { ctxS } from '../defaults/ctxS.js';

export function healthBar(el, fillColor = '#FF4433') {
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
	ctx.strokeStyle = fillColor;
	ctx.moveTo(el.x - 30, el.y + el.meta.collisionRadius * 1.2);
	ctx.lineTo(el.x + 60 * (el.meta.healthRatio - 0.5), el.y + el.meta.collisionRadius * 1.2);
	ctx.stroke();

	ctx.save();
	ctx.shadowColor = 'black';
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 5;
	const textHeight = ctxS.fillText(el.meta.name, 'white', 14, el.x + 30, el.y + el.meta.collisionRadius * 1.2 + 6, 'tr');
	if (el.meta.name == 'MACHINE') ctxS.fillText(el.meta.name2, 'white', 14, el.x + 30, el.y + el.meta.collisionRadius * 1.2 + textHeight + 8, 'tr');
	ctx.restore();
}
