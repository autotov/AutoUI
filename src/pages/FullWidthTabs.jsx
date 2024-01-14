import * as React from 'react';
import { useState } from "react";
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { medicalproBranding, recentTransactions, weeklyStats, dropdownData } from '../data/structures';
import { FiShoppingBag, FiEdit, FiPieChart, FiBarChart, FiCreditCard, FiStar, FiShoppingCart } from 'react-icons/fi';
import TextField from '@mui/material/TextField';
import Moment from 'moment';
import { CarDocs } from '../components/CarDocs';
import Popup from '../components/popup/Popup'
import AddFileForm from '../components/forms/AddFileForm';
import { Button } from '@material-ui/core';
import { RiPlayListAddLine } from "react-icons/ri";
import Controls from '../components/controls/Controls';

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

function getDateValues(fieldKey, textColor, textValue, buttonColor, buttonBackgroundColor, icon, title, addFileDialog){

  
  const [values, setValues] = useState(initialFValues);
  const [errors, setErrors] = useState({});

  const handleInputChange = e => {
      const { name, value } = e.target
      setValues({
          ...values,
          [name]: value
      })
      if (validateOnChange)
          validate({ [name]: value })
  }

  var disable = false;
  if(addFileDialog == null){
    disable = true;
  }
  /*
  <TextField 
                variant="standard"
                color={textColor}
                value={textValue}
                dir='rtl'
                
            />
            */
  
    return (
        <div key={fieldKey} className="flex justify-between mt-3">             
            

            <div>
              <Controls.DatePicker
                  name="licenseDate"
                  value={textValue || new Date()}
                  onChange={handleInputChange}
                  //error={errors.licenseDate || ''}
              />
              
            </div>
            
            <div className="flex gap-6">
                
                <div>
                    <div className='flex justify-end'>
                        <p className="text-md font-semibold">{title}</p>
                    </div>
                </div>
                
                <button
                    type="button"
                    style={{
                    color: buttonColor,
                    backgroundColor: buttonBackgroundColor, }}
                    className="text-2xl rounded-lg p-2 hover:drop-shadow-xl"
                    disabled={disable}
                    onClick={() => addFileDialog()}
                >
                    {icon}
                </button>
            </div>
        </div>
    );
}

function sleep(delay: number) {
  return new Promise( res => setTimeout(res, delay) );
}

function formatDate(argDate) {
    if(argDate == undefined || argDate == null || argDate == '') {
        return '';
    }
    return (Moment(argDate)).format('DD/MM/YYYY');
  }

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps, doAction) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      //onClick={(doAction != undefined) ? {doAction}}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{value === index && children}</Typography>
        </Box>
      )}
    </div>
  );
}

function focusTab(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs(props) {
  const {  data } = props;
  const [runGetCarDocs, setRunGetCarDocs] = useState([true]);

  const [fileToAdd, setFileToAdd] = useState(false);  
  const [files, setFiles] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const openInPopup = item => {
      setOpenPopup(true)
    }
  const closeAddFileForm = () => {
      setOpenPopup(false)
  }
  const addFileDialog = () => {
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
  dataFile.append('carId', data.license)
  dataFile.append('file', files[0])
  
  fetch('/upload/car/doc', {
      method: 'POST',
      body: dataFile,
  })
  .then((res) =>  console.log("res="+res))
  .then((respData) => {console.log("respData"+respData); sleep(2500).then(setRunGetCarDocs([true])).then(closeAddFileForm())})
  .catch((err) => console.error("err"+err));

  setFiles([]);
}
  
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    console.log("change index="+index)
    setValue(index);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', width: 1200 }}>
      <AppBar position="static" dir='rtl'>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="תוקף מסמכים" {...focusTab(0)} />
          <Tab label="מאפיינים" {...focusTab(1)} />
          <Tab label="מסמכים סרוקים" {...focusTab(2)} />
          <Tab label="הסבת דוחות" {...focusTab(3)} />
          <Tab label="הזמנות וחשבוניות" {...focusTab(4)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        
        <TabPanel value={value} index={0} dir={theme.direction}>
                <div className="flex gap-10 m-4 flex-wrap justify-center">
                    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
                        <div className="mt-10 w-72 md:w-400">
                            
                            {getDateValues('licenseDate', 'warning', formatDate(data.licenseDate), 'red-600', 'rgb(254, 201, 15)', <FiStar/>, 'רישוי'), null}
                            {getDateValues('insuranceHova', 'warning', formatDate(data.insuranceHova), 'red-600', 'rgb(254, 201, 15)', <FiStar/>, 'ביטוח', null)}
                            {getDateValues('leadLicense', 'warning', formatDate(data.leadLicense), 'red-600', 'rgb(254, 201, 15)', <FiStar/>, 'רישיון מוביל', null)}
                            {getDateValues('breaksHalfYear', 'warning', formatDate(data.breaksHalfYear), 'red-600', 'rgb(254, 201, 15)', <FiStar/>, 'בלמים', null)}
                            {getDateValues('technograph', 'warning', formatDate(data.technograph), 'red-600', 'rgb(254, 201, 15)', <FiStar/>, 'כיול טכוגרף', null)}
                            {getDateValues('winterReview', 'warning', formatDate(data.winterReview), 'red-600', 'rgb(254, 201, 15)', <FiStar/>, 'ביקורת חורף', null)}
                            {getDateValues('engineerApproval', 'warning', formatDate(data.engineerApproval), 'red-600', 'rgb(254, 201, 15)', <FiStar/>, 'אישור מהנדס', null)}
                            {getDateValues('labTest', 'warning', formatDate(data.labTest), 'red-600', 'rgb(254, 201, 15)', <FiStar/>, 'בדיקת מעבדה', null)}
                        </div>
                    </div>
                </div>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
                <div className="flex gap-10 m-4 flex-wrap justify-center">
                    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
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
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="flex gap-10 m-4 flex-wrap justify-center">
              <div className="flex flex-wrap lg:flex-nowrap justify-start">
                <Button
                    color='primary'
                    onClick={() => addFileDialog()}>
                    <RiPlayListAddLine fontSize="large" />
                    הוספת מסמך
                </Button>
              </div>
              <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
                  <CarDocs
                      runGetCarDocs={runGetCarDocs} 
                      setRunGetCarDocs={setRunGetCarDocs}
                      setAddDoc={setFileToAdd}
                      carId={data.license}
                  />
              </div>
            </div>    
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
        </TabPanel>
        <TabPanel value={value} index={4} dir={theme.direction}>
        </TabPanel>
      </SwipeableViews>

      <Popup
        title={"הוספת מסמך"}
        openPopup={openPopup}
        setOpenPopup={openInPopup} 
        setClose={closeAddFileForm}>
        <AddFileForm
            addFile={addFile} 
            closeForm={closeAddFileForm}
            fileToAdd={fileToAdd}
            files={files}
            setFiles={setFiles}/>
      </Popup>
    </Box>
  );
}