import { Container, Graphics } from 'pixi.js';

export default class Button extends Container
{
	static readonly BACKGROUND_COLOR = 0x00A2C2;
	static readonly CORNER_RADIUS = 10; 
	// private background: Graphics;

	public constructor(width, height, label)
	{
		super();

		const background = new Graphics();
		background.beginFill(Button.BACKGROUND_COLOR);
		background.drawRoundedRect(0, 0, width, height, Button.CORNER_RADIUS);
		background.endFill();
		this.addChild(background);
		
		
	}
}
