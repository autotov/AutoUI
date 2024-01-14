import React, { useMemo } from 'react';
import { useEffect, useState } from "react";
import MaterialReactTable from 'material-react-table';
import { Typography } from '@mui/material';
import { Box, Button } from '@material-ui/core';
import { FaCarAlt, FaRegEdit } from "react-icons/fa";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Popup from '../components/popup/Popup'
import CarForm from './forms/CarForm';
import Moment from 'moment';
import { ExportToCsv } from 'export-to-csv';
import { useNavigate } from "react-router-dom";
import { CircularProgress } from '@material-ui/core';
import { tableLocalization } from '../data/structures'

function getCarList(setCars, runGetCars, setRunGetCars, sessionData) {
  console.log("currentCompany="+sessionData)
  useEffect(() => {
    const dataFetch = async () => {
      if(runGetCars[0]) {
        const cars = await (
          await fetch(
            "/cars?company="+sessionData.currentCompany
          )
        ).json();


        console.log("cars.message="+cars)
        setCars(cars);
        setRunGetCars([false]);
      }
    };

    dataFetch();
  }, runGetCars);
}

function formatDate(argDate) {
  return (Moment(argDate)).format('DD/MM/YYYY');
}

function sleep(delay: number) {
  return new Promise( res => setTimeout(res, delay) );
}

