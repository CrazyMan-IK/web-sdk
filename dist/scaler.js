/* const game = document.getElementById('game') as HTMLElement;

const baseSize = {
  x: 720,
  y: 1280
};
//const baseSizeMatch = baseSize.x / baseSize.y;
const baseSizeMatch = 0.631; */
export default class Scaler {
    _element;
    _baseSize;
    _baseSizeMatch;
    _cachedScaleFactor = 0;
    constructor(element, baseSize, baseSizeMatch) {
        this._element = element;
        this._baseSize = baseSize;
        this._baseSizeMatch = baseSizeMatch;
        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize);
        this.resize();
    }
    getCurrentScaleFactor() {
        if (this._cachedScaleFactor <= 0) {
            const maxWidth = window.innerWidth;
            const maxHeight = window.innerHeight;
            const match = maxWidth / maxHeight >= this._baseSizeMatch ? 1 : 0;
            this._cachedScaleFactor = this.getScaleFactor(this._baseSize, { x: maxWidth, y: maxHeight }, match);
        }
        return this._cachedScaleFactor;
    }
    getScaleFactor(baseSize, viewportSize, match) {
        const scaleFactor = this.log2(this.divide(baseSize, viewportSize));
        const averageScaleFactor = this.lerp(scaleFactor.x, scaleFactor.y, match);
        return Math.pow(2, averageScaleFactor);
    }
    lerp(a, b, t) {
        return a * (1 - t) + b * t;
    }
    log2(n) {
        return {
            x: Math.log2(n.x),
            y: Math.log2(n.y)
        };
    }
    divide(a, b) {
        return {
            x: a.x / b.x,
            y: a.y / b.y
        };
    }
    resize() {
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
//# sourceMappingURL=scaler.js.map