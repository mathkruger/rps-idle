import { SkillsStorage } from "../data/skills.js";
import { getAuth, signOut, signInWithPopup, GoogleAuthProvider } from "../firebase/firebase.js";
import { Utils } from "../utils.js";

export class Auth {
    constructor() {
        const app = Utils.getFirebaseApp();
        
        this.provider = new GoogleAuthProvider();
        this.auth = getAuth(app);
        this.userKey = Utils.userStorageKey;
    }

    async login() {
        const result = await signInWithPopup(this.auth, this.provider);
        const user = result.user;
        
        window.localStorage.setItem(this.userKey, JSON.stringify({
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid
        }));
        
        SkillsStorage.reloadUserId();
    }

    logout() {
        signOut(this.auth);
        window.localStorage.removeItem(this.userKey);
    }
}
