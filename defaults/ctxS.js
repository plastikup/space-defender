import { canvas, ctx } from '../defaults/init.js';

export const ctxS = {
	fillRect: (x, y, w, h, fillStyle) => {
		if (fillStyle == undefined) throw 'fillStyle is not defined.';
		ctx.fillStyle = fillStyle;
		ctx.fillRect(x, y, w, h);
	},
	drawImage: function (src, sx, sy, sw, sh, dx, dy, dw, dh, opacity = 1, a = 0, axisRotX = 0, axisRotY = 0) {
		ctx.globalAlpha = opacity;
		ctx.translate(dx, dy);
		ctx.rotate(a);
		ctx.drawImage(src, sx, sy, sw, sh, -axisRotX, -axisRotY, dw + axisRotX / 2, dh + axisRotY / 2);
		ctx.rotate(-a);
		ctx.translate(-dx, -dy);
		ctx.globalAlpha = 1;
	},
	fillPattern: (src, x, y, w, h, shift, gxshift, gyshift, opacity = 1) => {
		ctx.translate(gxshift, gyshift);
		ctx.globalAlpha = opacity;
		let pattern = ctx.createPattern(src, 'repeat');
		for (let i = -1; i < Math.ceil(w / src.width) + 1; i++) {
			pattern.setTransform(new DOMMatrix([1, 0, 0, 1, 0, i * -shift]));

			ctx.fillStyle = pattern;
			ctx.fillRect(i * src.width, -src.height * 2, src.width, canvas.height + src.height * 4);
		}
		ctx.globalAlpha = 1;
		ctx.translate(-gxshift, -gyshift);
	},
};
