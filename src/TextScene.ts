import { Ticker } from 'pixi.js';

import Scene from './Scene';
import RichText from './RichText';

export default class TextScene extends Scene
{
	private static readonly TEXT_UPDATE_INTERVAL = 2000;
	private static readonly MAX_COINS = 1000;
	private static readonly FONT_SIZE_MIN = 32;
	private static readonly FONT_SIZE_MAX = 64;
	private static readonly FONT_SIZE_FACTOR = 0.001;

	private richText: RichText;
	private randomFontSize: number;
	private textUpdateTime = 0;
	private lastWidth = 0;
	private lastHeight = 0;

	public constructor()
	{
		super();

		this.richText = new RichText();
		this.addChild(this.richText);

		Ticker.shared.add(this.update, this);

		this.refreshText();
	}

	private update(delta: number)
	{
		this.textUpdateTime += Ticker.shared.deltaMS;
		if (this.textUpdateTime > TextScene.TEXT_UPDATE_INTERVAL)
		{
			this.refreshText();
		}
	}

	private refreshText()
	{
		this.textUpdateTime = 0;
		const coins = Math.round(Math.random() * TextScene.MAX_COINS);
		this.richText.text = `You have ${coins}:Coin: in your :PiggyBank:`;
		this.randomFontSize = TextScene.FONT_SIZE_MIN + Math.random() * (TextScene.FONT_SIZE_MAX - TextScene.FONT_SIZE_MIN);
		this.resize(this.lastWidth, this.lastHeight);
	}

	public resize(width: number, height: number)
	{
		const minSize = Math.min(width, height);
		this.richText.fontSize = this.randomFontSize * minSize * TextScene.FONT_SIZE_FACTOR;
		this.richText.x = width * 0.5;
		this.richText.y = height * 0.5;
		this.richText.pivot.set(this.richText.width * 0.5, this.richText.height * 0.5);

		this.lastWidth = width;
		this.lastHeight = height;
	}
}
