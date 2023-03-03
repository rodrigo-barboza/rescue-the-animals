import Player from './entities/player.js';
import Platform from './entities/platform.js';
import Animal from './entities/animal.js';
import Bird from './entities/bird.js';

import { 
	canvas, 
	context,
	keys,
	menu,
	game,
	sounds,
	buttons,
	getRandomNumber,
	getPositions,
} from './utils/index.js';

const ANIMAL_SHAMT = 50;
const PLAYER_VELOCITY = 5;
const JUMP_SIZE = 15;

let player = {};
let platforms = [];
let animals = [];
let birds = [];
let pause = {};
let gameReset = false;
let min = 0;
let sec = 0;
let lives = 3;
let gameOver = false;
let victory = false;

game.style.display = 'none';

buttons.forEach(({ name, selector }) => {
	const menu = document.querySelector('.menu');
	const instructions = document.querySelector('.instructions');
	const about = document.querySelector('.about');

	selector.addEventListener('mouseover', () => {
		selector.src = `assets/images/menu/${name}-button-hover.png`;
		sounds.menuSelect.autoplay = true;
		sounds.menuSelect.play();
	});
	selector.addEventListener('mouseout', () => {
		selector.src = `assets/images/menu/${name}-button.png`;
	});

	if (name === 'play') {
		selector.addEventListener('click', () => {
			playGame();
		});
	}
	if (name === 'instructions') {
		selector.addEventListener('click', () => {
			menu.style.display = 'none';
			instructions.style.display = 'flex';
			about.style.display = 'none';
			document.querySelector('.instructions-menu-button').addEventListener('click', () => {
				window.location.reload();
			});
		});
	}
	if (name === 'about') {
		selector.addEventListener('click', () => {
			menu.style.display = 'none';
			instructions.style.display = 'none';
			about.style.display = 'flex';
			document.querySelector('.about-menu-button').addEventListener('click', () => {
				window.location.reload();
			});
		});
	}
});

document.querySelector('.pause-button').addEventListener('click', () => pauseGame(true));
document.querySelector('.menu-button').addEventListener('click', () => window.location.reload());

document.addEventListener("keydown", (event) => {
	if (event.key === 'p') {
		pauseGame(true);
	}

	if (event.key === 'Enter' && pause.state && !gameOver) {
		pauseGame(false);
	}

	if (event.key === 'Enter' && gameOver) {
		let gameOverContainer = document.querySelector('.game-over-window');
		gameOverContainer.style.display = 'none';
		gameOver = false;
		playGame();
	}

	if (event.key === 'Enter' && victory) {
		window.location.reload();
	}

	if (!pause.state) {
		if (event.key === 'ArrowLeft' 
			&& player.position.x >= 0
		) {
			keys.left.pressed = true;
		}

		if (event.key === 'ArrowRight') {
			keys.right.pressed = true;
		}

		if (event.key === 'ArrowUp' 
			&& !keys.jump.pressed
		) {
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

const playGame = () => {
	player = {};
	platforms = [];
	animals = [];
	birds = [];
	pause = {};
	gameReset = false;
	min = 0;
	sec = 0;
	lives = 3;
	gameOver = false;

	menu.style.display = 'none';
	game.style.display = 'block';
	sounds.stageOne.muted = false;

	player = new Player();
	
	let iterations = getRandomNumber(3, 4);

	for (let count = 0; count < iterations; count++) {
		let [widthFactor, heightFactor, velocity] = getPositions();
		birds.push(
			new Bird({ 
				x: canvas.width * widthFactor, 
				y: canvas.height * heightFactor,
				velocity: velocity,
			})
		);
	}

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

const animate = () => {
	if (pause.state || gameReset) {
		cancelAnimationFrame(animate);
	} else {
		requestAnimationFrame(animate);
		context.clearRect(0, 0, canvas.width, canvas.height);
		sounds.stageOne.play();
	
		player.update();
		platforms.forEach(platform => platform.draw());
		animals.forEach(animal => animal.draw());
		birds.forEach(bird => bird.draw());
	
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
		
		setTimeout(() => {
			birds.some(bird => {
				verifyColision(bird);
			});
		}, 1000);

		animals.some(animal => {
			if (player.position.y + player.height <= animal.position.y &&
				player.position.y + player.height + player.velocity.y > animal.position.y &&
				player.position.x + player.width >= animal.position.x &&
				player.position.x <= animal.position.x + animal.width) {
				if (animal.state === 'stuck') {
					animalSaved(animal);
				}
			}
		});
	}
}

const animalSaved = (animal) => {
	sounds.rescuedAnimal.play();
	animal.state = 'free';
	if (animals.every(animal => animal.state === 'free')) {
		showVictoryContainer();
	}
}

const time = () => {
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

const setTime = (min, sec) => {
	let time = document.querySelector('.time');
	time.innerHTML = `${min}:${sec}`;
}

const createHeart = () => {
	let heart = document.querySelector('#heart').cloneNode(true);
	heart.src = 'assets/images/menu/filled-heart.png';
	heart.classList.add('heart');
	return heart;
}

const addHearts = (amount) => {
	let heartContainer = document.querySelector('.hearts');
	heartContainer.innerHTML = '';

	for (let c = 0; c < amount; c++) {
		heartContainer.append(createHeart());
	}
}

const resetPlayerPosition = () => {
	player.position.x = 0;
	player.position.y = 0;
}

const playerFail = () => {
	if (lives) {
		lives = lives - 1;
		addHearts(lives);
		resetPlayerPosition();
	} else {
		showGameOverContainer();
	}
}

const showPauseContainer = () => {
	let pauseContainer = document.querySelector('.pause-window');
	pauseContainer.style.display = pause.state ? 'flex' : 'none';
}

const showGameOverContainer = () => {
	let gameOverContainer = document.querySelector('.game-over-window');
	pause.state = true;
	gameOver = true;
	gameOverContainer.style.display = gameOver ? 'flex' : 'none';
}

const showVictoryContainer = () => {
	let victoryContainer = document.querySelector('.victory-window');
	pause.state = true;
	victory = true;
	victoryContainer.style.display = victory ? 'flex' : 'none';
}

const pauseGame = (state) => {
	pause.state = state;
	showPauseContainer();
	if (!state) {
		animate();
	}
}

const backToMenu = () => {
	menu.style.display = 'block';
	game.style.display = 'none';
	gameReset = true;
	min = 0; sec = 0;
	sounds.stageOne.muted = true;
	resetPlayerPosition();
}

const verifyColision = (bird) => {

	if (player.position.x + player.width >= bird.position.x &&
		player.position.x + player.width <= bird.position.x + bird.width &&
		player.position.y + player.height >= bird.position.y &&
		player.position.y + player.height <= bird.position.y + bird.height
	) 
	{
		playerFail();
		sounds.playerFail.play();
	}
}
