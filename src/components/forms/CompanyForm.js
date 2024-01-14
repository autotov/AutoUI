import React, { useState, useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../forms/useForm';

const initialFValues = {
    index: 0,
    name: '',
    companyId: 0,
    licenseDate: new Date(),
    contact: '',
    contactMail: '',
    contactPhone: '',
    manager: '',
    managerMail: '',
    managerPhone: '',
}

export default function CompanyForm(props) {
    const { addOrEdit, recordForEdit, closeForm, action, setRunGetCompanies } = props
    
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "חייב למלא שדה זה"
        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
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
        if (validate()) {
            addOrEdit(values, resetForm, action, setRunGetCompanies);
        }
    }

    useEffect(() => {
        if (recordForEdit != null)
            setValues({
                ...recordForEdit
            })
    }, [recordForEdit])
   
    return (
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={4}>
                    <Controls.Input
                        label="מנהל"
                        name="manager"
                        value={values.manager || ''}
                        onChange={handleInputChange}
                        error={errors.manager || ''}
                    />

                    <Controls.Input
                        label="דוא''ל מנהל"
                        name="managerMail"
                        value={values.managerMail || ''}
                        onChange={handleInputChange}
                        error={errors.managerMail || ''}
                    />

                    <Controls.Input
                        label="פלאפון מנהל"
                        name="managerPhone"
                        value={values.managerPhone || ''}
                        onChange={handleInputChange}
                        error={errors.managerPhone || ''}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Controls.Input
                        label="קצין בטיחות"
                        name="contact"
                        value={values.contact || ''}
                        onChange={handleInputChange}
                        error={errors.contact || ''}
                    />

                    <Controls.Input
                        label="דוא''ל קצין בטיחות"
                        name="contactMail"
                        value={values.contactMail || ''}
                        onChange={handleInputChange}
                        error={errors.contactMail || ''}
                    />

                    <Controls.Input
                        label="פלאפון קצין בטיחות"
                        name="contactPhone"
                        value={values.contactPhone || ''}
                        onChange={handleInputChange}
                        error={errors.contactPhone || ''}
                    />
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
                <Grid item xs={4}>
                    <Controls.Input
                        name="name"
                        label="שם"
                        value={values.name || ''}
                        onChange={handleInputChange}
                        error={errors.name || ''}
                    />
                    
                    <Controls.Input
                        label="ח.פ. \ מספר זהות"
                        name="companyId"
                        value={values.companyId || ''}
                        onChange={handleInputChange}
                        error={errors.companyId || ''}
                    />

                    <Controls.DatePicker
                        label="תוקף רשיון מוביל"
                        name="licenseDate"
                        value={values.licenseDate || new Date()}
                        onChange={handleInputChange}
                        error={errors.licenseDate || ''}
                    />
                </Grid>
                
            </Grid>
        </Form>
    )
    
}
