import React, {useEffect, useContext, useState} from "react"
import Controls from '../components/controls/Controls'; 
import { useForm } from "../components/forms/useForm"
import { useStateContext } from '../contexts/ContextProvider';
import { useNavigate } from "react-router-dom";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const initialFValues = {
    username: '',
    password: ''
}

export default function (props) {

    const { companyValue, setCompanyValue, companyOptions, setCompanyOptions, isLogin, setIsLogin } = useStateContext();

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('username' in fieldValues)
            temp.username = fieldValues.username ? "" : "חייב למלא שם משתמש"
            if ('password' in fieldValues)
            temp.password = fieldValues.password ? "" : "חייב למלא סיסמא"
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

    const doLogin = () => {
        if (validate()) {
            postLogin()
        }
    }

    const navigate = useNavigate();
    useEffect(() => {
        console.log("companyOptions " + companyOptions)
        if(companyOptions == undefined) {
            setIsLogin(false);
        } else {
            console.log("navigate " + isLogin)
            if (isLogin == true) {
                navigate("/companies");
            }
        }
    }, [isLogin]);

    const [respStatus, setRespStatus] = useState(0);
    const postLogin = async () => {
        let loginJson = JSON.stringify(values);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: loginJson
        };

        const resp = await fetch('/login', requestOptions);
        const data = await resp.json();
        const status = await resp.status;
        console.log("response resp="+resp)
        console.log("response data="+JSON.stringify(data))
        console.log("response companiesNames="+data.companiesNames)
        console.log("response status="+status)

        if(status < 300) {
            console.log("response status is OK " + data)
            setCompanyOptions(data.companiesNames);
            setCompanyValue('1');
            sessionStorage.setItem("userData", JSON.stringify(data));
            setIsLogin(true);
        } 
    }

    return (
        <div className="Auth-form-container">
        <form className="Auth-form">
            <div className="Auth-form-content">
            <h3 className="Auth-form-title">כניסה למערכת</h3>
            <div className="Auth-form-content mt-3">
                    <Controls.Input
                        name="username"
                        label="שם משתמש"
                        value={values.username || ''}
                        onChange={handleInputChange}
                        error={errors.username || ''}
                        fullWidth={true}
                    />
            </div>
            <div className="Auth-form-content mt-3">
            <Controls.Input
                        name="password"
                        label="סיסמא"
                        value={values.password || ''}
                        onChange={handleInputChange}
                        type="password"
                        error={errors.password || ''}
                        fullWidth={true}
                    />
            </div>
            
            <div className="Auth-form-content gap-2 mt-3">
                <Controls.Button
                    text="כניסה"
                    fullWidth={true}
                    width='100px'
                    onClick={doLogin}
                    />
            </div>
            <p className="forgot-password text-right mt-2">
                ? שכחת את <a href="#">הסיסמא</a> 
            </p>
            </div>
        </form>
        </div>
    );
}