//******************************/
export const Cars = (props) => {
  
  const { runGetCars, setRunGetCars, setIsErrorStatus, setErrorMsg } = props;

  const [cars, setCars] = useState();
  const [recordForEdit, setRecordForEdit] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("הוספת רכב");

  let sessionData = sessionStorage.getItem("userData");
  const dataObj = JSON.parse(sessionData);

  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const handleExportData = () => {
    csvExporter.generateCsv(cars);
  };

  const postCar = (car, resetForm, url) => {
    let carJson = JSON.stringify(car);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: carJson
    };

    fetch(url, requestOptions)
        .then(data => {
          if(data.status < 300) {
            sleep(1000).then( () => {
              resetForm()
              setRecordForEdit(null)
              setOpenPopup(false)
              setRunGetCars([true])
              setErrorMsg("רכב נוסף בהצלחה")
              setIsErrorStatus("success")
            })
          } else {
            setErrorMsg(data.message + " כישלון בהוספת רכב")
            setIsErrorStatus("error")
          }
          
        });
  }

  const postNewCar = (car, resetForm) => {
    postCar(car, resetForm, "/car/add?company="+dataObj.currentCompany)
  }

  const postEditCar = (car, resetForm) => {
    postCar(car, resetForm, "/car/update?company="+dataObj.currentCompany)
  }
  
  const addOrEdit = (car, resetForm, addCar) => {
    if(addCar == true) {
      postNewCar(car, resetForm)
    } else {
      postEditCar(car, resetForm)
    }
    setRecordForEdit(null)
    setOpenPopup(false)
  }

  const openDeleteDialog = item => {
    setDeleteTitle("האם למחוק את הרכב " + item.license + "?")
    setRecordForDelete(item)
    setConfirmOpen(true)
  }

  const sendDeleteCar = (car) => {
    let carJson = JSON.stringify(car);
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: carJson
    };

    fetch('/car/'+car.license+"/delete", requestOptions)
        .then(data => {
          if(data.status < 300) {
            setRecordForDelete(null)
            setRunGetCars([true])
            setErrorMsg("רכב נמחק בהצלחה")
            setIsErrorStatus("success")
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
        accessorKey: 'license',
        header: 'מספר רישוי',
        enableColumnOrdering: false,
        enableEditing: false,
        dir: 'rtl',   
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
        accessorKey: 'driverName',
        header: 'שם הנהג',
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
        accessorKey: 'kmNextTipul',
        header: 'ק"\מ טיפול הבא',
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
        accessorKey: 'toolType',
        header: 'סוג הכלי',
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
        accessorKey: 'carType',
        header: 'סוג הרכב',
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
        accessorKey: 'carSubType',
        header: 'דגם',
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
        accessorKey: 'carCreateYear',
        header: 'שנתון',
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
        accessorKey: 'licenseDate',
        header: 'תאריך רשיון',
        dir: 'rtl',
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              color: row.original.licenseDateStatus == 'alarm' ? 'red' : row.original.licenseDateStatus == 'warn' ? 'orange' : 'black'
            }}
          >
            <span>{formatDate(cell.getValue())}</span>
          </Box>
        ),
      },
      {
        accessorKey: 'insuranceHova',
        header: 'ביטוח חובה',
        dir: 'rtl',
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              color: row.original.insuranceHovaStatus == 'alarm' ? 'red' : row.original.insuranceHovaStatus == 'warn' ? 'orange' : 'black'
            }}
          >
            <span>{formatDate(cell.getValue())}</span>
          </Box>
        ),
      },
      {
        accessorKey: 'insuranceSelishi',
        header: 'ביטוח צד ג',
        dir: 'rtl',
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              color: row.original.insuranceSelishiStatus == 'alarm' ? 'red' : row.original.insuranceSelishiStatus == 'warn' ? 'orange' : 'black'
            }}
          >
            <span>{formatDate(cell.getValue())}</span>
          </Box>
        ),
      },
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

  const [toCarCard, setToCarCard] = React.useState(false);
  const [navToLicense, setNavToLicense] = React.useState("");
  const [addCar, setAddCar] = React.useState(false);
  
  getCarList(setCars, runGetCars, setRunGetCars, dataObj)

  const navigate = useNavigate()
  useEffect(() => {
    if (toCarCard === true) {
      navigate("/CarCard/"+navToLicense);
    }
  }, [toCarCard])
  
  if(cars == undefined || runGetCars[0]) {
    if(!runGetCars[0]) {
      setRunGetCars([true]);
    }
    return(
      <CircularProgress color="secondary" />
    )
  }
  
  
  return (
    <div dir='rtl'>
      <div className="flex flex-wrap lg:flex-nowrap justify-start">
        <Button
            color='primary'
            onClick={() => { setAddCar(true); setPopupTitle("הוספת רכב"); openInPopup(null); setRecordForEdit(null);}}>
            <FaCarAlt fontSize="large" />
            הוספת רכב
        </Button>
      </div>

      <MaterialReactTable
        columns={columns}
        data={cars}

        muiTableBodyRowProps={({ row }) => ({
          onClick: (event) => {
            console.info(event.target.parentElement.className, row.id);
            console.log("recordForEdit="+row.getValue("license"));

            // TODO fix - Uncaught TypeError: event.target.parentElement.className.startsWith is not a function
            if(!event.target.parentElement.className.startsWith('MuiButton')) {
              setNavToLicense(row.getValue("license"));
              setToCarCard(true);
            }
          },
          sx: {
            cursor: 'pointer',
          },
        })}
        
        defaultColumn={{
          Cell: ({ cell }) => {
            //console.info('render cell', cell.column.id, cell.getValue());
            if(cell.column.id == 'licenseDate' || cell.column.id == 'insuranceSelishi' || cell.column.id == 'insuranceHova') {
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
                setAddCar(false)
                setPopupTitle("עריכת רכב"); 
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
        enableEditing
        enablePinning
        //enableRowSelection
        enableStickyHeader
        initialState={{ pagination: { pageSize: 20, pageIndex: 0 } }}
        memoMode="cells"
        muiTableContainerProps={{ sx: { maxHeight: '500px' } }}
        positionToolbarAlertBanner="bottom"
        positionActionsColumn='first'
        renderDetailPanel={({ row }) => <div>{row.original.firstName}</div>}
        renderTopToolbarCustomActions={({ table }) => (
          <Box className="flex flex-wrap lg:flex-nowrap justify-start" sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }} >
          <Typography component="span" variant="h4">
            רכבים
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
          setOpenPopup={openInPopup} 
          setClose={closeForm}>
          <CarForm
              recordForEdit={recordForEdit}
              addOrEdit={addOrEdit} 
              closeForm={closeForm}
              addCar={addCar}/>
      </Popup>
    
  </div>
  );
};

export default Cars;


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
