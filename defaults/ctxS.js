import { canvas, ctx } from '../defaults/init.js';

export const ctxS = {
	fillRect: (x, y, w, h, fillStyle) => {
		if (fillStyle == undefined) throw 'fillStyle is not defined.';
		ctx.fillStyle = fillStyle;
		ctx.fillRect(x, y, w, h);
	},
	fillCirc: (x, y, r, fillStyle) => {
		ctx.fillStyle = fillStyle;
		ctx.lineWidth = 0;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2, false);
		ctx.fill();
	},
	drawImage: (src, sx, sy, sw, sh, dx, dy, dw, dh, opacity = 1, a = 0, axisRotX = 0, axisRotY = 0) => {
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
	fillText: (text = 'DEFAULT TEXT', fillStyle = '#FFF', fontSize = 36, x = 0, y = 0, alignStyle = 'c') => {
		ctx.font = `${fontSize}px Impact`;
		ctx.fillStyle = fillStyle;

		// the following lines of code are found online - not by me
		let boundingBox = ctx.measureText(text);
		switch (alignStyle) {
			case 'tl':
				ctx.fillText(text, x, y + boundingBox.actualBoundingBoxAscent + boundingBox.actualBoundingBoxDescent);
				break;
			case 'c':
				ctx.fillText(text, x - boundingBox.width / 2, y + (boundingBox.actualBoundingBoxAscent + boundingBox.actualBoundingBoxDescent) / 2);
				break;
			case 'tr':
				ctx.fillText(text, x - boundingBox.width, y + boundingBox.actualBoundingBoxAscent + boundingBox.actualBoundingBoxDescent);
				break;

			default:
				ctx.fillText(text, x, y);
				console.error(`unknown 'alignStyle' argument: ${alignStyle}`);
				break;
		}
		
		return boundingBox.actualBoundingBoxAscent + boundingBox.actualBoundingBoxDescent;
	},
};
