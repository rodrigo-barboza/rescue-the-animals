
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = document.querySelector('.game-background').offsetWidth;
canvas.height = document.querySelector('.game-background').offsetHeight;

const gravity = 1;

const keys = {
	right: {
		pressed: false
	},

	left: {
		pressed: false
	},

	jump: {
		pressed: false,
	},
};

export {
	canvas,
	context,
	gravity,
	keys,
};