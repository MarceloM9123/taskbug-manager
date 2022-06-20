import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';

import EpicSelect from "./EpicSelect";

export default function EpicForm({epics}){
    const [ submitted, setSubmitted ] = useState();
    const { register, handleSubmit, control } = useForm();

    const onSubmit = data => {
        console.log(data);
        setSubmitted(data);
    }

    const AssigneeOptions = [
        {value:"marcelo", label:"marcelo"},
        {value:"bob", label:"bob"}
    ]
    const PriorityOptions = [
        {value:"low", label:"low"},
        {value:"high", label:"high"}
    ]
    const LabelOptions = [
        {value:"easy", label:"easy"},
        {value:"hard", label:"hard"}
    ]
    const SprintOptions = [
        {value:"sprint 1", label:"sprint 1"},
        {value:"sprint 2", label:"sprint 2"}
    ]
   
      
    return (
        <section>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label >Epic Name</label>
                <EpicSelect epics={epics} />
                <label >Epic Summary</label>
                <input {...register("epicSummary")} type="text" />
                <label >File attachment</label>
                <input {...register("attachment")}type="file" />
                <label >Description</label>
                <textarea name="description" {...register("description", {})}></textarea>
                <label >Reporter</label>
                <input {...register("reporter")} type="text" />
                <label >Priority</label>
                <Select options={PriorityOptions} />
                <label >Assignee</label>
                <Controller
                    name="Assignee"
                    control={control}
                    render={({ field }) => {
                        return (
                            <Select 
                                options={AssigneeOptions}
                                isMulti
                                {...field} 
                            />
                        );
                    }}
                />
                <label >Labels</label>
                <Select options={LabelOptions} />
                <label >Sprints</label>
                <Select options={SprintOptions} />

                <button type="submit">submit</button> 
            </form>
        </section>
    )
}
