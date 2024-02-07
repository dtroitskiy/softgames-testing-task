import { Application } from 'pixi.js';

import Scene from './Scene';
import Menu from './Menu';
import Cards from './Cards';

export class App
{
	private pixi: Application<HTMLCanvasElement>;
	
	private currentScene: Scene;

	public constructor()
	{
		this.pixi = new Application<HTMLCanvasElement>({ resizeTo: window, background: '#FFFFFF' });
		document.body.appendChild(this.pixi.view);

		this.switchScene('menu');
	}

	public switchScene(sceneID: string)
	{
		if (this.currentScene)
		{
			this.currentScene.removeFromParent();
		}

		switch (sceneID)
		{
			case 'menu':
				const menu = new Menu();
				menu.addButtonClickedHandler(this.onMenuButtonClicked.bind(this));
				this.currentScene = menu;
				break;
			case 'cards':
			 	this.currentScene = new Cards();
			break;
			// case 'text':
			// 	this.currentScene = new Text();
			// 	break;
			// case 'particles':
			// 	this.currentScene = new Particles();
			// 	break;
		}

		this.pixi.stage.addChild(this.currentScene);
		this.resize();
	}

	public onMenuButtonClicked(buttonID: string)
	{
		this.switchScene(buttonID);
	}

	public resize()
	{
		if (this.currentScene)
		{
			this.currentScene.resize(window.innerWidth, window.innerHeight);
		}
	}
};

document.addEventListener('DOMContentLoaded', () =>
{
	const app = new App();
	window.addEventListener('resize', () => app.resize());
});
