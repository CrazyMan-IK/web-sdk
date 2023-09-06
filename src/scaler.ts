import { vec2 } from './vec2';

/* const game = document.getElementById('game') as HTMLElement;

const baseSize = {
  x: 720,
  y: 1280
};
//const baseSizeMatch = baseSize.x / baseSize.y;
const baseSizeMatch = 0.631; */

export default class Scaler {
  private readonly _element: HTMLElement;
  private readonly _baseSize: vec2;
  private readonly _baseSizeMatch: number;
  private _cachedScaleFactor: number = 0;

  constructor(element: HTMLElement, baseSize: vec2, baseSizeMatch: number) {
    this._element = element;
    this._baseSize = baseSize;
    this._baseSizeMatch = baseSizeMatch;

    this.resize = this.resize.bind(this);

    window.addEventListener('resize', this.resize);
    this.resize();
  }

  public getCurrentScaleFactor(): number {
    if (this._cachedScaleFactor <= 0) {
      const maxWidth = window.innerWidth;
      const maxHeight = window.innerHeight;

      const match = maxWidth / maxHeight >= this._baseSizeMatch ? 1 : 0;

      this._cachedScaleFactor = this.getScaleFactor(this._baseSize, { x: maxWidth, y: maxHeight }, match);
    }

    return this._cachedScaleFactor;
  }

  private getScaleFactor(baseSize: vec2, viewportSize: vec2, match: number): number {
    const scaleFactor = this.log2(this.divide(baseSize, viewportSize));
    const averageScaleFactor = this.lerp(scaleFactor.x, scaleFactor.y, match);

    return Math.pow(2, averageScaleFactor);
  }

  private lerp(a: number, b: number, t: number): number {
    return a * (1 - t) + b * t;
  }

  private log2(n: vec2): vec2 {
    return {
      x: Math.log2(n.x),
      y: Math.log2(n.y)
    };
  }

  private divide(a: vec2, b: vec2): vec2 {
    return {
      x: a.x / b.x,
      y: a.y / b.y
    };
  }

  private resize(): void {
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    this._cachedScaleFactor = 0;

    const sf = this.getCurrentScaleFactor();
    const sf2 = 1 / sf;

    const newWidth = maxWidth / sf2;
    const newHeight = maxHeight / sf2;

    this._element.style.scale = sf2.toString();
    this._element.style.width = `${newWidth}px`;
    this._element.style.height = `${newHeight}px`;

    this._element.style.left = `${(newWidth - maxWidth) / -2}px`;
    this._element.style.top = `${(newHeight - maxHeight) / -2}px`;
  }
}
