import { SimpleEventDispatcher } from 'ste-simple-events';
import SDK from './sdk';

const _stateChanged: SimpleEventDispatcher<boolean> = new SimpleEventDispatcher();
const _documentVisibilityChanged: SimpleEventDispatcher<boolean> = new SimpleEventDispatcher();
const stateChanged = _stateChanged.asEvent();
const documentVisibilityChanged = _stateChanged.asEvent();
let _isAdShow: boolean = false;
let _inBackground: boolean = false;
let _isPaused: boolean = false;

function setPauseState(state: boolean): void {
  if (_isPaused != state) {
    _isPaused = state;
    _stateChanged.dispatch(_isPaused);
  }
}

function getIsPaused(): boolean {
  return _isPaused;
}

function updateState(): void {
  if (!_isAdShow && !_inBackground) {
    setPauseState(false);

    return;
  }

  setPauseState(true);
}

function onDocumentVisibilityChanged(): void {
  _inBackground = document.hidden;

  _documentVisibilityChanged.dispatch(!_inBackground);

  updateState();
}

function onAdOpened(): void {
  _isAdShow = true;

  updateState();
}

function onAdClosed(): void {
  _isAdShow = false;

  updateState();
}

document.addEventListener('visibilitychange', onDocumentVisibilityChanged);
SDK.contentPauseRequested.subscribe(onAdOpened);
SDK.contentContinueRequested.subscribe(onAdClosed);

export { stateChanged, getIsPaused, documentVisibilityChanged };
