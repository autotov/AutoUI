import React, { useState, useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../forms/useForm';
import Drivers from '../Drivers';


export default function SelectDriverForm(props) {
    const { closeForm, setSelectedID, setSelectedName } = props
    const [runGetDrivers, setRunGetDrivers] = useState([true]);

    const handleSubmit = e => {
        e.preventDefault()
        
    }
    
    return (
        <Form onSubmit={handleSubmit}>
            <div>
                <Drivers 
                    runGetDrivers={runGetDrivers}
                    setRunGetDrivers={setRunGetDrivers}
                    enableEdit={false}
                    setSelectedID={setSelectedID}
                    setSelectedName={setSelectedName}
                    closeDForm={closeForm}
                />
                <Controls.Button
                    text="ביטול"
                    color="default"
                    onClick={closeForm} />
            </div>
        </Form>
    )
    
}
