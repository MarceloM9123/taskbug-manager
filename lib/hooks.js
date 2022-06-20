import { useEffect, useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../lib/firebase';
import { doc, onSnapshot, collection, query, where, limit } from 'firebase/firestore';

export function useUserData() {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);

    useEffect(() => {

        let unsubscribe;

        if (user){
            unsubscribe = onSnapshot(doc(firestore, "users", user.uid), (doc) => {
                setUsername(doc.data()?.username);
            });
        }else{
            setUsername(null);
        }

        return unsubscribe;
    }, [user]);
    return {user, username};
}

export function useProjectData() {
    const [user] = useAuthState(auth);
    const [ projectNames, setProjectNames ] = useState([]);

    useEffect(() => {

        let unsubscribe;

        if (user && projectNames.length === 0){
            const projectsRef = collection(firestore, "projects");
            const collectionQuery = query(
                projectsRef,
                where("owner", "==", user.uid),
                limit(3)
            );
            unsubscribe = onSnapshot(collectionQuery, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setProjectNames((projects) => 
                        [...projects, doc.data()?.name]
                    );
                });
            });
        }

        return unsubscribe;
    }, [user]);
    
    return {projectNames};
}
