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
}
//# sourceMappingURL=sdk-wrapper.js.map