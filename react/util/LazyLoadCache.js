export default class LazyLoadCache {
    keysLoaded = {};

    startLazyLoad(key, load) {
        if (this.keysLoaded[key])
            return;

        this.keysLoaded[key] = true;
        load();
    }
}
