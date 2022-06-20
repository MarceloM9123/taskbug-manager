import { initializeApp } from "firebase/app";
import { firebase } from './firebase'
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { collectionGroup, getFirestore, query, Timestamp, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJ7I2TdzN6riCgj-Df6ad4iViGUL3R_iQ",
  authDomain: "taskbug-manager.firebaseapp.com",
  projectId: "taskbug-manager",
  storageBucket: "taskbug-manager.appspot.com",
  messagingSenderId: "1044033285055",
  appId: "1:1044033285055:web:70c95242e792f8d39c0f0a",
  measurementId: "G-GF4V13DZFR"
  };

// Initialize firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize auth && firestore with the 'firebaseApp' property
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

export default firebaseApp;

export async function getUserWithUsername(username) {
  const usersRef = firestore.collection('users');
  const query = usersRef.where('username', '==', username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}


export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}

export const fromMillis = Timestamp.fromMillis();

export function UseProjectIssueNames(project, issue) {
  const Ref = collectionGroup(firestore, issue);
  const Query = query(Ref, where('project link', '==', project));
  const [ docs ] = useCollectionData(Query);
  const issues = docs?.map((doc) => doc.name);

  return issues;
}
