export const Storage = {
    key: "statistics",
    keySkills: "skills",

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
    },

    getSkills() {
        return JSON.parse(localStorage.getItem(this.keySkills) || JSON.stringify([]));
    },

    addSkill(newObj) {
        const actual = this.getSkills();
        const existingItem = actual.findIndex(x => x.id == newObj.id);

        if (existingItem > -1) {
            actual[existingItem].quantity += 1;
        }
        else {
            newObj.quantity = 1;
            actual.push(newObj);
        }

        localStorage.setItem(this.keySkills, JSON.stringify(actual));
    },

    removeSkill(id) {
        let items = this.getSkills();
        const toRemove = items.findIndex(x => x.id == id);
        items[toRemove].quantity -= 1;
        items = items.filter(x => x.quantity > 0);
        localStorage.setItem(this.keySkills, JSON.stringify(items));
    },
}