import { useState, useContext, useCallback } from "react";
import { ProjectContext, UserContext } from "../lib/context";

import { firestore, UseProjectIssueNames } from "../lib/firebase";
import { collection, getDocs, doc, query, where, setDoc, writeBatch } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { Controller, useForm } from "react-hook-form";
import Select from 'react-select';
import debounce from 'lodash.debounce';

export default function IssueForm() {
    const [ formType, setFormType ] = useState('epics');
    const [ isValid, setIsValid ] = useState(true);
    const { selectedProject } = useContext(ProjectContext);
    const { register, handleSubmit, control } = useForm();
    const { username } = useContext(UserContext);

    const epics = UseProjectIssueNames(selectedProject, 'epics');
    const stories = UseProjectIssueNames(selectedProject, 'stories');
    const tasks = UseProjectIssueNames(selectedProject, 'tasks');
    const sprints = UseProjectIssueNames(selectedProject, 'sprints');
    
    const [ labeldocs ] = useCollectionData(collection(firestore, 'labels'));
    const labels = labeldocs?.map((doc) => doc.name);

    const [ usersdocs ] = useCollectionData(collection(firestore, 'users'));
    const usernames = usersdocs?.map((doc) => doc.username);

    const issueToOptionsObjList = (issues) => {
        const options = [];
        issues?.map((issue) => {
            options.push(
                {value: issue, label: issue}
            );
        });
        return options
    }

    const epicOptions = issueToOptionsObjList(epics);
    const storyOptions = issueToOptionsObjList(stories);
    const taskOptions = issueToOptionsObjList(tasks);
    const sprintOptions = issueToOptionsObjList(sprints);
    
    const labelOptions = issueToOptionsObjList(labels);
    const usernameOptions = issueToOptionsObjList(usernames);

    const PriorityOptions = [
        {value:"low", label:"low"},
        {value:"medium", label:"medium"},
        {value:"high", label:"high"}
    ]

    function onChange(e) {
        const val = e.target.value;
        setFormType(val);
    }

    const checkIssueName = useCallback(
        debounce(async (e, formType, selectedProject) => {
            const val = e.target.value;
            if (val.length >= 3) {
                const issuesRef = collection(firestore, `${formType}`);
                const Query = query(issuesRef, where('project link', '==', `${selectedProject}`), where('name', '==', `${val}`))
                const querySnap = await getDocs(Query);
                setIsValid(querySnap.empty)
            }
        }, 500),
        []
    );

    const onSubmit = async (data) => {   

        const batch = writeBatch(firestore)

        const issueDoc = doc(firestore, `${formType}/${data.name}`)

        batch.set(issueDoc, {name: data.name, summary: data.summary, desription: data.description, 
            reporter: data.reporter, priority: data.priority[0].value, assignees: data.assignee[0].value, 
            labels: data.label[0].value, sprint: data.sprint[0].value})

        if (formType === "stories") {
            batch.set(issueDoc, {name: data.name, summary: data.summary, desription: data.description, 
                reporter: data.reporter, priority: data.priority[0].value, assignees: data.assignee[0].value, 
                labels: data.label[0].value, sprint: data.sprint[0].value, epicLink: data.epic.value, taskLink: data.task[0].value})
        } else if (formType === "tasks") {
            batch.set(issueDoc, {name: data.name, summary: data.summary, desription: data.description, 
                reporter: data.reporter, priority: data.priority[0].value, assignees: data.assignee[0].value, 
                labels: data.label[0].value, sprint: data.sprint[0].value, storyLink: data.story[0].value})
        }

        await batch.commit()
    }
    
    return (
            <section>
                <p>{ selectedProject }</p>
                <form>
                <label>Issue Type</label>
                <select onChange={(e) => onChange(e)}>
                    <option value="epics">Epic</option>
                    <option value="stories">Story</option>
                    <option value="tasks">Task</option>
                </select>
                </form>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <label>{formType.charAt(0).toLocaleUpperCase() + formType.slice(1)} Name</label>
                    <IssueNameMessage isValid={isValid}/>
                    <input 
                        type="text"
                        {...register("name")}
                        onChange={(e) => checkIssueName(e, formType, selectedProject)} 
                        />
                    <label >Summary</label>
                    <input {...register("summary")} type="text" />
                    <label >File attachment</label>
                    <input {...register("attachment")}type="file" />
                    <label >Description</label>
                    <textarea name="description" {...register("description", {})}></textarea>
                    <label >Reporter</label>
                    <input {...register("reporter")} type="text" />
                    <label >Priority</label>
                    <Controller
                        name="priority"
                        control={control}
                        render={({ field }) => {
                            return (
                                <Select options={PriorityOptions} isMulti {...field}/>
                            );
                        }}
                    />
                    <label >Assignee</label>
                    <Controller
                        name="assignee"
                        control={control}
                        render={({ field }) => {
                            return (
                                <Select options={usernameOptions} isMulti {...field} />
                            );
                        }}
                    />
                    <label >Labels</label>
                    <Controller
                        name="label"
                        control={control}
                        render={({ field }) => {
                            return (
                                <Select options={labelOptions} isMulti {...field}/>
                            );
                        }}
                    />
                    <label >Sprints</label>
                    <Controller
                        name="sprint"
                        control={control}
                        render={({ field }) => {
                            return (
                                <Select options={sprintOptions} isMulti {...field} />
                            );
                        }}
                    />
                    {formType==="stories" && (
                    <>
                        <label htmlFor="">Link Epic</label>
                        <Controller
                            name="epic"
                            control={control}
                            render={({ field }) => {
                                return (
                                    <Select options={epicOptions} {...field}/>
                                );
                            }}
                        />
                        <label htmlFor="">Link Tasks</label>
                        <Controller
                            name="task"
                            control={control}
                            render={({ field }) => {
                                return (
                                    <Select options={taskOptions} isMulti {...field}/>
                                );
                            }}
                        />
                    </>
                    )}
                    {formType==="tasks" && (
                    <>
                        <label>Link Story</label>
                        <Controller
                            name="story"
                            control={control}
                            render={({ field }) => {
                                return (
                                    <Select options={storyOptions} isMulti {...field}/>
                                );
                            }}
                        />
                    </>
                    )}

                    <input type="submit" disabled={!isValid} />

                </form>
            </section>
    )
}

function IssueNameMessage({ isValid }) {
    if (!isValid) {
        return <p>Issue name taken</p>
    } else if (isValid) {
        return
    }
}
