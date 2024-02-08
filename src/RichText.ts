import { Container, Text, Sprite, Assets } from 'pixi.js';

enum TokenType
{
	Text,
	Image
}

export default class RichText extends Container
{
	private static readonly DEFAULT_FONT_SIZE = 24;
	private static readonly DEFAULT_FONT_COLOR = 0x000000;
	private static readonly IMAGE_SCALE_FACTOR = 1.2;

	private originalText: string;
	private _fontSize: number;
	private _fontColor: number;

	public constructor(text: string = '', fontSize = RichText.DEFAULT_FONT_SIZE, fontColor = RichText.DEFAULT_FONT_COLOR)
	{
		super();

		this._fontSize = fontSize;
		this._fontColor = fontColor;
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
		this.buildContents();
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

	get fontColor(): number
	{
		return this._fontColor;
	}

	set fontColor(value: number)
	{
		this._fontColor = value;
		this.text = this.originalText; // To rebuild contents.
	}

	private buildContents()
	{
		this.removeChildren();

		let width = 0;
		const height = this._fontSize * RichText.IMAGE_SCALE_FACTOR;

		let currentTokenType = TokenType.Text;
		let lastColonIndex = 0, currentColonIndex = 0;
		let x = 0;
		while (currentColonIndex != this.originalText.length)
		{
			currentColonIndex = this.originalText.indexOf(':', lastColonIndex);
			if (currentColonIndex == -1)
			{
				currentColonIndex = this.originalText.length;
			}
			const substr = this.originalText.substring(lastColonIndex, currentColonIndex);
			switch (currentTokenType)
			{
				case TokenType.Text:
					const text = new Text(substr, { fontFamily: 'Arial', fontSize: this._fontSize, fill: this._fontColor });
					text.anchor.set(0, 0.5);
					text.x = x;
					this.addChild(text);
					
					x += text.width;
					width += text.width;

					currentTokenType = TokenType.Image;
					break;
				case TokenType.Image:
					const texture = Assets.get(substr);
					if (texture)
					{
						const image = Sprite.from(texture);
						image.anchor.set(0, 0.5);
						image.scale.set(height / image.height);
						image.x = x;
						this.addChild(image);
					
						x += image.width;
						width += image.width;
					}
					currentTokenType = TokenType.Text;
					break;
			}

			lastColonIndex = currentColonIndex + 1;
		}

		this.width = width;
		this.height = height;
	}
}
