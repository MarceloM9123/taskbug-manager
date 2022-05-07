import { useContext, useEffect, useState, useCallback } from "react";
import { auth, googleAuthProvider, signInWithPopup, signOut, firestore } from "../lib/firebase";

import debounce from "lodash.debounce";

import { UserContext } from "../lib/context";
import { doc, getDoc, writeBatch  } from "../lib/firebase/firestore";

export default function Signin(props) {

    return (
        <main>
            {!user && <SignInButton/>}
            {!username && <UsernameForm/>}
            {username && <SignOutButton />}
        </main>
    )
}

function SignInButton(){
    const signInwithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider);
    }
    return (
        <button onClick={signInwithGoogle}>
            Sign in with Google
        </button>
    )
}

function SignOutButton(){
    return (
        <button onClick={() => signOut(auth)}>Sign Out</button>
    )
}

function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const [user, username] = useContext(UserContext);

    const onSubmit = async (e) => {
        e.preventDefault();

        const userDoc = doc(firestore, "users", user.uid);
        const usernameDoc = doc(firestore, "usernames", formValue);

        const batch = writeBatch(firestore);

        batch.set(userDoc,{username:formValue, photoUrl: user.photoURL, displayName: user.displayName});
        batch.set(usernameDoc,{ uid: user.uid });

        await batch.commit();
    }

    const onChange = (e) => {
        val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (val >= 3){
            setFormValue(val);
            setIsValid(false);
            setLoading(false);
        }

        if (re.test(val)){
            setFormValue(val);
            setIsValid(false);
            setLoading(true);
        }

    }

    //hit the db for username match after debounce
    //usecallback required for debounce to work
    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const docRef = doc(firestore, "users", "${username}")
                const { exists } = await getDoc(docRef)
                setLoading(false);
                setIsValid(!exists);
            }
        }, 500),
        []
        );

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue])

    return (
        !username && (<section>
            <form onSubmit={onSubmit}>
                <input input={formValue} onChange={onChange} />
                <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
                <button type="submit" disabled={!isValid} loading={loading} >

                </button>
                
                <h3>Debug state</h3>
                <div>
                    username: {formValue}
                    <br />
                    loading: {loading.toString()}
                    <br />
                    username valid: {isValid.toString()}
                </div>

            </form>
        </section>
        )
    );
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p>Checking...</p>;
    } else if (isValid) {
        return <p>{username} available!</p>
    } else if (username && !isValid) {
        return <p>That username is taken!</p>
    } else {
        return <p></p>;
    }
}
