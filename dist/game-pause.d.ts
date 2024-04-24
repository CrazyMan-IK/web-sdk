declare const stateChanged: import("ste-simple-events").ISimpleEvent<boolean>;
declare const documentVisibilityChanged: import("ste-simple-events").ISimpleEvent<boolean>;
declare function getIsPaused(): boolean;
export { stateChanged, getIsPaused, documentVisibilityChanged };
