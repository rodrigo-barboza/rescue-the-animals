import { canvas, context, gravity } from '../utils/index.js';
import { playerImage } from '../utils/constants/bagConstants.js';

const PLAYER_INITIAL_POSITION_X = 100;
const PLAYER_INITIAL_POSITION_Y = 100;
const PLAYER_INITIAL_VELOCITY_X = 0;
const PLAYER_INITIAL_VELOCITY_Y = 0;
const PLAYER_WIDTH = 48;
const PLAYER_HEIGHT = 60;
const PLAYER_STOPPED = 'stop';

export default class Player {

	constructor() {
		this.position = { 
			x: PLAYER_INITIAL_POSITION_X, 
			y: PLAYER_INITIAL_POSITION_Y 
		};
		this.velocity = { 
			x: PLAYER_INITIAL_VELOCITY_X, 
			y: PLAYER_INITIAL_VELOCITY_Y 
		};
		this.width = PLAYER_WIDTH;
		this.height = PLAYER_HEIGHT;
		this.move = PLAYER_STOPPED;
		this.currentFrame = 0;
		this.image = {
			stop: 'assets/images/player/stop.png',
			right: playerImage('right'),
			left: playerImage('left'),
		};
	}

	draw() {
		if (this.move != PLAYER_STOPPED) {
			if (this.currentFrame <= this.image.right.length - 1) {
				context.drawImage(
					this.createImage(this.image[this.move][this.currentFrame]),
					this.position.x,
					this.position.y,
				);
				this.currentFrame = this.currentFrame + 1;
			} else {
				this.currentFrame = 0;
			}
		} else {
			context.drawImage(
				this.createImage(this.image[this.move]),
				this.position.x,
				this.position.y,
			);
		}
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
		
		if (this.position.y + this.height + this.velocity.y <= canvas.height) {
			this.velocity.y += gravity;
		} else {
			this.velocity.y = 0;
		}
	}

	createImage(src) {
		let image = new Image();
		image.src = src;

		return image;
	}
}
