import React, { useMemo } from 'react';
import { useEffect, useState } from "react";
import MaterialReactTable from 'material-react-table';
import { Typography } from '@mui/material';
import { Box, Button } from '@material-ui/core';
import { RiUserAddFill } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Popup from '../components/popup/Popup'
import DriverForm from './forms/DriverForm';
import { useStateContext } from '../contexts/ContextProvider';
import Moment from 'moment';
import { ExportToCsv } from 'export-to-csv';
import { CircularProgress } from '@material-ui/core';
import { tableLocalization } from '../data/structures'

function getDriverList(setDrivers, runGetDrivers, setRunGetDrivers, sessionData) {
  useEffect(() => {
    const dataFetch = async () => {
      if(runGetDrivers[0]) {
        const drivers = await (
          await fetch(
            "/drivers?company="+sessionData.currentCompany
          )
        ).json();

        setDrivers(drivers);
        setRunGetDrivers([false]);
      }
    };

    dataFetch();
  }, runGetDrivers);
}

function formatDate(argDate) {
  return (Moment(argDate)).format('DD/MM/YYYY');
}

function sleep(delay: number) {
  return new Promise( refarshData => setTimeout(refarshData, delay) );
}

//******************************/
export const Drivers = (props) => {

  const { runGetDrivers, setRunGetDrivers, enableEdit, setSelectedID, setSelectedName, closeDForm, setIsErrorStatus, setErrorMsg } = props;
  
  const [drivers, setDrivers] = useState();

  const [recordForEdit, setRecordForEdit] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("הוספת נהג");
  const [addDriver, setAddDriver] = React.useState(false);

  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const handleExportData = () => {
    csvExporter.generateCsv(drivers);
  };

  const refarshData = (resetForm) => {
    console.log("In refarshData")
    resetForm()
    setRecordForEdit(null)
    setOpenPopup(false)
    setRunGetDrivers([true])
  }

  const postDriver = (driver, resetForm, url) => {
    let driverJson = JSON.stringify(driver);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: driverJson
    };

    fetch(url, requestOptions)
        .then(data => {
          if(data.status < 300) {
            console.log("URL="+url)
            setTimeout(refarshData(resetForm), 4500)
          } 
        });
  }

  const postNewDriver = (driver, resetForm) => {
    postDriver(driver, resetForm, "/driver/add")
  }

  const postEditDriver = (driver, resetForm) => {
    postDriver(driver, resetForm, "/driver/update")
  }

  const addOrEdit = (driver, resetForm, addDriver) => {
    if(addDriver == true) {
      postNewDriver(driver, resetForm)
    } else {
      postEditDriver(driver, resetForm)
    }
    
    setRecordForEdit(null)
    setOpenPopup(false)
  }

  const openDeleteDialog = item => {
    setDeleteTitle("האם למחוק את הנהג " + item.license + "?")
    setRecordForDelete(item)
    setConfirmOpen(true)
  }

  const sendDeleteDriver = (driver) => {
    let driverJson = JSON.stringify(driver);
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: driverJson
    };

    fetch('/driver/'+driver.license+"/delete", requestOptions)
        .then(data => {
          if(data.status < 300) {
            setRecordForDelete(null)
            setRunGetDrivers([true])
          } 
        });
  }

  const deleteDriver = (driver) => {
    sendDeleteDriver(driver)
  }

  const closeForm = () => {
    setRecordForEdit(null)
    setOpenPopup(false)
  }

  const openInPopup = item => {
    setRecordForEdit(item)
    setOpenPopup(true)
  }
  
  

  const handelSelect = (row, setSelectedID, setSelectedName) => {
    if(setSelectedID != undefined) {
      setSelectedID(row.getValue("driverId"))
      setSelectedName(row.getValue("name") + " " + row.getValue("lastName"))
      sleep(1000).then(
        closeDForm())
    }
  }
  
  const columns = useMemo(
    () => [
      { 
        accessorKey: 'driverId',
        header: '.ת.ז',
        dir:'rtl',
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              color: row.original.status == 'alarm' ? 'red' : row.original.status == 'warn' ? 'orange' : 'black'
            }}
          >
            <span>{cell.getValue()}</span>
          </Box>
        ),
      },
      { 
        accessorKey: 'name',
        header: 'שם',
        dir:'rtl',
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
            }}
          >
            <span>{cell.getValue()}</span>
          </Box>
        ),
      },
      { accessorKey: 'lastName',
        header: 'שם משפחה',
        dir:'rtl',
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
            }}
          >
            <span>{cell.getValue()}</span>
          </Box>
        ),
      },
      { accessorKey: 'licenseLevel',
        header: 'דרגת רשיון',
        dir:'rtl',
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
            }}
          >
            <span>{cell.getValue()}</span>
          </Box>
        ),
      },
      { accessorKey: 'licenseExpireDate',
        header: 'תוקף',
        dir:'rtl',
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              color: row.original.licenseExpireDateStatus == 'alarm' ? 'red' : row.original.licenseExpireDateStatus == 'warn' ? 'orange' : 'black'
            }}
          >
            <span>{formatDate(cell.getValue())}</span>
          </Box>
        ),
      },
      { accessorKey: 'trainingDate',
        header: 'תאריך הדרכה',
        dir:'rtl',
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              color: row.original.trainingDateStatus == 'alarm' ? 'red' : row.original.trainingDateStatus == 'warn' ? 'orange' : 'black'
            }}
          >
            <span>{formatDate(cell.getValue())}</span>
          </Box>
        ),
      },
      { accessorKey: 'city',
        header: 'עיר', 
        dir:'rtl',
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
            }}
          >
            <span>{cell.getValue()}</span>
          </Box>
        ),
      },
      { accessorKey: 'phoneNumber1',
        header: 'פלאפון',
        dir:'rtl',
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
            }}
          >
            <span>{cell.getValue()}</span>
          </Box>
        ),
      },
      { accessorKey: 'email',
        header: 'מאייל',
        dir:'rtl',
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
            }}
          >
            <span>{cell.getValue()}</span>
          </Box>
        ),
      },
      { accessorKey: 'workPlace',
        header: 'סניף',
        dir:'rtl',
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
            }}
          >
            <span>{cell.getValue()}</span>
          </Box>
        ),
      },
    ],
    [],
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

  let sessionData = sessionStorage.getItem("userData");
  const dataObj = JSON.parse(sessionData);
  getDriverList(setDrivers, runGetDrivers, setRunGetDrivers, dataObj)

  if(drivers == undefined || runGetDrivers[0]) {
    if(!runGetDrivers[0]) {
      setRunGetDrivers([true]);
    }
    return(
      <CircularProgress color="secondary" />
    )
  }

  return (
    <div dir='rtl'>
      {enableEdit ? ( 
      <div className="flex flex-wrap lg:flex-nowrap justify-start">
        <Button
            color='primary'
            onClick={() => { setAddDriver(true); setPopupTitle("הוספת נהג"); openInPopup(null); }}>
            <RiUserAddFill fontSize="large" />
            הוספת נהג
        </Button>
      </div>
      ): (<div></div>)}

      <MaterialReactTable
        columns={columns}
        data={drivers}

        muiTableBodyRowProps={({ row }) => ({
          onClick: (event) => {
            //console.info(event.target.parentElement.className, row.id);
            handelSelect(row, setSelectedID, setSelectedName)
          },
          sx: {
            cursor: 'pointer',
          },
        })}
        
        defaultColumn={{
          Cell: ({ cell }) => {
            if(cell.column.id == 'licenseExpireDate' || cell.column.id == 'trainingDate') {
              const newDate = formatDate(cell.getValue())
              return <>{newDate}</>;
              
            }
            return <>{cell.getValue()}</>;
          },
        }}

        displayColumnDefOptions={{
          'mrt-row-actions': {
            header: 'עריכה',
            Cell: ({ row, table }) => (
              <Button 
              onClick={() => {
                //table.setEditingRow(row)
                setAddDriver(false); 
                setPopupTitle("עריכת נהג"); 
                openInPopup(null);
                setRecordForEdit(row.original);
                }
              }
              ><FaRegEdit fontSize="large" /></Button>
            ),
          },
        }}
        
        editingMode="row"
        enableColumnOrdering
        enableDensityToggle={false}
        enableEditing={true}
        enablePinning
        enableRowSelection={false}
        enableStickyHeader
        initialState={{ pagination: { pageSize: 20, pageIndex: 0 } }}
        memoMode="cells"
        muiTableContainerProps={{ sx: { maxHeight: '500px' } }}
        positionToolbarAlertBanner="bottom"
        renderDetailPanel={({ row }) => <div>{row.original.firstName}</div>}
        renderTopToolbarCustomActions={({ table }) => (
          <Box className="flex flex-wrap lg:flex-nowrap justify-start" sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }} >
          <Typography component="span" variant="h4">
            נהגים
          </Typography>
          
        </Box>
        )}

        renderDetailPanel={({ row }) => (
          <Box

            sx={{
              display: 'grid',
              margin: 'auto',
              gridTemplateColumns: '1fr 1fr',
              width: '100%',
              color: row.original.status == 'alarm' ? 'red' : row.original.status == 'warn' ? 'orange' : 'green'
            }}
          >
            <Typography>{row.original.messages}</Typography>
          </Box>
        )}

        localization={{ tableLocalization  }}
      />

      <Popup
          title={popupTitle}
          openPopup={openPopup}
          setOpenPopup={openInPopup} >
          <DriverForm
              recordForEdit={recordForEdit}
              addOrEdit={addOrEdit} 
              closeForm={closeForm}
              addDriver={addDriver}/>
      </Popup>
    
  </div>
  );
};

export default Drivers;

/**
 <Button
            color="primary"
            onClick={handleExportData}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            יצא הכל
          </Button>
          <Button
            color="primary"
            disabled={table.getPrePaginationRowModel().rows.length === 0}
            //export all rows, including from the next page, (still respects filtering and sorting)
            onClick={() =>
              handleExportRows(table.getPrePaginationRowModel().rows)
            }
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            יצא את כל השורות בעמוד
          </Button>
          <Button
            color="primary"
            disabled={table.getRowModel().rows.length === 0}
            //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
            onClick={() => handleExportRows(table.getRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            יצא את כל השורות
          </Button>
          <Button
            color="primary"
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            //only export selected rows
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            יצא שורות נבחרות
          </Button>
 */