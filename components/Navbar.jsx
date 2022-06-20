import Link from "next/link";
import { useContext } from "react";
import { ProjectContext, UserContext } from '../lib/context';
import { signOut } from "firebase/auth";
import { useRouter } from 'next/router';
import { auth } from "../lib/firebase";

export default function Navbar({handleOpen, handleSelectedProject}){
    const { user, username } = useContext(UserContext);
    const { projectNames } = useContext(ProjectContext);
    const router = useRouter();

    const userSignOut = () => {
        signOut(auth);
        router.reload();
    }

    const onChange = (e) => {
        const selectedProject = e.target.value.toLowerCase();

        if (selectedProject !== 'new project') {
            handleSelectedProject(selectedProject);
        }
        if (router.asPath !== '/') {
            router.push('/');
        } 
        if (selectedProject === 'new project') {
            router.push('/new-project');
        }
        
    }
    
    return (
        <nav>
            <ul>
                <li>
                    <Link href="/">
                        <button>Home</button>
                    </Link>
                </li>
                <li>
                    <select name="projects" id="projects" onChange={onChange}>
                        {projectNames.projectNames.map(
                            (projectname) => <option value={projectname}>{projectname}</option>)}
                        <option value="new project">new project</option>
                    </select>
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
