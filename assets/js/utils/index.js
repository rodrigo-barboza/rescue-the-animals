
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = document.querySelector('.game-background').offsetHeight;

const gravity = 1;

const keys = {
	right: {
		pressed: false
	},

	left: {
		pressed: false
	}
};

export {
	canvas,
	context,
	gravity,
	keys,
};