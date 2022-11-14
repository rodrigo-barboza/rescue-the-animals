import Player from './entities/player.js';
import Platform from './entities/platform.js';
import Animal from './entities/animal.js';

import { canvas, context, keys } from './utils/index.js';

const sounds = {
	stageOne: new Audio('assets/sounds/stage_select_1.wav'),
	playerJump: new Audio('assets/sounds/slime_jump.wav'),
	rescuedAnimal: new Audio('assets/sounds/select.wav'),
	menuSelect: new Audio('assets/sounds/key_1.wav'),
};

const menu = document.querySelector('#main-menu');
const game = document.querySelector('#playground');

game.style.display = 'none';

const buttons = [
	{
		name: 'play',
		selector: document.querySelector('.btn-play img')
	},
	{
		name: 'instructions',
		selector: document.querySelector('.btn-instructions img')
	},
	{
		name: 'about',
		selector: document.querySelector('.btn-about img')
	}
];

buttons.forEach(({ name, selector }) => {
	selector.addEventListener('mouseover', () => {
		selector.src = `assets/images/menu/${name}-button-hover.png`;
		sounds.menuSelect.autoplay = true;
		sounds.menuSelect.play();
	});
	selector.addEventListener('mouseout', () => {
		selector.src = `assets/images/menu/${name}-button.png`;
	});
	selector.addEventListener('click', () => {
		menu.style.display = 'none';
		game.style.display = 'block';
		animate();
	});
});

// only game

const ANIMAL_SHAMT = 50;
const PLAYER_VELOCITY = 5;

const animalType = ['a', 'a'];

const player = new Player();
const platforms = [
	new Platform({ x: 100, y: 500 }),
	new Platform({ x: 300, y: 300 }),
	new Platform({ x: 650, y: 400 }),
	new Platform({ x: 900, y: 550 }),
];

let animals = [];

platforms.forEach(platform => {
	animals.push(
		new Animal({
			x: platform.position.x + ANIMAL_SHAMT,
			y: platform.position.y - ANIMAL_SHAMT,
			animal: 'a'
		})
	);
});

document.addEventListener("keydown", (event) => {
	if (event.key === "ArrowLeft" && player.position.x >= 0) {
		keys.left.pressed = true;
	}
	if (event.key === "ArrowRight") {
		keys.right.pressed = true;
	}
	if (event.key === "ArrowUp") {
		player.velocity.y -= 13;
	}
});

document.addEventListener("keyup", (event) => {
	if (event.key === "ArrowLeft") {
		keys.left.pressed = false;
	}
	if (event.key === "ArrowRight") {
		keys.right.pressed = false;
	}
	if (event.key === "ArrowUp") {
		sounds.playerJump.play();
		player.velocity.y = -13;
	}
});


function animate() {
	requestAnimationFrame(animate);
	context.clearRect(0, 0, canvas.width, canvas.height);
	sounds.stageOne.play();

	player.update();
	platforms.forEach(platform => platform.draw());
	animals.forEach(animal => animal.draw());

	if (keys.right.pressed && player.position.x < canvas.width - 50) {
		player.velocity.x = PLAYER_VELOCITY;
		player.move = 'right';
	} else if (keys.left.pressed && player.position.x > 0) {
		player.velocity.x = -PLAYER_VELOCITY;
		player.move = 'left';
	} else {
		player.velocity.x = 0;
		player.move = 'stop';
	}

	platforms.some(platform => {
		if (player.position.y + player.height <= platform.position.y &&
			player.position.y + player.height + player.velocity.y > platform.position.y &&
			player.position.x + player.width >= platform.position.x &&
			player.position.x <= platform.position.x + platform.width) {
			player.velocity.y = 0;
		}
	});

	animals.some(animal => {
		if (player.position.y + player.height <= animal.position.y &&
			player.position.y + player.height + player.velocity.y > animal.position.y &&
			player.position.x + player.width >= animal.position.x &&
			player.position.x <= animal.position.x + animal.width) {
			if (animal.state === 'stuck') {
				sounds.rescuedAnimal.play();
				animal.state = 'free';	
			}
		}
	});
}
