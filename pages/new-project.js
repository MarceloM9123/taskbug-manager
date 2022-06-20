import { useState } from "react";
import { firestore } from "../lib/firebase";
import { doc, setDoc,  } from "firebase/firestore";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function NewProject() {

    return (
        <main>
            <ProjectForm/>
        </main>
    )
}

function ProjectForm() {
    const [ newProjectName, setNewProjectName ] = useState('');
    const { user } = useContext(UserContext)

    const onSubmit = async (e) => {
        e.preventDefault();

        const projectDoc = doc(firestore, `projects/${newProjectName}`);

        await setDoc(projectDoc, { name: newProjectName, owner: user.uid });
    }

    const onChange = (e) => {
        const val = e.target.value.toLowerCase();
        setNewProjectName(val);
    }

    return(
        <form onSubmit={onSubmit} className="new__project__form">
            <label>New Project</label>
            <input onChange={onChange} />
            <button type="submit">create new project</button>

            <h3>debug state</h3>
            <div>
                project name : {newProjectName}
            </div>
        </form>
    )
}
