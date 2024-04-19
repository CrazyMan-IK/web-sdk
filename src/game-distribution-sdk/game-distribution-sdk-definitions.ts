// eslint-disable-next-line @typescript-eslint/ban-types
interface AdTypeDifferentiator extends String {
  [key: string]: unknown;
}

export type AdType = string & AdTypeDifferentiator;

export type GameDistributionSDK = {
  readonly leaderboard: {
    show(): void;
    addScore(): void;
  };

  readonly AdType: {
    readonly Display: AdType;
    readonly Interstitial: AdType;
    readonly Midroll: AdType;
    readonly Preroll: AdType;
    readonly Rewarded: AdType;
  };

  preloadAd(AdType?: AdType): Promise<void>;
  showAd(adType?: AdType): Promise<void>;
  sendEvent(
    options:
      | { eventName: 'track-milestone'; data: { isAuthorized: boolean; milestoneDescription: string } }
      | { eventName: 'game_event'; data: { level: number; score: number } }
  ): Promise<void>;
  openConsole(): Promise<void>;
};

const gdsdk: GameDistributionSDK = {} as any;
gdsdk.showAd(gdsdk.AdType.Display);
