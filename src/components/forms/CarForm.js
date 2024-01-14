import React, { useState, useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../forms/useForm';
import SelectDriverDialog from './SelectDriverDialog';
import SelectDriverForm from './SelectDriverForm';
import Popup from '../popup/Popup';


const toolTypeList = [
    { id: 'רכב', title: 'רכב' },
    { id: 'משאית', title: 'משאית' },
    { id: 'אחר', title: 'אחר' },
]

const yesNoOptions = [
    { id: 'כן', title: 'כן' },
    { id: 'לא', title: 'לא' },
]

const fuelTypeOptions = [
    { id: '95', title: '95' },
    { id: '98', title: '98' },
    { id: 'סולר', title: 'סולר' },
]

const locateCompanyOptions = [
    { id: 'איתורן', title: 'איתורן' },
    { id: 'פויינטר', title: 'פויינטר' },
]

const ownershipOptions = [
    { id: 'פרטי', title: 'פרטי' },
    { id: 'ליסינג', title: 'ליסינג' },
]

const businessOptions = [
    { id: 'קניה', title: 'קניה' },
    { id: 'השכרה', title: 'השכרה' },
    { id: 'ליסינג', title: 'ליסינג' },
]

const initialFValues = {
    index: 0,
    license: '',
    status: '',
    messages: '',
    driverId: '',
    driverName: '',
    phone: '',
    cellPhone: '',
    licenseDate: new Date(),
    HealthDeclarationDate: new Date(),
    kmNextTipul: 0,
    kmNextTipulStatus: '',
    toolType: 'רכב',
    carType: '',
    carCreateCountry: '',
    carSubType: '',
    weight: '',
    carCreateYear: '',
    currentKM: '',
    licenseDate: new Date(),
    licenseDateStatus: '',
    insurance: '',
    insuranceHova: new Date(),
    insuranceHovaStatus: '',
    insuranceSelishi: new Date(),
    insuranceSelishiStatus: '',
    breaksHalfYear: new Date(),
    breaksHalfYearStatus: '',
    technograph: new Date(),
    technographStatus: '',
    engineerApproval: new Date(),
    engineerApprovalStatus: '',
    winterReview: new Date(),
    winterReviewStatus: '',
    leadLicense: new Date(),
    leadLicenseStatus: '',
    labTest: new Date(),
    labTestStatus: '',
    department: '',
    tollRoad: '',
    dalkan: '',
    fuelType: '',
    startCode: '',
    locateCompany: '',
    comments: '',
    ownership: '',
    business: '',
    leasingStartDate: new Date(),
    leasingEndDate: new Date(),
    leasingEndDateStatus: ''
}

export default function CarForm(props) {
    const { addOrEdit, recordForEdit, closeForm, addCar } = props

    const [openSelectDriverDialog, setOpenSelectDriverDialog] = useState(false);
    
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('license' in fieldValues)
            temp.license = fieldValues.license ? "" : "חייב למלא שדה זה"
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
        console.log("e="+e)
        e.preventDefault()
        if (validate()) {
            addOrEdit(values, resetForm, addCar);
        }
    }

    useEffect(() => {
        if (recordForEdit != null)
            setValues({
                ...recordForEdit
            })
    }, [recordForEdit])

    const [drecordForEdit, setDrecordForEdit] = useState();
    const [openPopup, setOpenPopup] = useState(false);

    const [selectedID, setSelectedID] = useState();
    const [selectedName, setSelectedName] = useState();

    useEffect(() => {
        if (selectedID != null) {
            values.driverId = selectedID
        }
    }, [selectedID])

    useEffect(() => {
        if (selectedName != null) {
            values.driverName = selectedName
        }
    }, [selectedName])

    const closeDForm = () => {
        setOpenPopup(false)
    }

    const openInPopup = item => {
        setOpenPopup(true)
    }

    const handleSearchClick = () => {
        setOpenPopup(true);
    }
   
    return (
        <div>
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={4}>
                    <Controls.Input
                        name="department"
                        label="מחלקה"
                        value={values.department || ''}
                        onChange={handleInputChange}
                        error={errors.department || ''}
                    />
                    <Controls.Select
                        name="tollRoad"
                        label="כביש אגרה"
                        value={values.tollRoad || 'כן'}
                        onChange={handleInputChange}
                        error={errors.tollRoad || ''}
                        options={yesNoOptions}
                    />
                    <Controls.Select
                        name="dalkan"
                        label="דלקן"
                        value={values.dalkan || 'כן'}
                        onChange={handleInputChange}
                        error={errors.dalkan || ''}
                        options={yesNoOptions}
                    />
                    <Controls.Select
                        name="fuelType"
                        label="סוג דלק"
                        value={values.fuelType || '98'}
                        onChange={handleInputChange}
                        error={errors.fuelType || ''}
                        options={fuelTypeOptions}
                    />
                    <Controls.Select
                        name="locateCompany"
                        label="חברת איתור"
                        value={values.locateCompany || 'איתורן'}
                        onChange={handleInputChange}
                        error={errors.locateCompany || ''}
                        options={locateCompanyOptions}
                    />
                    <Controls.Input
                        label="הערות"
                        name="comments"
                        value={values.comments || ''}
                        onChange={handleInputChange}
                        error={errors.comments || ''}
                    />
                    <Controls.Select
                        label="בעלות"
                        name="ownership"
                        value={values.ownership || 'פרטי'}
                        onChange={handleInputChange}
                        error={errors.ownership || ''}
                        options={ownershipOptions}
                    />
                    <Controls.Select
                        label="סוג עסקה"
                        name="business"
                        value={values.business || 'קניה'}
                        onChange={handleInputChange}
                        error={errors.business || ''}
                        options={businessOptions}
                    />
                    <Controls.DatePicker
                        label="תחילת ליסינג"
                        name="leasingStartDate"
                        value={values.leasingStartDate || new Date()}
                        onChange={handleInputChange}
                        error={errors.leasingStartDate || ''}
                    />
                    <Controls.DatePicker
                        label="מועד סיום ליסינג"
                        name="leasingEndDate"
                        value={values.leasingEndDate || new Date()}
                        onChange={handleInputChange}
                        error={errors.leasingEndDate || ''}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Controls.DatePicker
                        label="תאריך רשיון רכב"
                        name="licenseDate"
                        value={values.licenseDate || new Date()}
                        onChange={handleInputChange}
                        error={errors.licenseDate || ''}
                    />
                    <Controls.DatePicker
                        label="ביטוח"
                        name="insurance"
                        value={values.insurance || new Date()}
                        onChange={handleInputChange}
                        error={errors.insurance || ''}
                    />
                    <Controls.DatePicker
                        label="ביטוח חובה"
                        name="insuranceHova"
                        value={values.insuranceHova || new Date()}
                        onChange={handleInputChange}
                        error={errors.insuranceHova || ''}
                    />
                    <Controls.DatePicker
                        label="ביטוח צד ג'"
                        name="insuranceSelishi"
                        value={values.insuranceSelishi || new Date()}
                        onChange={handleInputChange}
                        error={errors.insuranceSelishi || ''}
                    />
                    <Controls.DatePicker
                        label="בלמים חצי שנתי"
                        name="breaksHalfYear"
                        value={values.breaksHalfYear || new Date()}
                        onChange={handleInputChange}
                        error={errors.breaksHalfYear || ''}
                    />
                    <Controls.DatePicker
                        label="טכוגרף"
                        name="technograph"
                        value={values.technograph || new Date()}
                        onChange={handleInputChange}
                        error={errors.technograph || ''}
                    />
                    <Controls.DatePicker
                        label="אישור מהנדס"
                        name="engineerApproval"
                        value={values.engineerApproval || new Date()}
                        onChange={handleInputChange}
                        error={errors.engineerApproval || ''}
                    />
                    <Controls.DatePicker
                        label="ביקורת חורף"
                        name="winterReview"
                        value={values.winterReview || new Date()}
                        onChange={handleInputChange}
                        error={errors.winterReview || ''}
                    />
                    <Controls.DatePicker
                        label="רישיון מוביל"
                        name="leadLicense"
                        value={values.leadLicense || new Date()}
                        onChange={handleInputChange}
                        error={errors.leadLicense || ''}
                    />
                    <Controls.DatePicker
                        label="בדיקת מעבדה"
                        name="labTest"
                        value={values.labTest || new Date()}
                        onChange={handleInputChange}
                        error={errors.labTest || ''}
                    />
                    <Controls.Input
                        label="שנת יצור"
                        name="carCreateYear"
                        value={values.carCreateYear || ''}
                        onChange={handleInputChange}
                        error={errors.carCreateYear || ''}
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
                        label="מספר רישוי"
                        name="license"
                        value={values.license || ''}
                        onChange={handleInputChange}
                        error={errors.license || ''}
                        disabled={!addCar}
                    />
                    
                    <Controls.CustomizedInputBase
                        label=".ת.ז נהג"
                        name="driverIdSel"
                        value={values.driverId || ''}
                        onChange={handleInputChange}
                        error={errors.driverId || ''}
                        onSearchClick={handleSearchClick}
                        disabled={true}
                    />
                    <Controls.Input
                        label="שם הנהג"
                        name="driverName"
                        value={values.driverName || ''}
                        onChange={handleInputChange}
                        error={errors.driverName || ''}
                        disabled={true}
                    />
                    
                    <Controls.Input
                        label="ק'מ עדכני"
                        name="currentKM"
                        value={values.currentKM || ''}
                        onChange={handleInputChange}
                        error={errors.currentKM || ''}
                    />
                    <Controls.Input
                        label="ק'מ טיפול הבא"
                        name="kmNextTipul"
                        value={values.kmNextTipul || ''}
                        onChange={handleInputChange}
                        error={errors.kmNextTipul || ''}
                    />
                    <Controls.Select
                        label="סוג כלי"
                        name="toolType"
                        value={values.toolType || 'רכב'}
                        onChange={handleInputChange}
                        error={errors.toolType || ''}
                        options={toolTypeList}
                    />
                    <Controls.Input
                        label="סוג רכב"
                        name="carType"
                        value={values.carType || ''}
                        onChange={handleInputChange}
                        error={errors.carType || ''}
                    />
                    <Controls.Input
                        label="תוצר (ארץ)"
                        name="carCreateCountry"
                        value={values.carCreateCountry || ''}
                        onChange={handleInputChange}
                        error={errors.carCreateCountry || ''}
                    />
                    <Controls.Input
                        label="דגם"
                        name="carSubType"
                        value={values.carSubType || ''}
                        onChange={handleInputChange}
                        error={errors.carSubType || ''}
                    />
                    <Controls.Input
                        label="משקל"
                        name="weight"
                        value={values.weight || ''}
                        onChange={handleInputChange}
                        error={errors.weight || ''}
                    />
                </Grid>  
            </Grid>          
        </Form>

        <Popup
            openPopup={openPopup}
            setOpenPopup={openInPopup} 
            setClose={closeDForm}>
            <SelectDriverForm
                closeForm={closeDForm}
                setSelectedID={setSelectedID}
                setSelectedName={setSelectedName}
            />
        </Popup>
        </div>
    )
}
