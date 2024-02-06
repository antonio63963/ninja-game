class AppStorage {
  static storageName = 'ninja_game';

  static setNewGame() {
    localStorage.setItem(this.storageName, JSON.stringify({ isNewGame: true }));
  }
  static setNoNewGame() {
    localStorage.setItem(
      this.storageName,
      JSON.stringify({ isNewGame: false })
    );
  }

  static getIsNewGame() {
    const storage = localStorage.getItem(this.storageName);
    console.log('STOR:', storage);
    if (storage) {
      const data = JSON.parse(storage);
      return data.isNewGame;
    } else {
      return false;
    }
  }

  static clear() {
    localStorage.clear();
  }
}
