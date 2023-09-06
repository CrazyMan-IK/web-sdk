import { vec2 } from './vec2';
export default class Scaler {
    private readonly _element;
    private readonly _baseSize;
    private readonly _baseSizeMatch;
    private _cachedScaleFactor;
    constructor(element: HTMLElement, baseSize: vec2, baseSizeMatch: number);
    getCurrentScaleFactor(): number;
    private getScaleFactor;
    private lerp;
    private log2;
    private divide;
    private resize;
}
