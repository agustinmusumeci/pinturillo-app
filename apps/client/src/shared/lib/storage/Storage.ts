class Storage {
  constructor() {}

  getLocalStorage(key: string) {
    const data = window.localStorage.getItem(key);

    return data;
  }

  setLocalStorage(key: string, value: string) {
    window.localStorage.setItem(key, value);
  }
}

export default new Storage();
