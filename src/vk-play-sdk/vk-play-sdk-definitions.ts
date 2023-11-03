export type PurchaseInformation = {
  amount: number;
  item_id: string;
  description: string;
  currency: 'RUB' | 'USD' | 'EUR';
};

export type VKPlaySDK = {
  getLoginStatus(): void;
  registerUser(): void;
  authUser(): void;
  reloadWindow(): void;
  getAuthToken(): void;
  userInfo(): void;

  showAds(config?: { sources?: 'admanSource,admanagerSource' | 'admanSource' | 'admanagerSource'; interstitial?: boolean }): void;

  paymentFrame(args: { merchant_param: PurchaseInformation & Record<string, any> }): void;
  paymentFrameItem(args: { ids: string; merchant_param: Record<string, any> }): void;
  paymentFrameUrl(args: { merchant_param: PurchaseInformation & Record<string, any> }): void;
  getGameInventoryItems(): void;

  userProfile(): void;
  userFriends(): void;
  userSocialFriends(): void;
};
