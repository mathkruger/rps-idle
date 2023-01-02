import {
    getFirestore,
    collection,
    getDocs,
    setDoc,
    query,
    where,
    doc,
    deleteDoc
} from "../firebase/firebase.js";
import { Utils } from "../utils.js";

export const SkillsStorage = {
    collectionKey: "skills",
    db: getFirestore(Utils.getFirebaseApp()),
    userId: Utils.isUserLoggedIn() ? JSON.parse(Utils.isUserLoggedIn()).uid : "",

    reloadUserId() {
        this.userId = JSON.parse(Utils.isUserLoggedIn()).uid;
    },

    getSkillId(id) {
        return id + "_" + this.userId;
    },

    async getSkills() {
        const querySnapshot = await getDocs(
            query(collection(this.db, this.collectionKey),
            where("user_id", "==", this.userId))
        );

        if (querySnapshot.empty) {
            return [];
        }

        const dataToReturn = querySnapshot.docs.map(x => x.data());
        return dataToReturn;
    },

    async saveSkill(skill) {
        await setDoc(doc(this.db, this.collectionKey, this.getSkillId(skill.id)), {
            id: skill.id,
            name: skill.name,
            description: skill.description,
            quantity: skill.quantity,
            user_id: this.userId
        });
    },

    async addSkill(newObj) {
        const actual = await this.getSkills();
        const existingItem = actual.find(x => x.id == newObj.id);
        
        let objToSave = newObj;

        if (existingItem) {
            existingItem.quantity += 1;
            objToSave = existingItem;
        }

        await this.saveSkill(objToSave);
    },

    async consumeSkill(id) {
        const list = await this.getSkills();
        const actual = list.find(x => x.id === id);
        actual.quantity -= 1;

        if (actual.quantity == 0) {
            await deleteDoc(doc(this.db, this.collectionKey, this.getSkillId(id)));
        }
        else {
            await this.saveSkill(actual);
        }
    },
}