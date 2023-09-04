import { Locale } from './localization';
export type DeviceInfo = {
    readonly type: string;
    isDesktop: () => boolean;
    isMobile: () => boolean;
    isTablet: () => boolean;
    isTV: () => boolean;
};
export type InterstitialCallbacks = {
    onOpen?: () => void;
    onClose?: (wasShown: boolean) => void;
    onError?: (error: Error) => void;
};
export type RewardedCallbacks = {
    onRewarded?: () => void;
} & InterstitialCallbacks;
export default abstract class SDKWrapper {
    abstract get locale(): Locale;
    get deviceInfo(): DeviceInfo;
    abstract initialize(): Promise<void>;
    abstract ready(): void;
    abstract showInterstitial(callbacks?: InterstitialCallbacks): void;
    abstract showRewarded(callbacks?: RewardedCallbacks): void;
    getPlayerData(keys?: string[]): Promise<Record<string, any>>;
    setPlayerData(values: Record<string, any>): Promise<void>;
}
