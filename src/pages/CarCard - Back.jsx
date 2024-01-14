import * as React from 'react';
import { useEffect, useState } from "react";
import { GrEdit } from 'react-icons/gr';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { CarUserProfile } from '../components'
import  CustomizedDialogs from '../components/popup/dialog.js'
import RegistrationForm from '../components/popup/index.js'
import useFetch from '../data/useFetch'
import { AiFillCar } from "react-icons/ai";
import { FaArrowLeft } from "react-icons/fa";
import { medicalproBranding, recentTransactions, weeklyStats, dropdownData } from '../data/structures';
import { useStateContext } from '../contexts/ContextProvider';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { useParams } from "react-router-dom";
import FileUpload from "react-material-file-upload";
import { Button } from '@material-ui/core';
import { GrDocumentUpdate } from "react-icons/gr";
import { CarDocs } from '../components/CarDocs';
import AddFileForm from '../components/forms/AddFileForm';
import Popup from '../components/popup/Popup'

const styles = {
    paper: {
      height: 140,
      width: 100,
      backgroundColor: "black"
    }
  };

const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent id="time" fields={{ text: 'Time', value: 'Id' }} style={{ border: 'none', color: (currentMode === 'Dark') && 'white' }} value="1" dataSource={dropdownData} popupHeight="220px" popupWidth="120px" />
  </div>
);

function sleep(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
}

