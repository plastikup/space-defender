let asset = {
	backgroundImage: new Image(),
	player: new Image(),
	crosshair: new Image(),
	projectiles: new Image(),
	music: {
		bravePilots: new Audio('./assets/music/Brave Pilots.ogg'),
		withoutFear: new Audio('./assets/music/Without Fear.ogg'),
	},
	enemyT1: new Image(),
    enemyT2: new Image(),
    enemyT3: new Image(),
};

// assets sources:
asset.backgroundImage.src = './assets/background/background.png';
asset.player.src = './assets/ships/ship.png';
asset.crosshair.src = './assets/crosshair.png';
asset.projectiles.src = './assets/ships/projectiles.png';

asset.music.bravePilots.loop = true;
asset.music.withoutFear.loop = true;

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

export { asset };
