import { Container, Text, Ticker } from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';

import Scene from './Scene';
import Card from './Card';

export default class Cards extends Scene
{
	private static readonly CARDS_COUNT = 144;
	private static readonly CARD_WIDTH_FACTOR = 0.18;
	private static readonly LEFT_STACK_X_FACTOR = 0.25;
	private static readonly RIGHT_STACK_X_FACTOR = 0.75;
	private static readonly CARD_OFFSET_IN_STACK = 1;
	private static readonly CARD_MOVE_TIME = 2000;

	private leftStack: Container;
	private rightStack: Container;
	private leftStackTopCoords = { x: 0, y: 0 };
	private rightStackTopCoords = { x: 0, y: 0 };
	private movedCard: Card;
	private movedCardIndex: number = Cards.CARDS_COUNT - 1;
	private movedCardTween: TWEEN.Tween<any>;

	public constructor()
	{
		super();

		this.leftStack = new Container();
		this.addChild(this.leftStack);
		this.rightStack = new Container();
		this.addChild(this.rightStack);

		for (let i = 0; i < Cards.CARDS_COUNT; i++)
		{
			const card = new Card(`Card ${i + 1}`);
			this.leftStack.addChild(card);
		}

		Ticker.shared.add(this.update, this);
	}

	private update(delta: number)
	{
		if (this.movedCardTween && this.movedCardTween.isPlaying())
		{
			TWEEN.update();
			return;
		}

		if (this.movedCardIndex >= 0)
		{
			this.movedCard = this.leftStack.getChildAt(this.movedCardIndex) as Card;
			this.movedCard.x += this.movedCard.parent.x;
			this.movedCard.y += this.movedCard.parent.y;
			this.movedCard.removeFromParent();
			this.addChild(this.movedCard);

			this.movedCardTween = new TWEEN.Tween(this.movedCard)
				.to({
					x: this.rightStack.x + this.rightStackTopCoords.x,
					y: this.rightStack.y + this.rightStackTopCoords.y
				}, Cards.CARD_MOVE_TIME)
				.easing(TWEEN.Easing.Quadratic.InOut)
				.onComplete(() =>
				{
					this.movedCard.x = this.rightStackTopCoords.x;
					this.movedCard.y = this.rightStackTopCoords.y;
					this.movedCard.removeFromParent();
					this.rightStack.addChild(this.movedCard);
					
					this.leftStackTopCoords.x += Cards.CARD_OFFSET_IN_STACK;
					this.leftStackTopCoords.y += Cards.CARD_OFFSET_IN_STACK;
					this.rightStackTopCoords.x -= Cards.CARD_OFFSET_IN_STACK;
					this.rightStackTopCoords.y -= Cards.CARD_OFFSET_IN_STACK;
				})
				.start();

			--this.movedCardIndex;

			return;
		}

		Ticker.shared.remove(this.update, this);
	}

	public resize(width: number, height: number)
	{
		this.leftStack.x = width * Cards.LEFT_STACK_X_FACTOR;
		this.leftStack.y = height * 0.5;
		this.rightStack.x = width * Cards.RIGHT_STACK_X_FACTOR;
		this.rightStack.y = height * 0.5;

		const cardWidth = Math.min(width * Cards.CARD_WIDTH_FACTOR, height * Cards.CARD_WIDTH_FACTOR);
		if (this.movedCard)
		{
			this.movedCard.resize(cardWidth);
		}

		this.leftStackTopCoords.x = Cards.CARDS_COUNT / 2 * Cards.CARD_OFFSET_IN_STACK;
		this.leftStackTopCoords.y = Cards.CARDS_COUNT / 2 * Cards.CARD_OFFSET_IN_STACK;
		for (const card of this.leftStack.children as Card[])
		{
			card.resize(cardWidth);
			card.x = this.leftStackTopCoords.x;
			card.y = this.leftStackTopCoords.y;
			this.leftStackTopCoords.x -= Cards.CARD_OFFSET_IN_STACK;
			this.leftStackTopCoords.y -= Cards.CARD_OFFSET_IN_STACK;
		}
		this.rightStackTopCoords.x = Cards.CARDS_COUNT / 2 * Cards.CARD_OFFSET_IN_STACK;
		this.rightStackTopCoords.y = Cards.CARDS_COUNT / 2 * Cards.CARD_OFFSET_IN_STACK;
		for (const card of this.rightStack.children as Card[])
		{
			card.resize(cardWidth);
			card.x = this.rightStackTopCoords.x;
			card.y = this.rightStackTopCoords.y;
			this.rightStackTopCoords.x -= Cards.CARD_OFFSET_IN_STACK;
			this.rightStackTopCoords.y -= Cards.CARD_OFFSET_IN_STACK;
		}
	}
}
