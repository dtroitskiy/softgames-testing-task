import { Container, Text, Sprite } from 'pixi.js';

export default class RichText extends Container
{
	private static readonly DEFAULT_FONT_SIZE = 24;

	private originalText: string;
	private _fontSize: number;

	private _text: Text; // TODO: for testing.

	public constructor(text: string = '', fontSize: number = RichText.DEFAULT_FONT_SIZE)
	{
		super();

		this._fontSize = fontSize;
		if (text.length > 0)
		{
			this.text = text;
		}
	}

	get text(): string
	{
		return this.originalText;
	}

	set text(value: string)
	{
		this.originalText = value;
		// TODO: for testing.
		if (this._text)
		{
			this._text.removeFromParent();
		}
		this._text = new Text(value, { fontSize: this._fontSize, fill: 0x000000 });
		this._text.anchor.set(0.5, 0.5);
		this.addChild(this._text);
	}

	get fontSize(): number
	{
		return this._fontSize;
	}

	set fontSize(value: number)
	{
		this._fontSize = value;
		this.text = this.originalText; // To rebuild contents.
	}
}
