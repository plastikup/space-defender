let asset = {
	backgroundImage: new Image(),
	player: new Image(),
	crosshair: new Image(),
	pointer: new Image(),
	projectiles: new Image(),
	music: {
		bravePilots: new Audio('./assets/music/Brave Pilots.ogg'),
		withoutFear: new Audio('./assets/music/Without Fear.ogg'),
		non_stop: new Audio('./assets/music/ncs_tracks/non_stop.mp3'),
		savage: new Audio('./assets/music/ncs_tracks/savage.mp3'),
		apocalypse: new Audio('./assets/music/ncs_tracks/apocalypse.mp3'),
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

asset.music.non_stop.loop = true;
asset.music.non_stop.volume = 0.25;
asset.music.savage.loop = true;
asset.music.savage.volume = 0.2;
asset.music.apocalypse.loop = true;
asset.music.apocalypse.volume = 0.25;

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
