import React, { useState, useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../forms/useForm';
import FileUpload from "react-material-file-upload";

const initialFValues = {
    name: '',
    docType: 'רשיון',
    otherType: '',
}

const typeOptions = [
    { id: 'רשיון', title: 'רשיון' },
    { id: 'טופס בדיקה', title: 'טופס בדיקה' },
    { id: 'אחר', title: 'אחר' },
]

export default function AddFileForm(props) {
    const { addFile, closeForm, fileToAdd, files, setFiles } = props
    const [useOtherType, setUseOtherType] = useState(false);
    
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        console.log("fieldValues.name="+fieldValues.name)
        //if ('name' in fieldValues)
        //    temp.name = fieldValues.name ? "" : "חייב למלא שדה זה"
        if ('otherType' in fieldValues) {
            temp.otherType = useOtherType && (fieldValues.otherType == undefined || fieldValues.otherType == "") ? "חייב למלא שדה זה" : ""
        }
        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }

    const validateSubmit = (fieldValues = values) => {
        let temp = { ...errors }

        console.log("value="+fieldValues.value)
        console.log("name="+fieldValues.name)

        if (useOtherType) {
            temp.otherType = (fieldValues.otherType == undefined || fieldValues.otherType == "") ? "חייב למלא שדה זה" : ""
        }
        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }

    const handleTypeInputChange = e => {
        const { name, value } = e.target
        
        if(value == 'אחר') {
            setUseOtherType(true)
        } else {
            setUseOtherType(false)
        }
        handleInputChange(e)
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate);

    const handleSubmit = e => {
        e.preventDefault()
        if (!files || files == undefined || !files[0]) {
            console.log("No file")
            return;
        }
        if (validate() && validateSubmit()) {
            addFile(values, fileToAdd);
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <div className="flex gap-10 flex-wrap justify-end">
                <div className="flex gap-10 m-4 flex-wrap justify-center">
                    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
                        <div className="mt-10 w-72 md:w-400">
                            <FileUpload value={files} onChange={setFiles} 
                            title={"גרור את הקובץ או לחץ לבחירת הקובץ"}
                            buttonText={'בחירת קובץ'}
                            />
                        </div>   
                    </div>  
                </div>
            </div>
            <Grid container>
            <Grid item xs={8} md={8}>
                    <Controls.Input
                        name="name"
                        label="שם"
                        value={values.name || ''}
                        onChange={handleInputChange}
                        error={errors.name || ''}
                    />
                    
                    <Controls.Select
                        label="סוג מסמך"
                        name="docType"
                        value={values.docType || 'רשיון'}
                        onChange={handleTypeInputChange}
                        error={errors.docType || ''}
                        options={typeOptions}
                    />

                    
                    { useOtherType ?
                    (<Controls.Input
                        name="otherType"
                        label="סוג אחר"
                        value={values.otherType || ''}
                        onChange={handleInputChange}
                        error={errors.otherType || ''}
                        
                    />): ""}

                    <div>
                        <Controls.Button
                            type="submit"
                            text="שמירה" />
                        <Controls.Button
                            text="ביטול"
                            color="default"
                            onClick={closeForm} />
                    </div>
                </Grid>
            </Grid>
        </Form>
    )
    
}