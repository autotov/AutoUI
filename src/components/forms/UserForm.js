import React, { useState, useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../forms/useForm';
import CompanyTransferList from '../CompanyTransferList';


const roleItems = [
    { id: 'ADMIN', title: 'ניהול' },
    { id: 'OPERATOR', title: 'עריכה' },
    { id: 'VIEWER', title: 'צפיה' },
]

const initialFValues = {
    numberId: 0,
    username: '',
    name: '',
    lastName: '',
    password: '',
    phone: '',
    mobilePhone: '',
    role: 'VIEWER',
}

function getPasswordControl(action, values, errors, handleInputChange) {
    if(action == 'add') {
        return (<Controls.Input
            label="סיסמא"
            name="password"
            type="password"
            value={values.password || ''}
            onChange={handleInputChange}
            error={errors.password || ''}
        />);
    }

    return "";
}

export default function UserForm(props) {
    const { addOrEdit, recordForEdit, closeForm, action } = props
    console.log(recordForEdit)
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "חייב למלא שדה זה"
        if ('username' in fieldValues)
            temp.username = (/$^|.+@.+..+/).test(fieldValues.username) ? "" : "שם משתמש אינו תקין, כתובת דוא\"ל"
        if ('lastName' in fieldValues)
            temp.lastName = fieldValues.lastName.length > 2 ? "" : "מינימום 2 תווים"
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
            values.companies = companyIds;
            addOrEdit(values, resetForm, action);
        }
    }

    useEffect(() => {
        if (recordForEdit != null)
            setValues({
                ...recordForEdit
            })
    }, [recordForEdit])

    let companyList = [];
    if (recordForEdit != null) {
        companyList = recordForEdit.companies;
    }

    const [companyIds,  setCompanyIds] = React.useState(companyList) 
    if(companyIds == undefined || companyIds == null) {
        setCompanyIds([]);
    }
    console.log("values.role="+values.role)

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={6}> 
                    {getPasswordControl(action, values, errors, handleInputChange)}
                    <Controls.Input
                        label="שם משפחה"
                        name="lastName"
                        value={values.lastName || ''}
                        onChange={handleInputChange}
                        error={errors.lastName || ''}
                    />
                    
                    <Controls.Input
                        label="טלפון"
                        name="phone"
                        value={values.phone || ''}
                        onChange={handleInputChange}
                        error={errors.phone || ''}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Controls.Input
                        label="שם משתמש (כתובת דוא'ל"
                        name="username"
                        value={values.username || ''}
                        onChange={handleInputChange}
                        error={errors.username || ''}
                    />
                    <Controls.Input
                        label="שם"
                        name="name"
                        value={values.name || ''}
                        onChange={handleInputChange}
                        error={errors.name || ''}
                    />
                    <Controls.Input
                        label="פלאפון"
                        name="mobilePhone"
                        value={values.mobilePhone || ''}
                        onChange={handleInputChange}
                        error={errors.mobilePhone || ''}
                    />          
                </Grid>

                <Grid item xs={12} item ys={2}>
                    <Controls.Select
                        name="role"
                        label="הרשאה"
                        value={values.role || 'עריכה'}
                        onChange={handleInputChange}
                        error={errors.role || ''}
                        options={roleItems}
                    />
                    {(values.role!='ADMIN') ? (
                        <div>
                            <CompanyTransferList 
                            companyIds={companyIds}  
                            setCompanyIds={setCompanyIds}/>
                        </div>
                        ) : (<div></div>)
                    }
                </Grid>
                <Grid item xs={12} item ys={2}>
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
