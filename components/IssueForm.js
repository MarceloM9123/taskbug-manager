import { useState, useContext } from "react";
import { ProjectContext, UserContext } from "../lib/context";

import { firestore, UseProjectIssueNames } from "../lib/firebase";
import { collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { Controller, useForm } from "react-hook-form";
import Select from 'react-select';

export default function IssueForm() {
    const [ formType, setFormType ] = useState('epic');
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
        const val = e.target.value.toLowerCase();
        setFormType(val);
    }

    const onSubmit = data => {
        
        if (formType === "epic"){
            console.log("epic")
        }
        else if (formType === "story"){
            console.log("story")
        }
        else if (formType === "task"){
            console.log("task")
        }
    }
    return (
            <section>
                <p>{ selectedProject }</p>
                <form>
                <label>Issue Type</label>
                <select onChange={onChange}>
                    <option value="epic">Epic</option>
                    <option value="story">Story</option>
                    <option value="task">Task</option>
                </select>
                </form>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <label>{formType.charAt(0).toLocaleUpperCase() + formType.slice(1)} Name</label>
                    <input {...register(`${formType}`)}type="text" />
                    <label >Summary</label>
                    <input {...register("Summary")} type="text" />
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
                    {/* <Controller
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
                    /> */}
                    {/* <label >Sprints</label>
                    <Controller
                        name="sprint"
                        control={control}
                        render={({ field }) => {
                            return (
                                <Select options={sprintOptions} isMulti {...field} />
                            );
                        }}
                    /> */}
                    {/* {formType==="story" && (
                    <>
                        <label htmlFor="">Link Epic</label>
                        <Controller
                            name="epic"
                            control={control}
                            render={({ field }) => {
                                return (
                                    <Select options={epicOptions} isMulti {...field}/>
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
                    )} */}
                    {formType==="task" && (
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

                    <input type="submit" />

                </form>
            </section>
    )
}
