import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    setDoc,
    query,
    where,
    doc
} from "../firebase/firebase.js";
import { Utils } from "../utils.js";

export const Storage = {
    keyStatistics: "statistics",
    keySkills: "skills",
    db: getFirestore(Utils.getFirebaseApp()),

    async getStatistics() {
        const userId = JSON.parse(Utils.isUserLoggedIn()).uid;
        const querySnapshot = await getDocs(query(collection(this.db, this.keyStatistics), where("user_id", "==", userId)));
        
        if (querySnapshot.empty) {
            const obj = {
                id: 0,
                wins: 0,
                lost: 0,
                user_id: userId
            };

            const docRef = await addDoc(collection(this.db, this.keyStatistics), obj);
            obj.id = docRef.id;

            return obj;
        }

        const dataToReturn = querySnapshot.docs[0].data();
        dataToReturn.id = querySnapshot.docs[0].id;
        return dataToReturn;
    },

    async saveStatistics(newObj) {
        await setDoc(doc(this.db, this.keyStatistics, newObj.id), newObj);
    },

    async addWin() {
        const actual = await this.getStatistics();
        actual.wins += 1;
        await this.saveStatistics(actual);
    },

    async addLost() {
        const actual = await this.getStatistics();
        actual.lost += 1;
        await this.saveStatistics(actual);
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