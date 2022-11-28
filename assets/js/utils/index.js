
const menu = document.querySelector('#main-menu');
const game = document.querySelector('#playground');
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const gravity = 1;

const keys = {
	right: { pressed: false },
	left:  { pressed: false },
	jump:  { pressed: false },
};

const sounds = {
	stageOne: new Audio('assets/sounds/stage_select_1.wav'),
	playerJump: new Audio('assets/sounds/slime_jump.wav'),
	rescuedAnimal: new Audio('assets/sounds/select.wav'),
	menuSelect: new Audio('assets/sounds/menu_collect.ogg'),
	playerFail: new Audio('assets/sounds/fail.wav'),
};

const buttons = [
	{ name: 'play',	selector: document.querySelector('.btn-play img') },
	{ name: 'instructions',	selector: document.querySelector('.btn-instructions img') },
	{ name: 'about', selector: document.querySelector('.btn-about img')	}
];

canvas.width = document.querySelector('.game-background').offsetWidth;
canvas.height = document.querySelector('.game-background').offsetHeight;

const getRandomNumber = (min, max) => {
	return Math.floor(Math.random() * (max - min) + min);
}

const getPositions = () => {
	const positions = [
		{ widthFactor: .95, heightFactor: .25, velocity: 4 },
		{ widthFactor: .02, heightFactor: .50, velocity: 2 },
		{ widthFactor: .95, heightFactor: .75, velocity: 3 },
		{ widthFactor: .02, heightFactor: .45, velocity: 4 },
		{ widthFactor: .95, heightFactor: .35, velocity: 5 },
		{ widthFactor: .02, heightFactor: .25, velocity: 3 },
	];

	let positionA = getRandomNumber(0, positions.length - 1);
	positions.splice(positionA, 1);
	let positionB = getRandomNumber(0, positions.length - 1);

	return [
		positions[positionA].widthFactor,
		positions[positionB].heightFactor,
		positions[positionA].velocity
	];
};

export {
	canvas,
	context,
	gravity,
	keys,
	menu,
	game,
	sounds,
	buttons,
	getRandomNumber,
	getPositions,
};
