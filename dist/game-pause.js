import { SimpleEventDispatcher } from 'ste-simple-events';
import SDK from './sdk';
const _stateChanged = new SimpleEventDispatcher();
const _documentVisibilityChanged = new SimpleEventDispatcher();
const stateChanged = _stateChanged.asEvent();
const documentVisibilityChanged = _stateChanged.asEvent();
let _isAdShow = false;
let _inBackground = false;
let _isPaused = false;
function setPauseState(state) {
    if (_isPaused != state) {
        _isPaused = state;
        _stateChanged.dispatch(_isPaused);
    }
}
function updateState() {
    if (!_isAdShow && !_inBackground) {
        setPauseState(false);
        return;
    }
    setPauseState(true);
}
function onDocumentVisibilityChanged() {
    _inBackground = document.hidden;
    _documentVisibilityChanged.dispatch(!_inBackground);
    updateState();
}
function onAdOpened() {
    _isAdShow = true;
    updateState();
}
function onAdClosed() {
    _isAdShow = false;
    updateState();
}
document.addEventListener('visibilitychange', onDocumentVisibilityChanged);
SDK.adOpened.subscribe(onAdOpened);
SDK.adClosed.subscribe(onAdClosed);
export { stateChanged, documentVisibilityChanged };
//# sourceMappingURL=game-pause.js.map