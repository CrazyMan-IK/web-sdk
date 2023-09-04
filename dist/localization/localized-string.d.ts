export default class LocalizedString {
    private readonly _changed;
    private readonly _key;
    private readonly _fallback;
    private _value;
    constructor(key: string, fallback: string);
    get changed(): import("ste-events").IEvent<LocalizedString, void>;
    get value(): string;
    toString(): string;
    private onLocaleChanged;
}
