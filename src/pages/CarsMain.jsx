import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { useEffect, useState } from "react";
import { Grid, } from '@material-ui/core';
import Cars from '../components/Cars';
import Drivers from '../components/Drivers';
import Controls from "../components/controls/Controls";
import { useStateContext } from '../contexts/ContextProvider';
import { useNavigate, Navigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const postSetCompany = async (companyOptions) => {
  let setJson = JSON.stringify(companyOptions);
  const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: setJson
  };

  const resp = await fetch('/user/set/company', requestOptions);
  const status = await resp.status;
  console.log("response resp="+resp)
  console.log("response status="+status)
}

/** MAIN FUNCTION */
const CarsMain = (props) => {
  const [runGetCars, setRunGetCars] = useState([true]);
  const [runGetDrivers, setRunGetDrivers] = useState([true]);
  const [companyOptions, setCompanyOptions] = useState();
  const [isErrorStatus, setIsErrorStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState();
  const { currentColor, companyValue, setCompanyValue, isLogin, setIsLogin } = useStateContext();

  let data = sessionStorage.getItem("userData");

  console.log("data="+data)
  console.log("isLogin="+isLogin)
  if(data == undefined || data == null || data == "" || data == "{}") {
    return <Navigate to="/login" replace />;
  }

  const dataObj = JSON.parse(data);
  if(companyOptions == undefined) {
    if(dataObj.companiesNames == undefined || dataObj.companiesNames.length == 0) {
      return <Navigate to="/login" replace />;
    }
    console.log("CarsMain companiesNames="+JSON.stringify(dataObj.companiesNames));
    setCompanyOptions(dataObj.companiesNames);
    //setCompanyValue(dataObj.currentCompany)
  }
  
  console.log("CarsMain companyValue="+companyValue);
  console.log("CarsMain companyOptions="+companyOptions);
  if(companyOptions == undefined) {
    console.log("Company details not exists - exit")
    return (<div></div>);
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    dataObj.currentCompany = value;
    sessionStorage.setItem("userData", JSON.stringify(dataObj));
    setCompanyValue(value)
    postSetCompany(value)
    setRunGetCars([true])
    setRunGetDrivers([true])
  }

  console.log("currentColor="+currentColor)
  let companyItem = companyOptions[companyValue-1].company;
  return (
    <div dir="rtl" className="font-weight: 700; " >
      { isErrorStatus ? (
      <Stack display="flex"  spacing={20} dir="ltr" direction='column-reverse' justifyContent="center" alignItems="center">
        <Alert severity={isErrorStatus} onClose={() => {setIsErrorStatus(false); setErrorMsg("")}} dir="ltr">{errorMsg}</Alert>
      </Stack>
      ): (<div></div>)}
      <div className="m-3 md:m-5 mt-5 p-0 md:p-5 bg-white rounded-3xl">
        <Grid container>
          <div className='text-xl text-blue-400'>{companyItem.name}</div>
        </Grid>
        
      </div>

      <Cars 
        runGetCars={runGetCars}
        setRunGetCars={setRunGetCars}
        setIsErrorStatus={setIsErrorStatus}
        setErrorMsg={setErrorMsg}
      />

      < Drivers 
        runGetDrivers={runGetDrivers}
        setRunGetDrivers={setRunGetDrivers}
        enableEdit={true}
        setIsErrorStatus={setIsErrorStatus}
        setErrorMsg={setErrorMsg}
      />
    </div>
  );

};
export default CarsMain;

/*
<Grid item xs={4}>
            <Controls.Select
                label="חברה"
                name="company"
                value={companyValue}
                options={companyOptions}
                onChange={handleInputChange}
              />
          </Grid>
*/