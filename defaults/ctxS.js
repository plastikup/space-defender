import { canvas, ctx } from '../defaults/init.js';

export const ctxS = {
	fillRect: (x, y, w, h, fillStyle) => {
		if (fillStyle == undefined) throw 'fillStyle is not defined.';
		ctx.fillStyle = fillStyle;
		ctx.fillRect(x, y, w, h);
	},
	drawImage: function (src, sx, sy, sw, sh, dx, dy, dw, dh, opacity = 1) {
		ctx.globalAlpha = opacity;
		ctx.drawImage(src, sx, sy, sw, sh, dx, dy, dw, dh);
		ctx.globalAlpha = 1;
	},
	fillPattern: (src, x, y, w, h, shift, opacity = 1) => {
		ctx.globalAlpha = opacity;
		let pattern = ctx.createPattern(src, 'repeat');
		for (let i = 0; i < Math.ceil(w / src.width); i++) {
			pattern.setTransform(new DOMMatrix([1, 0, 0, 1, 0, i * -125]));

			ctx.fillStyle = pattern//.setTransform(matrix.translateSelf(0, -10 * i))
			ctx.fillRect(i * src.width, i * shift, src.width, canvas.height);
		}
		ctx.globalAlpha = 1;
	},
};
