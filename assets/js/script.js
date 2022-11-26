import Player from './entities/player.js';
import Platform from './entities/platform.js';
import Animal from './entities/animal.js';

import { canvas, context, keys } from './utils/index.js';

const sounds = {
	stageOne: new Audio('assets/sounds/stage_select_1.wav'),
	playerJump: new Audio('assets/sounds/slime_jump.wav'),
	rescuedAnimal: new Audio('assets/sounds/select.wav'),
	menuSelect: new Audio('assets/sounds/menu_collect.ogg'),
};

const menu = document.querySelector('#main-menu');
const game = document.querySelector('#playground');

let gameReset = false;
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

let lives = 0;

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
		playGame();
	});
});

// only game

const ANIMAL_SHAMT = 50;
const PLAYER_VELOCITY = 5;
const JUMP_SIZE = 15;
const animalType = ['a', 'a'];

let player = {};
let platforms = [];
let animals = [];
let pause = {};
let min = 0;
let sec = 0;

document.addEventListener("keydown", (event) => {
	if (event.key === 'p') {
		pauseGame(true);
	}

	if (event.key === 'Enter' && pause.state) {
		pauseGame(false);
	}

	if (!pause.state) {
		if (event.key === 'ArrowLeft' && player.position.x >= 0) {
			keys.left.pressed = true;
		}
		if (event.key === 'ArrowRight') {
			keys.right.pressed = true;
		}
		if (event.key === 'ArrowUp' && !keys.jump.pressed) {
			sounds.playerJump.play();
			player.velocity.y -= JUMP_SIZE;
			keys.jump.pressed = true;
		}
	}
});

document.addEventListener("keyup", (event) => {
	if (event.key === 'ArrowLeft') {
		keys.left.pressed = false;
	}
	if (event.key === 'ArrowRight') {
		keys.right.pressed = false;
	}
	
	if (event.key === 'ArrowUp') {
		keys.jump.pressed = false;
	}
});


document.querySelector('.pause-button').addEventListener('click', () => pauseGame(true));
document.querySelector('.menu-button').addEventListener('click', () => {
	menu.style.display = 'block';
	game.style.display = 'none';
	gameReset = true;
	min = 0; sec = 0;
	sounds.stageOne.muted = true;
	resetPlayerPosition();
});

function playGame() {
	menu.style.display = 'none';
	game.style.display = 'block';
	sounds.stageOne.muted = false;
	gameReset = false;
	lives = 3;

	player = new Player();

	platforms = [
		new Platform({ x: canvas.width * .15, y: canvas.height * .55 }),
		new Platform({ x: canvas.width * .40, y: canvas.height * .80 }),
		new Platform({ x: canvas.width * .75, y: canvas.height * .40 }),
		new Platform({ x: canvas.width * .50, y: canvas.height * .50 }),
	];
	
	pause = {
		state: false,
		time: {
			min: 0,
			sec: 0,
		},
	};
	
	platforms.forEach(platform => {
		animals.push(
			new Animal({
				x: platform.position.x + ANIMAL_SHAMT,
				y: platform.position.y - ANIMAL_SHAMT,
				animal: 'a'
			})
		);
	});	

	animate();
	addHearts(lives);
	time();
}


function animate() {
	if (pause.state || gameReset) {
		cancelAnimationFrame(animate);
	} else {
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
					animalSaved(animal);
					playerFail();
				}
			}
		});
	}
}

function animalSaved(animal) {
	sounds.rescuedAnimal.play();
	animal.state = 'free';
}

function time(reset) {
	const minInterval = setInterval(() => {
		if (!pause.state) {
			if (min < 60) {
				min = min + 1;
			} else {
				min = min + 1;
			}
		}
	}, 60000);

	const secInterval = setInterval(() => {
		if (!pause.state) {
			if (sec < 59) {
				sec = sec + 1;
			} else {
				sec = 0;
			}

			pause.time = { min, sec };
			setTime(("00" + min).slice(-2), ("00" + sec).slice(-2));
		}
	}, 1000);
}

function setTime(min, sec) {
	let time = document.querySelector('.time');
	time.innerHTML = `${min}:${sec}`;
}

function createHeart() {
	let heart = document.querySelector('#heart').cloneNode(true);
	heart.src = 'assets/images/menu/filled-heart.png';
	heart.classList.add('heart');
	return heart;
}

function addHearts(amount) {
	let heartContainer = document.querySelector('.hearts');
	heartContainer.innerHTML = '';

	for (let c = 0; c < amount; c++) {
		heartContainer.append(createHeart());
	}
}

function resetPlayerPosition() {
	player.position.x = 0;
	player.position.y = 0;
}

function playerFail() {
	lives = lives - 1;
	addHearts(lives);
	resetPlayerPosition();
}

function showPauseContainer() {
	let pauseContainer = document.querySelector('.pause-window');
	pauseContainer.style.display = pause.state ? 'flex' : 'none';
}

function pauseGame(state) {
	pause.state = state;
	showPauseContainer();
	if (!state) {
		animate();
	}
}