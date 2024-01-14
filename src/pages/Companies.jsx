import React, { useMemo } from 'react';
import { useEffect, useState } from "react";
import MaterialReactTable from 'material-react-table';
import { Typography  } from '@mui/material';
import { Box, Button } from '@material-ui/core';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {  FaRegEdit } from "react-icons/fa";
import { MdOutlineHomeWork } from "react-icons/md";
import Popup from '../components/popup/Popup'
import CompanyForm from '../components/forms/CompanyForm'; 
import Moment from 'moment';
import { ExportToCsv } from 'export-to-csv';
import { CircularProgress } from '@material-ui/core';
import { tableLocalization } from '../data/structures';
import { useNavigate } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';

function getCompaniesList(setCompanies, runGetCompanies, setRunGetCompanies ) {
  useEffect(() => {
    const dataFetch = async () => {
      if(runGetCompanies[0]) {
        const companies = await (
          await fetch(
            "/tenant/companies"
          )
        ).json();

        setCompanies(companies);
        setRunGetCompanies([false]);
      }
    };

    dataFetch();
  }, runGetCompanies);
}

function formatDate(argDate) {
  if(argDate == undefined || argDate == ''){
    return '';
  }
  return (Moment(argDate)).format('DD/MM/YYYY');
}

function sleep(delay: number) {
  return new Promise( res => setTimeout(res, delay) );
}

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

