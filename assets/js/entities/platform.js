import { context } from '../utils/index.js';

const PLATFORM_WIDTH = 270;
const PLATFORM_HEIGTH = 75;
const PLATFORM_SHAMT = 5;

export default class Platform {
	constructor({ x, y }) {
		this.position = { x, y };
		this.width = PLATFORM_WIDTH;
		this.height = PLATFORM_HEIGTH;
		this.image = this.createPlayground();
	}

	draw() {
		context.drawImage(
			this.image,
			this.position.x,
			this.position.y - PLATFORM_SHAMT,
		);
	}

	createPlayground() {
		let playground = new Image();
		playground.src = 'assets/images/playground.png';

		return playground;
	}
}