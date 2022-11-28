import { context, canvas } from '../utils/index.js';
import { birdImage } from '../utils/constants/bagConstants.js';

const BIRD_WIDTH = 50;
const BIRD_HEIGHT = 45;
const BIRD_SPEED = 5;

export default class Bird {
	constructor({ x, y, velocity }) {
		this.position = { x, y };
		this.width = BIRD_WIDTH;
		this.height = BIRD_HEIGHT;
        this.move = 'left';
		this.currentFrame = 0;
        this.velocity = velocity;
		this.images = {
			left: birdImage('left'),
            right: birdImage('right'),
		};
	}

	draw() {
        if (this.currentFrame <= this.images.left.length - 1) {
            context.drawImage(
                this.createImage(this.images[this.move][this.currentFrame]),
                this.position.x,
                this.position.y,
            );
            this.currentFrame = this.currentFrame + 1;
        } else {
            this.currentFrame = 0;
        }

        this.moving();
	}

    moving() {
        if (this.move === 'right') {
            if (this.position.x < canvas.width - 50) {
                this.position.x = this.position.x + this.velocity;
            } else {
                this.move = 'left';
            }
        } else if (this.move === 'left') {
            if (this.position.x > 0) {
                this.position.x = this.position.x - this.velocity;
            } else {
                this.move = 'right';
            }
        }
    }

	createImage(src) {
		let image = new Image();
		image.src = src;

		return image;
	}
}