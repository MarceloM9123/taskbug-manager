import Link from "next/link";

export default function Navbar(){
    const user = null;
    const username = null;

    return (
        <nav>
            <ul>
                <li>
                    <Link href="/">
                        <button>Feed</button>
                    </Link>
                </li>
                {username &&(
                <>
                    <li>
                        <Link href="/admin">
                            <button>Wite Posts</button>
                        </Link>
                    </li>
                    <li>
                        <Link href={`/${username}`}>
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
