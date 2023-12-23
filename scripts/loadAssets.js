let asset = {
	backgroundImage: new Image(),
	player: new Image(),
	crosshair: new Image(),
	pointer: new Image(),
	projectiles: new Image(),
	music: {
		bravePilots: new Audio('./assets/music/Brave Pilots.ogg'),
		withoutFear: new Audio('./assets/music/Without Fear.ogg'),
	},
	sfx: {
		gun1: new Audio('./assets/sfx/gun1.mp3'),
		gun2: new Audio('./assets/sfx/gun2.mp3'),
	},
	enemyT1: new Image(),
	enemyT2: new Image(),
	enemyT3: new Image(),
};

// assets sources:
asset.backgroundImage.src = './assets/background/background.png';
asset.player.src = './assets/ships/ship.png';
asset.crosshair.src = './assets/crosshair.png';
asset.pointer.src = './assets/pointer.png';
asset.projectiles.src = './assets/ships/projectiles.png';

asset.music.bravePilots.loop = true;
asset.music.bravePilots.volume = 0.5;
asset.music.withoutFear.loop = true;

asset.sfx.gun1.volume = 0.25;
asset.sfx.gun2.volume = 0.8;

asset.enemyT1.src = './assets/ships/enemy-small.png';
asset.enemyT2.src = './assets/ships/enemy-medium.png';
asset.enemyT3.src = './assets/ships/enemy-big.png';

// load them
let totalNbImgs = Object.keys(asset).length;

Object.entries(asset).forEach(([, multimedia]) => {
	function checkKickstart() {
		if (--totalNbImgs <= 0) {
			console.log(asset);
			return asset;
		}
	}
	if (typeof multimedia !== typeof {}) multimedia.onload = () => checkKickstart();
	else checkKickstart();
});

// virtual rotating channels (for fun sfx)

class Channel {
	constructor(uri, volume) {
		this.sfx = new Audio(uri);
		this.sfx.volume = volume;
	}
	play() {
		this.sfx.currentTime = 0;
		this.sfx.play();
	}
}

class RotatingSfxChannel {
	constructor(uri, max, volume) {
		this.channels = [];
		this.max = max;
		this.playIndex = 0;

		for (let i = 0; i < max; i++) {
			this.channels.push(new Channel(uri, volume));
		}
	}

	play() {
		this.channels[this.playIndex++].play();
		this.playIndex = this.playIndex < this.max ? this.playIndex : 0;
	}
}

let rotatingAsset = {
	gun1: new RotatingSfxChannel('./assets/sfx/gun1.mp3', 40, 0.35),
	gun2: new RotatingSfxChannel('./assets/sfx/gun2.mp3', 5, 0.6),
};

export { asset, rotatingAsset };
