import { context } from '../utils/index.js';
import { animalImage } from '../utils/constants/bagConstants.js';

const ANIMAL_WIDTH = 50;
const ANIMAL_HEIGHT = 45;
const ANIMAL_STUCK = 'stuck';

export default class Animal {
	constructor({ x, y, animal }) {
		this.position = { x, y };
		this.width = ANIMAL_WIDTH;
		this.height = ANIMAL_HEIGHT;
		this.state = ANIMAL_STUCK;
		this.currentFrame = 0;
		this.animals = {
			free: animalImage(animal),
		};
	}

	draw() {
		if (this.currentFrame <= this.animals.free.length - 1) {
			context.drawImage(
				this.createImage(this.animals.free[this.currentFrame]),
				this.position.x,
				this.position.y,
			);
			if (this.state === ANIMAL_STUCK) {
				context.drawImage(
					this.createImage('assets/images/animals/animal_stuck.png'),
					this.position.x,
					this.position.y,
				);
			}			
			this.currentFrame = this.currentFrame + 1;
		} else {
			this.currentFrame = 0;
		}
	}

	createImage(src) {
		let image = new Image();
		image.src = src;

		return image;
	}
}