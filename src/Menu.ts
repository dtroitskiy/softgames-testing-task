import { Graphics, Text } from 'pixi.js';
import { FancyButton } from '@pixi/ui';

import Scene from './Scene';

type OnButtonClickedCallback = (buttonID: string) => void;

export default class Menu extends Scene
{
	private static readonly BUTTON_BACKGROUND_COLOR = 0x00A2C2;
	private static readonly BUTTON_LABEL_COLOR = 0xFFFFFF;
	private static readonly BUTTON_SIZE_FACTORS = { width: 0.3, height: 0.08 };
	private static readonly BUTTON_V_SPACING_FACTOR = 0.03;
	private static readonly BUTTON_CORNER_RADIUS_FACTOR = 0.015;
	private static readonly BUTTON_LABEL_FONT_SIZE_FACTOR = 0.04;
	private static readonly BUTTON_SCALE_UP_FACTOR = 1.05;
	private static readonly BUTTON_SCALE_DOWN_FACTOR = 0.95;
	private static readonly BUTTON_SCALE_DURATION = 100;
	private static readonly BUTTON_CONFIGS = [
		{ id: 'cards', label: 'CARDS' },
		{ id: 'text', label: 'TEXT' },
		{ id: 'particles', label: 'PARTICLES' }
	];

	private buttonClickedHandlers: OnButtonClickedCallback[] = [];

	public constructor()
	{
		super();
	}

	public resize(width: number, height: number)
	{
		this.removeChildren();

		const minSize = Math.min(width, height);
		const buttonWidth = minSize * Menu.BUTTON_SIZE_FACTORS.width;
		const buttonHeight = minSize * Menu.BUTTON_SIZE_FACTORS.height;
		const buttonVSpacing = minSize * Menu.BUTTON_V_SPACING_FACTOR;
		const buttonCornerRadius = minSize * Menu.BUTTON_CORNER_RADIUS_FACTOR;
		const buttonLabelFontSize = minSize * Menu.BUTTON_LABEL_FONT_SIZE_FACTOR;
		let buttonX = width * 0.5;
		let buttonY = (height - (buttonHeight + buttonVSpacing) * Menu.BUTTON_CONFIGS.length - buttonVSpacing) * 0.5;
		
		for (const buttonConfig of Menu.BUTTON_CONFIGS)
		{
			const button = new FancyButton({
					defaultView: new Graphics()
						.beginFill(Menu.BUTTON_BACKGROUND_COLOR)
						.drawRoundedRect(0, 0, buttonWidth, buttonHeight, buttonCornerRadius)
						.endFill(),
					text: new Text(buttonConfig.label, {
						fontFamily: 'Arial',
						fontSize: buttonLabelFontSize,
						fill: Menu.BUTTON_LABEL_COLOR
					}),
					animations: {
						hover: {
							props: {
								scale: {
									x: Menu.BUTTON_SCALE_UP_FACTOR,
									y: Menu.BUTTON_SCALE_UP_FACTOR,
								}
							},
							duration: Menu.BUTTON_SCALE_DURATION,
					},
						pressed: {
							props: {
								scale: {
									x: Menu.BUTTON_SCALE_DOWN_FACTOR,
									y: Menu.BUTTON_SCALE_DOWN_FACTOR,
								}
							},
							duration: Menu.BUTTON_SCALE_DURATION,
						}
					}
			});
			button.x = buttonX;
			button.y = buttonY;
			button.anchor.set(0.5, 0);

			button.onUp.connect(() =>
			{
				for (const handler of this.buttonClickedHandlers)
				{
					handler(buttonConfig.id);
				}
			});

			this.addChild(button);

			buttonY += buttonHeight + buttonVSpacing;
		}
	}

	public addButtonClickedHandler(handler: OnButtonClickedCallback)
	{
		this.buttonClickedHandlers.push(handler);
	}

	public removeButtonClickedHandler(handler: OnButtonClickedCallback)
	{
		const index = this.buttonClickedHandlers.indexOf(handler);
		if (index !== -1)
		{
			this.buttonClickedHandlers.splice(index, 1);
		}
	}
}
