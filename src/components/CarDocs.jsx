import React, { useMemo } from 'react';
import { useEffect, useState } from "react";
import MaterialReactTable from 'material-react-table';
import { Typography } from '@mui/material';
import { Box, Button } from '@material-ui/core';
import { Avatar } from '@mui/material';
import { FcDeleteRow } from "react-icons/fc";
import Moment from 'moment';
import { tableLocalization } from '../data/structures'
import ConfirmDialog from '../components/forms/ConfirmDialog'
import ImageViewer from 'react-simple-image-viewer';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Download from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { contains } from '@syncfusion/ej2/diagrams';

function getCarDocList(setCarDocList, runGetCarDocs, setRunGetCarDocs, carId, currentCompany) {
  console.log("currentCompany="+currentCompany)
  useEffect(() => {
    const dataFetch = async () => {
      if(runGetCarDocs[0]) {
        const carsDocs = await (
          await fetch(
            "/cars/docs?company="+currentCompany+"&carLicence="+carId
          )
        ).json();

        setCarDocList(carsDocs);
        setRunGetCarDocs([false]);
      }
    };

    dataFetch();
  }, runGetCarDocs);
}

function formatDate(argDate) {
  return (Moment(argDate)).format('DD/MM/YYYY');
}

function sleep(delay: number) {
  return new Promise( res => setTimeout(res, delay) );
}

//******************************/
export const CarDocs = (props) => {
  
  const { runGetCarDocs, setRunGetCarDocs, setAddDoc, carId } = props;

  console.log("runGetCarDocs="+runGetCarDocs)
  console.log("carId="+carId)

  const [carDocList, setCarDocList] = useState([]);
  const [recordForDelete, setRecordForDelete] = useState();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState();

  let sessionData = sessionStorage.getItem("userData");
  const dataObj = JSON.parse(sessionData);

  const [openPopup, setOpenPopup] = useState(false)
  const [imageToDisplay, setImageToDisplay] = useState()
  const [currentImage, setCurrentImage] = useState(0);
  
  const openInPopup = item => {
    setOpenPopup(true)
  }
  const closeImageForm = () => {
      setOpenPopup(false)
  }
  
  const openDeleteDialog = item => {
    console.log('item='+JSON.stringify(item))
    setDeleteTitle("האם למחוק את מסמך " + item.docName + " מסוג " + item.docType + "?")
    setRecordForDelete(item)
    setConfirmOpen(true)
  }

  const sendDeleteCarDoc = (carDoc) => {
    let carDocJson = JSON.stringify(carDoc);
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: carDocJson
    };

    fetch('/car/docs/'+carDoc.docId+"/delete", requestOptions)
      .then(data => {
        if(data.status < 300) {
          sleep(3500).then(
            setRecordForDelete(null)).then(
            setRunGetCarDocs([true])
          ).then(console.log("END DELETE DOC"))
        } 
      });
    }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'avatar',
        dir: 'rtl',
        Cell: ({ cell, row }) => (
            <Avatar src={'/car/docs/' + row.original.docId}/>
        ),
      },
      {
        accessorKey: 'docName',
        header: ' שם המסמך',
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
        accessorKey: 'creationDate',
        header: 'תאריך העלאה',
        dir: 'rtl',
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              color: 'success.dark',
            }}
          >
            <span>{formatDate(cell.getValue())}</span>
          </Box>
        ),
      },
      {
        accessorKey: 'uploadUserName',
        header: 'שם משתמש',
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
        accessorKey: 'docType',
        header: 'סוג מסמך',
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
    ],
    [],
  );

  getCarDocList(setCarDocList, runGetCarDocs, setRunGetCarDocs, carId, dataObj.currentCompany)
  
  return (
    <div dir='rtl'>
      <MaterialReactTable
        columns={columns}
        data={carDocList}

        muiTableBodyRowProps={({ row }) => ({
          onClick: (event) => {
            console.info(event.target.parentElement.className, row.id);
            console.log("doc name="+row.getValue("docName"));
            console.log("doc id="+row.original.docId);

            if(event.target.parentElement != undefined && event.target.parentElement != null){
              if(!event.target.parentElement.className.startsWith('MuiButton')) {
                setImageToDisplay(row.original.docId)
                setOpenPopup(true)
              }
            }
          },
          sx: {
            cursor: 'pointer',
          },
        })}
        
        defaultColumn={{
          Cell: ({ cell }) => {
            if(cell.column.id == 'creationDate' ) {
              const newDate = formatDate(cell.getValue())
              return <>{newDate}</>;
              
            }
            return <>{cell.getValue()}</>;
          },
        }}

        displayColumnDefOptions={{
          'mrt-row-actions': {
            header: 'מחיקה',
            Cell: ({ row, table }) => (
              <Button 
              onClick={() => {
                openDeleteDialog(row.original);
                }
              }
              ><FcDeleteRow fontSize="large" /></Button>
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
        //renderDetailPanel={({ row }) => <div>{row.original.firstName}</div>}

        renderTopToolbarCustomActions={({ table }) => (
          <Box className="flex flex-wrap lg:flex-nowrap justify-start" sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }} >
        </Box>
        )}

        localization={{ tableLocalization  }}
      />

      <div>
      <ConfirmDialog 
        title={deleteTitle}
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={sendDeleteCarDoc}
        recordForEdit={recordForDelete}
        okLable="מחיקה"
        cancelLable="ביטול"
      />
      </div>

      <Lightbox
        open={openPopup}
        close={() => setOpenPopup(false)}
        slides={ [{ src: '/car/docs/' + imageToDisplay }] }
        plugins={[Download, Fullscreen, Zoom]}
        carousel={{finite:true, imageFit:'contain'}}
      />
    
  </div>
  );
};

export default CarDocs;