//******************************/
export const Companies = () => {

  const [ runGetCompanies, setRunGetCompanies ] = useState([true]);
  const [companies, setCompanies] = useState();

  const [recordForEdit, setRecordForEdit] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("הוספת חברה");
  const [popupAction, setPopupAction] = useState("add");

  const [toCarsMain, setToCarsMain] = React.useState(false);
  const [navToCarsMain, setNavToCarsMain] = React.useState("");

  let data = sessionStorage.getItem("userData");
  if(data == undefined || data == null || data == "" || data == "{}") {
    return <Navigate to="/login" replace />;
  }
  const dataObj = JSON.parse(data);

  const handleInputChange = value => {
    dataObj.currentCompany = value;
    sessionStorage.setItem("userData", JSON.stringify(dataObj));
    postSetCompany(value)

    sleep(2500).then(
      setToCarsMain(true)
    );
  }

  const navigate = useNavigate()
  useEffect(() => {
    if (toCarsMain === true) {
      navigate("/carsmain?id="+navToCarsMain);
    }
  }, [toCarsMain])

  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const handleExportData = () => {
    csvExporter.generateCsv(companies);
  };

  const openDeleteDialog = item => {
    setDeleteTitle("האם למחוק את  " + item.name + "?")
    setRecordForDelete(item)
    setConfirmOpen(true)
  }

  const sendDeleteCompany = (company) => {
    let companyJson = JSON.stringify(company);
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: companyJson
    };

    fetch('/tenant/company/'+company.numberId+"/delete", requestOptions)
        .then(data => {
          if(data.status < 300) {
            setRecordForDelete(null)
          } 
        });
  }

  const deleteCompany = (company) => {
    sendDeleteCompany(company)
  }

  const addOrEdit = (company, resetForm, action, setRunGetCompanies) => {
    if(action == 'add') {
      addCompany(company, resetForm)
    } else {
      updateCompany(company, resetForm)
    }
    setRecordForEdit(null)
    setOpenPopup(false)
    //sleep(1000).then( () => {
      setRunGetCompanies([true])
    //})
  }
  
  const addCompany = (company, resetForm) => {
    let companyJson = JSON.stringify(company);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: companyJson
    };

    fetch('/tenant/company/add', requestOptions)
        .then(data => {
          if(data.status < 300) {
            resetForm()
            setRecordForEdit(null)
            setOpenPopup(false)
          } 
        });
  }

  const updateCompany = (company, resetForm) => {
    let companyJson = JSON.stringify(company);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: companyJson
    };

    fetch('/tenant/company/update', requestOptions)
        .then(data => {
          if(data.status < 300) {
            resetForm()
            setRecordForEdit(null)
            setOpenPopup(false)
          } 
        });
  }

  const closeForm = () => {
    setRecordForEdit(null)
    setOpenPopup(false)
  }

  const openInPopup = item => {
    setRecordForEdit(item)
    setOpenPopup(true)
  }
  
  const columns = useMemo(
    () => [
      { 
        accessorKey: 'name',
        header: 'שם החברה',
        dir: 'rtl',
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              color: 'success.dark',
            }}
          >
            <span>{cell.getValue()}</span>
          </Box>
        ),
      },
      { 
        accessorKey: 'description',
        header: 'ח.פ. / מספר זהות',
        dir: 'rtl',
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              color: 'success.dark',
            }}
          >
            <span>{cell.getValue()}</span>
          </Box>
        ),
      },
      { 
        accessorKey: 'contact',
        header: 'קצין בטיחות',
        dir: 'rtl',
        Cell: ({ cell, row }) => (
          <Tooltip title={(row.original.contactPhone?row.original.contactPhone:"") +" "+ (row.original.contactMail?row.original.contactMail:"")} placement="top-start">
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              color: 'success.dark',
            }}
          >
            <span>{cell.getValue()}</span>
          </Box>
          </Tooltip>
        ),
      },
      { 
        accessorKey: 'manager',
        header: 'מנהל',
        dir: 'rtl',
        Cell: ({ cell, row }) => (
          <Tooltip title={(row.original.managerPhone?row.original.managerPhone:"") +" "+ (row.original.managerMail?row.original.managerMail:"")} placement="top-start">
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              color: 'success.dark',
            }}
          >
            <span>{cell.getValue()}</span>
          </Box>
          </Tooltip>
        ),
      },
      {
        accessorKey: 'licenseDate',
        header: 'תאריך רשיון',
        dir: 'rtl',
        maxSize: 2,
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',

            }}
          >
            <span>{formatDate(cell.getValue())}</span>
          </Box>
        ),
      },
      { 
        accessorKey: 'rishuy',
        header: 'רישוי',
        dir: 'rtl',
        maxSize: 2,
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              width: 2,
              display: 'flex',
              gap: '1rem',
              color: 'success.dark',
            }}
          >
            <span>{cell.getValue()}</span>
          </Box>
        ),
      },
      { 
        accessorKey: 'insurance',
        header: 'ביטוח',
        dir: 'rtl',
        maxSize: 2,
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              color: 'success.dark',
            }}
          >
            <span>{cell.getValue()}</span>
          </Box>
        ),
      },
      { 
        accessorKey: 'driverLicense',
        header: 'רישיון נהג',
        dir: 'rtl',
        maxSize: 2,
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              color: 'success.dark',
            }}
          >
            <span>{cell.getValue()}</span>
          </Box>
        ),
      },
      { 
        accessorKey: 'driverFolder',
        header: 'תיק נהג',
        dir: 'rtl',
        maxSize: 2,
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              color: 'success.dark',
            }}
          >
            <span>{cell.getValue()}</span>
          </Box>
        ),
      }
    ],
    [],
    //end
  );

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };
  
  const csvExporter = new ExportToCsv(csvOptions);

  getCompaniesList(setCompanies, runGetCompanies, setRunGetCompanies)

  if(companies == undefined || runGetCompanies[0]) {
    return(
      <CircularProgress color="secondary" />
    )
  } 

  return (
    <div dir='rtl'>
      <div className="flex flex-wrap lg:flex-nowrap justify-start">
        <Button
            color='primary'
            onClick={() => { setPopupAction("add"); setPopupTitle("הוספת חברה"); openInPopup(null); }}>
            <MdOutlineHomeWork fontSize="large" />
            הוספת חברה
        </Button>
      </div>
      
      <MaterialReactTable
        columns={columns}
        data={companies}
        
        defaultColumn={{
          Cell: ({ cell }) => {
            return <>{cell.getValue()}</>;
          },
        }}

        muiTableBodyRowProps={({ row }) => ({
          onClick: (event) => {
            //console.info(event.target.parentElement.className, row.id);
            console.log("numberId="+row.original.numberId);

            // TODO fix - Uncaught TypeError: event.target.parentElement.className.startsWith is not a function
            if(!event.target.parentElement.className.startsWith('MuiButton')) {
              setNavToCarsMain(row.original.numberId);
              //setToCarsMain(true);
              handleInputChange(row.original.numberId);
            }
          },
          sx: {
            cursor: 'pointer',
          },
        })}
        
        editingMode="row"
        enableColumnOrdering
        enableDensityToggle={false} //density toggle is not compatible with memoization
        enableEditing
        enablePinning
        //enableRowSelection
        enableStickyHeader
        positionGlobalFilter='right'
        positionActionsColumn='first'
        initialState={{ pagination: { pageSize: 20, pageIndex: 0 } }}
        memoMode="cells"
        muiTableContainerProps={{ sx: { maxHeight: '500px' } }}
        positionToolbarAlertBanner="bottom"
        //renderDetailPanel={({ row }) => <div>{row.original.firstName}</div>}
        muiSearchTextFieldProps={{
          placeholder: 'Search All Props',
          sx: { minWidth: '18rem' },
        }}
        renderTopToolbarCustomActions={({ table }) => (
          <Box dir='ltr' className="flex flex-wrap lg:flex-nowrap justify-start" sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }} >
          <Typography component="span" variant="h4">
            חברות בצי הרכב
          </Typography>
        </Box>
        )}

        /*
        renderDetailPanel={({ row }) => (
          <Box dir='rtl' className="flex flex-wrap lg:flex-nowrap justify-end"
            sx={{
              display: 'grid',
              margin: 'auto',
              gridTemplateColumns: '1fr 1fr',
              width: '100%',
            }}
          >
            <Typography>{row.original.messages}</Typography>
          </Box>
        )}
        */

        muiTablePaperProps={{
          elevation: 0,
          sx: {
            borderRadius: '10',
            border: '1px dashed #e0e0e0'
          },
        }}

        displayColumnDefOptions={{
          'mrt-row-actions': {
            header: 'עריכה',
            Cell: ({ row, table }) => (
              <Button 
              onClick={() => {
                //table.setEditingRow(row)
                setPopupAction("edit"); 
                setPopupTitle("עריכת חברה");
                openInPopup(null);
                setRecordForEdit(row.original);
                }
              }
              ><FaRegEdit fontSize="large"/></Button>
            ),
          },
        }}

        localization={{ tableLocalization  }}
      />

      <Popup
          title={popupTitle}
          openPopup={openPopup}
          setOpenPopup={openInPopup} 
          setClose={closeForm} >
          <CompanyForm
              recordForEdit={recordForEdit}
              addOrEdit={addOrEdit} 
              closeForm={closeForm}
              action={popupAction}
              setRunGetCompanies={setRunGetCompanies}/>
      </Popup>
  </div>
  );
};

export default Companies;
