import Link from "next/link";
import { useContext, useState } from "react";
import { UserContext } from '../lib/context';
import { signOut } from "firebase/auth";
import { useRouter } from 'next/router';
import { auth } from "../lib/firebase";

export default function Navbar({handleOpen}){
    const { user, username } = useContext(UserContext);

    const router = useRouter();

    const userSignOut = () => {
        signOut(auth);
        router.reload();
    }

    return (
        <nav>
            <ul>
                <li>
                    <Link href="/">
                        <button>Home</button>
                    </Link>
                </li>
            </ul>
            <ul>
                {username &&(
                <>
                    <li>
                        <button onClick={userSignOut}>Sign Out</button>
                    </li>
                    <li >
                        <button onClick={handleOpen}>
                            Create
                        </button>
                    </li>
                    <li >
                        <Link  href={`/${username}`}>
                            <img src={user?.photoURL} />
                        </Link>
                    </li>
                </>
                )}
                {!username &&(
                    <li>
                        <Link href="/enter">
                            <button>Sign In</button>
                        </Link>
                    </li>
                )}
            </ul>

            
        </nav>
    );
}
