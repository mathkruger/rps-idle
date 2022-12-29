export const Storage = {
    key: "statistics",

    getStatistics() {
        const obj = {
            wins: 0,
            lost: 0
        };

        return JSON.parse(localStorage.getItem(this.key) || JSON.stringify(obj));
    },

    saveStatistics(newObj) {
        localStorage.setItem(this.key, JSON.stringify(newObj));
    },

    addWin() {
        const actual = this.getStatistics();
        actual.wins += 1;
        this.saveStatistics(actual);
    },

    addLost() {
        const actual = this.getStatistics();
        actual.lost += 1;
        this.saveStatistics(actual);
    }
}