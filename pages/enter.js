import { async } from "@firebase/util";
import { auth, googleAuthProvider, signInWithPopup, signOut } from "../lib/firebase";

export default function Signin(props) {

    return (
        <main>
            {!user && <SignInButton/>}
            {!username && <UsernameForm/>}
            {username && <SignOutButton/>}
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
    return (
        <section>
            <form onSubmit={onSubmit}>
                <input />
                <button>

                </button>
            </form>
        </section>
    )
}