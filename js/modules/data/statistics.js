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

export const StatisticsStorage = {
    collectionKey: "statistics",
    db: getFirestore(Utils.getFirebaseApp()),

    async getStatistics() {
        const userId = JSON.parse(Utils.isUserLoggedIn()).uid;
        const querySnapshot = await getDocs(
            query(collection(this.db, this.collectionKey),
            where("user_id", "==", userId))
        );
        
        if (querySnapshot.empty) {
            const obj = {
                id: 0,
                wins: 0,
                lost: 0,
                user_id: userId
            };

            const docRef = await addDoc(collection(this.db, this.collectionKey), obj);
            obj.id = docRef.id;

            return obj;
        }

        const dataToReturn = querySnapshot.docs[0].data();
        dataToReturn.id = querySnapshot.docs[0].id;
        return dataToReturn;
    },

    async saveStatistics(newObj) {
        await setDoc(doc(this.db, this.collectionKey, newObj.id), newObj);
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
}