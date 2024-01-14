import React, { useState, useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../forms/useForm';


const genderItems = [
    { id: 'male', title: 'זכר' },
    { id: 'female', title: 'נקבה' },
    { id: 'other', title: 'אחר' },
]

const initialFValues = {
    index: 0,
    driverId: '',
    risuyNumber: '',
    licenseNumber: '',
    name: '',
    lastName: '',
    licenseLevel: '',
    licenseExpireDate: new Date(),
    licenseDate: new Date(),
    HealthDeclarationDate: new Date(),
    training: 'false',
    trainingDate: new Date(),
    country: 'Israel',
    city: '',
    street: '',
    houseNumber: '',
    phoneNumber1: '',
    phoneNumber2: '',
    phoneNumberHome: '',
    phoneNumberOffice: '',
    birthDate: new Date(),
    startWorkDate: new Date(),
    workerNumber: '',
    email: '',
    workPlace: '',
    managerId: '',
    homes: '',
    crane: '',
    workingInHigh: 'false',
    moreDrivers: '',
    procedure6: '',
    comments: '',
    gender: 'male',
    department: '',
    hireDate: new Date(),
    isPermanent: false,
}

export default function DriverForm(props) {
    const { addOrEdit, recordForEdit, closeForm, addDriver } = props
    
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('driverId' in fieldValues)
            temp.driverId = fieldValues.driverId ? "" : "חייב למלא שדה זה"
        if ('email' in fieldValues)
            temp.email = (/$^|.+@.+..+/).test(fieldValues.email) ? "" : "כתובת מאייל אינה תקינה"
        if ('name' in fieldValues)
            temp.name = fieldValues.name.length > 2 ? "" : "מינימום 2 תווים"
        //if ('departmentId' in fieldValues)
        //    temp.departmentId = fieldValues.departmentId.length != 0 ? "" : "חייב למלא שדה זה"
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
            addOrEdit(values, resetForm, addDriver);
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
                        label="שם סניף העבודה"
                        name="workPlace"
                        value={values.workPlace || ''}
                        onChange={handleInputChange}
                        error={errors.workPlace || ''}
                    />
                    <Controls.Input
                        label="מנהל עבודה ישיר"
                        name="managerId"
                        value={values.managerId || ''}
                        onChange={handleInputChange}
                        error={errors.managerId || ''}
                    />
                    <Controls.Input
                        label="חומס"
                        name="homes"
                        value={values.homes || ''}
                        onChange={handleInputChange}
                        error={errors.homes || ''}
                    />
                    <Controls.Input
                        label="מנוף"
                        name="crane"
                        value={values.crane || ''}
                        onChange={handleInputChange}
                        error={errors.crane || ''}
                    />
                    <Controls.Input
                        label="עבודה בגובה"
                        name="workingInHigh"
                        value={values.workingInHigh || ''}
                        onChange={handleInputChange}
                        error={errors.workingInHigh || ''}
                    />
                    <Controls.Input
                        label="מחלקה"
                        name="department"
                        value={values.department || ''}
                        onChange={handleInputChange}
                        error={errors.department || ''}
                    />
                    <Controls.Input
                        label="תפקיד"
                        name="role"
                        value={values.role || ''}
                        onChange={handleInputChange}
                        error={errors.role || ''}
                    />
                    <Controls.Input
                        label="נהגים נלווים"
                        name="moreDrivers"
                        value={values.moreDrivers || ''}
                        onChange={handleInputChange}
                        error={errors.moreDrivers || ''}
                    />
                    <Controls.Input
                        label="נוהל 6"
                        name="procedure6"
                        value={values.procedure6 || ''}
                        onChange={handleInputChange}
                        error={errors.procedure6 || ''}
                    />
                    <Controls.Input
                        label="הערות"
                        name="comments"
                        value={values.comments || ''}
                        onChange={handleInputChange}
                        error={errors.comments || ''}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Controls.Input
                        label="עיר"
                        name="city"
                        value={values.city || ''}
                        onChange={handleInputChange}
                        error={errors.city || ''}
                    />
                    <Controls.Input
                        label="רחוב"
                        name="street"
                        value={values.street || ''}
                        onChange={handleInputChange}
                        error={errors.street || ''}
                    />
                    <Controls.Input
                        label="מספר בית"
                        name="houseNumber"
                        value={values.houseNumber || ''}
                        onChange={handleInputChange}
                        error={errors.houseNumber || ''}
                    />
                    <Controls.Input
                        label="נייד"
                        name="mobile1"
                        value={values.mobile1 || ''}
                        onChange={handleInputChange}
                        error={errors.mobile1 || ''}
                    />
                    <Controls.Input
                        label="נייד נוסף"
                        name="mobile2"
                        value={values.mobile2 || ''}
                        onChange={handleInputChange}
                        error={errors.mobile2 || ''}
                    />
                    <Controls.Input
                        label="מספר טלפון בבית"
                        name="phoneNumberHome"
                        value={values.phoneNumberHome || ''}
                        onChange={handleInputChange}
                        error={errors.phoneNumberHome || ''}
                    />
                    <Controls.Input
                        label="מספר טלפון במשרד"
                        name="phoneNumberOffice"
                        value={values.phoneNumberOffice || ''}
                        onChange={handleInputChange}
                        error={errors.phoneNumberOffice || ''}
                    />
                    <Controls.DatePicker
                        label="תאריך לידה"
                        name="birthDate"
                        value={values.birthDate || new Date()}
                        onChange={handleInputChange}
                        error={errors.birthDate || ''}
                    />
                    <Controls.DatePicker
                        label="תאריך תחילת עבודה"
                        name="startWorkDate"
                        value={values.startWorkDate || new Date()}
                        onChange={handleInputChange}
                        error={errors.startWorkDate || ''}
                    />
                    <Controls.Input
                        label="מספר עובד"
                        name="workerNumber"
                        value={values.workerNumber || ''}
                        onChange={handleInputChange}
                        error={errors.workerNumber || ''}
                    />
                    <Controls.Input
                        label="כתובת מאייל"
                        name="email"
                        value={values.email || ''}
                        onChange={handleInputChange}
                        error={errors.email || ''}
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
                        name="driverId"
                        label=".ת.ז"
                        value={values.driverId || ''}
                        onChange={handleInputChange}
                        error={errors.driverId || ''}
                        disabled={!addDriver}
                    />
                    <Controls.Input
                        name="name"
                        label="שם פרטי"
                        value={values.name || ''}
                        onChange={handleInputChange}
                        error={errors.name || ''}
                    />
                    <Controls.Input
                        name="lastName"
                        label="שם משפחה"
                        value={values.lastName || ''}
                        onChange={handleInputChange}
                        error={errors.lastName || ''}
                    />
                    <Controls.Input
                        name="risuyNumber"
                        label="מספר רישוי"
                        value={values.risuyNumber || ''}
                        onChange={handleInputChange}
                        error={errors.risuyNumber || ''}
                    />
                    <Controls.Input
                        name="licenseNumber"
                        label="מספר רישיון"
                        value={values.licenseNumber || ''}
                        onChange={handleInputChange}
                        error={errors.licenseNumber || ''}
                    />
                    <Controls.Input
                        label="דרגת רישיון"
                        name="licenseLevel"
                        value={values.licenseLevel || ''}
                        onChange={handleInputChange}
                        error={errors.licenseLevel || ''}
                    />
                    <Controls.DatePicker
                        label="תוקף רישיון"
                        name="licenseExpireDate"
                        value={values.licenseExpireDate || new Date()}
                        onChange={handleInputChange}
                        error={errors.licenseExpireDate || ''}
                    />
                    <Controls.DatePicker
                        label="תאריך הוצאה"
                        name="licenseDate"
                        value={values.licenseDate || new Date()}
                        onChange={handleInputChange}
                        error={errors.licenseDate || ''}
                    />
                    <Controls.DatePicker
                        label="הצהרת בריאות לשנתיים"
                        name="HealthDeclarationDate"
                        value={values.HealthDeclarationDate || new Date()}
                        onChange={handleInputChange}
                        error={errors.HealthDeclarationDate || ''}
                    />
                    <Controls.DatePicker
                        label="תאריך הדרכה"
                        name="trainingDate"
                        value={values.trainingDate || new Date()}
                        onChange={handleInputChange}
                        error={errors.trainingDate || ''}
                    />
                    <Controls.Input
                        label="ארץ"
                        name="country"
                        value={values.country || ''}
                        onChange={handleInputChange}
                        error={errors.country || ''}
                    />
                </Grid>
            </Grid>
        </Form>
    )
    
}
