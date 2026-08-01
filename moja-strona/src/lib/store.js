export const store = {
    get(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    },
    set(key, val) {
        try { localStorage.setItem(key, val); } catch (e) {}
    },
};
