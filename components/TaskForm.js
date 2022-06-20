import EpicSelect from "./EpicSelect"

export default function TaskForm({epics}){
    return (
        <section>
            <form >
                <label >Epic Link</label>
                <EpicSelect epics={epics} />
            </form>
        </section>
    )
}