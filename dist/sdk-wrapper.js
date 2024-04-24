function getLocalStorageItem(key) {
    try {
        return localStorage.getItem(key);
    }
    catch {
        return null;
    }
}
function setLocalStorageItem(key, value) {
    try {
        localStorage.setItem(key, value);
    }
    catch {
        return;
    }
}
export default class SDKWrapper {
    _logName = '';
    constructor(logName) {
        this._logName = logName;
    }
    get deviceInfo() {
        return {
            type: 'desktop',
            isDesktop: () => true,
            isMobile: () => false,
            isTablet: () => false,
            isTV: () => false
        };
    }
    async getPlayerData(keys) {
        const data = JSON.parse(getLocalStorageItem('DATA') ?? '{}');
        if (keys === undefined) {
            return data;
        }
        const result = {};
        for (const key of keys) {
            result[key] = data[key];
        }
        return result;
    }
    async setPlayerData(values) {
        setLocalStorageItem('DATA', JSON.stringify(values));
    }
    log(...message) {
        const style = 'background: wheat; color: #1E324B; font-family: tahoma, verdana, helvetica, arial; font-size: 14px; font-weight: 900; text-align: center; padding: 6px 2px; border-radius: 6px; border: 2px solid #434975';
        console.log(`%c[${this._logName}]:`, style, ...message);
    }
}
//# sourceMappingURL=sdk-wrapper.js.map