const CarCard = () => {
    const { currentColor, currentMode, handleClick, isClicked } = useStateContext();
    const [value, setValue] = React.useState('Controlled');
    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const params = useParams(); 
    const { data, loading, error } = useFetch(`/car/` + params.id);

    console.log("Car " + params.id + "; data="+JSON.stringify(data))

    const [files, setFiles] = useState([]);
    const [runGetCarDocs, setRunGetCarDocs] = useState([true]);
    const [fileToAdd, setFileToAdd] = useState(false);

    const [openPopup, setOpenPopup] = useState(false);
    const openInPopup = item => {
        setOpenPopup(true)
      }
    const closeAddFileForm = () => {
        setOpenPopup(false)
    }
    const addFileDialog = () => {
        if (!files || files == undefined || !files[0]) {
            console.log("No file")
            return;
        }
        setOpenPopup(true)
    }

    const addFile = (values, fileArr) => {
        if (!files || files == undefined || !files[0]) {
            console.log("No file")
            return;
        }

        if(values.docType == '') {
            values.docType = 'רשיון'
            console.log(('docType='+ values.docType))
        } else if(values.docType == 'אחר') {
            values.docType = values.otherType
        }
        var dataFile = new FormData()
        dataFile.append('name', values.name)
        dataFile.append('type', values.docType)
        dataFile.append('carId', params.id)
        dataFile.append('file', files[0])
        
        fetch('/upload/car/doc', {
            method: 'POST',
            body: dataFile,
        })
        .then((res) =>  console.log("res="+res))
        .then((respData) => {console.log("respData"+respData); sleep(2500).then(setRunGetCarDocs([true])).then(closeAddFileForm())})
        .catch((err) => console.error("err"+err));
    }

    const sendDeleteCar = (license) => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        };

        fetch('/car/'+license+"/delete", requestOptions)
            .then(data => {
                if(data.status < 300) {
                    window.location.href='/carsmain'
                } 
            });
    }

    return (
        <div className='mt-1'>
            <div className="flex flex-wrap lg:flex-nowrap justify-end">
                <div className="flex justify-start">
                    <div className="w-600 rounded-2xl p-6 m-3 justify-start dark:text-gray-200">
                        <button
                            type="button"
                            className="text-2xl opacity-0.9 border-4 text-black hover:drop-shadow-xl rounded-full p-4 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg" 
                            onClick={ event =>  window.location.href='/carsmain'}>
                            <FaArrowLeft />
                        </button>
                    </div>
                </div>
                {isClicked.carUserProfile && (<CarUserProfile />)}
                <div className="flex flex-wrap justify-end">
                    <div className="w-600 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
                        <div className="flex justify-end">
                            <div className="flex items-end gap-10 rounded-2xl">
                                <div >
                                    <div className="flex items-end">
                                        <p className="text-xs text-center cursor-pointer hover:drop-shadow-xl font-semibold rounded-lg w-24 bg-orange-400 py-0.5 px-2 text-gray-200"
                                        onClick={() => handleClick('carUserProfile')}>
                                            {data?.driverName}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-end px-10">
                                    <p className="text-xl font-semibold">נהג</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="text-2xl opacity-0.9 border-4 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg hover:drop-shadow-xl rounded-full p-4 " >
                                <GrEdit />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap justify-end">
                    <div className="w-600 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
                        <div className="flex justify-end">
                            <div className="flex items-end gap-10 rounded-2xl">
                                <div className="flex items-end bg-white dark:text-gray-200 dark:bg-secondary-dark-bg">
                                    <AiFillCar size="2em"/>
                                </div>
                                <div className="flex items-end">
                                    <p className="text-xs text-center cursor-pointer hover:drop-shadow-xl font-semibold rounded-lg w-24 bg-orange-400 py-0.5 px-2 text-gray-200">
                                        {params.id}
                                    </p>
                                </div>
                                <div className="flex items-end">
                                    <p className="text-xl font-semibold">כרטיס רכב</p>
                                </div>
                                <button
                                    type="button"
                                    className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg text-2xl opacity-0.9 border-4 hover:drop-shadow-xl rounded-full p-4" >
                                    <GrEdit />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end gap-6 border-b-1 border-color mt-6">
                            {medicalproBranding.data.map((item) => (
                            <div key={item.title} className="border-r-1 border-color pr-9 pb-2">
                                <p className="text-sm text-center text-gray-600">{item.title}</p>
                                <p className="text-sm text-center ">{item.desc}</p>
                            </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-6 border-b-1 border-color mt-6">
                            {medicalproBranding.car_details.map((item) => (
                            <div key={item.title} className="border-r-1 border-color pr-9 pb-2">
                                <p className="text-sm text-center text-gray-600">{item.title}</p>
                                <p className="text-sm text-center ">{item.desc}</p>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex gap-10 flex-wrap justify-end">
                {isClicked.carUserProfile1 && (<CarUserProfile />)}
                {isClicked.carUserProfile2 && (<CarUserProfile />)}
                {isClicked.loadDoc}
                <div className="flex flex-wrap justify-end">
                    <div className="w-500 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
                        <div className="flex gap-10 justify-end p-2 m-1 d-flex align-items-center justify-content-center">
                            <p className="text-xs text-center lg:flex-nowrap cursor-pointer hover:drop-shadow-xl 
                                    font-semibold rounded-lg w-40 bg-green-400 py-0.5 px-15 h-10"  
                                    onClick={() => handleClick('carUserProfile1')}>
                                מסמכים סרוקים
                            </p>
                        </div>
                        <div className="flex gap-10 justify-end p-2 m-1">
                            <p className="text-xs text-center lg:flex-nowrap cursor-pointer hover:drop-shadow-xl 
                                    font-semibold rounded-lg w-40 bg-green-400 py-0.5 px-10 h-10"
                                    onClick={() => handleClick('carUserProfile2')}>
                                הסבת דוחות
                            </p>
                        </div>
                        <div className="flex gap-10 justify-end p-2 m-1">
                            <p className="text-xs text-center lg:flex-nowrap cursor-pointer hover:drop-shadow-xl 
                                    font-semibold rounded-lg w-40 bg-green-400 py-0.5 px-10 h-10"
                                    onClick={() => handleClick('carUserProfile2')}>
                                הזמנות וחשבוניות
                            </p>
                        </div>
                        <div className="flex gap-10 justify-end p-2 m-1">
                            <p className="text-xs text-center lg:flex-nowrap cursor-pointer hover:drop-shadow-xl 
                                    font-semibold rounded-lg w-40 bg-green-400 py-0.5 px-10 h-10"
                                    onClick={() => handleClick('carUserProfile2')}>
                                נוהל 6
                            </p>
                        </div>
                        <div className="flex gap-10 justify-end p-2 m-1">
                            <p className="text-xs text-center lg:flex-nowrap cursor-pointer hover:drop-shadow-xl 
                                    font-semibold rounded-lg w-40 bg-green-400 py-0.5 px-25 h-10"
                                    onClick={() => handleClick('carUserProfile2')}>
                                תאונות - מעקב דיסיקיות טכנוגרף
                            </p>
                        </div>
                        <div className="flex gap-10 justify-end p-2 m-1">
                            <p className="text-xs text-center lg:flex-nowrap cursor-pointer hover:drop-shadow-xl 
                                    font-semibold rounded-lg w-40 bg-green-400 py-0.5 px-10 h-10"
                                    onClick={() => handleClick('carUserProfile2')}>
                            הערות וליקויים
                            </p>
                        </div>
                        <div className="flex gap-10 justify-end p-2 m-1">
                            <p className="text-xs text-center lg:flex-nowrap cursor-pointer hover:drop-shadow-xl 
                                    font-semibold rounded-lg w-40 bg-green-400 py-0.5 px-10 h-10"
                                    onClick={() => handleClick('carUserProfile2')}>
                                טופס בדיקה
                            </p>
                        </div>
                        <div className="flex gap-10 justify-end p-2 m-1">
                            <p className="text-xs text-center lg:flex-nowrap cursor-pointer hover:drop-shadow-xl 
                                    font-semibold rounded-lg w-40 bg-orange-400 py-0.5 px-10 text-red-600 h-10"
                                    onClick={() => sendDeleteCar(params.id)}>
                                העבר כרטיס לארכיון
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-10 m-4 flex-wrap justify-center">
                    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
                        <div className="flex justify-center items-center gap-2">
                            <p className="text-xl font-semibold">מאפיינים</p>
                        </div>
                        <div className="mt-10 w-72 md:w-400">
                            {recentTransactions.map((item) => (
                            <div key={item.title} className="flex justify-between mt-4">
                                <p className={`text-${item.pcColor}`}>{item.amount}</p>
                                <div className="flex gap-6">
                                    <div>
                                        <div className='flex justify-end'>
                                            <p className="text-md font-semibold">{item.title}</p>
                                        </div>
                                        <div className='flex justify-end'>
                                            <p className="text-sm text-gray-400">{item.desc}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        style={{
                                        color: item.iconColor,
                                        backgroundColor: item.iconBg,
                                        }}
                                        className="text-2xl rounded-lg p-2 hover:drop-shadow-xl"
                                    >
                                        {item.icon}
                                    </button>
                                </div>
                            </div>
                            ))}
                            </div>
                        </div>
                </div>
                
                <div className="flex gap-10 m-4 flex-wrap justify-center">
                    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
                        <div className="flex justify-center items-center gap-2">
                            <p className="text-xl font-semibold">תוקף מסמכי רכב</p>
                        </div>
                        <div className="mt-10 w-72 md:w-400">
                            {weeklyStats.map((item) => (
                            <div key={item.title} className="flex justify-between mt-4">
                                
                                <TextField 
                                    variant="standard"
                                    color="warning"
                                    value={item.amount}
                                    focused
                                />
                                
                                <div className="flex gap-6">
                                    <div>
                                        <div className='flex justify-end'>
                                            <p className="text-md font-semibold">{item.title}</p>
                                        </div>
                                        <div className='flex justify-end'>
                                            <p className="text-sm text-gray-400">{item.desc}</p>
                                        </div>
                                    </div>
                                        <button
                                            type="button"
                                            style={{
                                            color: item.iconColor,
                                            backgroundColor: item.iconBg, }}
                                            className="text-2xl rounded-lg p-2 hover:drop-shadow-xl"
                                        >
                                            {item.icon}
                                        </button>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div>
                </div>
            </div>

            <div className="flex gap-10 flex-wrap justify-end">
                <div className="flex gap-10 m-4 flex-wrap justify-center">
                    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
                        <div className="mt-10 w-72 md:w-400">
                            <FileUpload value={files} onChange={setFiles} 
                            title={"גרור את הקובץ או לחץ לבחירת הקובץ"}
                            buttonText={'בחירת קובץ'}
                            />
                        </div>
                        <div className="flex gap-10 justify-end p-2 m-1 d-flex align-items-center justify-content-center">
                            <p className="text-xs text-center lg:flex-nowrap cursor-pointer hover:drop-shadow-xl 
                                    font-semibold rounded-lg w-40 bg-green-400 py-0.5 px-15 h-10"  
                                    onClick={() => addFileDialog()}>
                                הוסף מסמך
                            </p>
                        </div>
                        <div>
                        
                        </div>
                        
                    </div>  
                </div>

                <div className="flex gap-10 m-4 flex-wrap justify-center">
                    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
                        <div className="flex justify-center items-end gap-2">
                            <p className="text-xl font-semibold">מסמכים</p>
                        </div>
                        <CarDocs
                            runGetCarDocs={runGetCarDocs} 
                            setRunGetCarDocs={setRunGetCarDocs}
                            setAddDoc={setFileToAdd}
                            carId={params.id}
                        />
                    </div>  
                </div>     
            </div> 

            <Popup
                title={"הוספת קובץ"}
                openPopup={openPopup}
                setOpenPopup={openInPopup} 
                setClose={closeAddFileForm}>
                <AddFileForm
                    addFile={addFile} 
                    closeForm={closeAddFileForm}
                    fileToAdd={fileToAdd}/>
            </Popup>
        </div>
    );
};


export default CarCard

/*
                        <Button
                            color='primary'
                            onClick={() => { addFileDialog() }}>
                            <GrDocumentUpdate fontSize="large" />
                            הוסף מסמך
                        </Button>

                </div>  

                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">

*/