import React, { useMemo } from 'react';
import { useEffect, useState } from "react";
import MaterialReactTable from 'material-react-table';
import { Typography  } from '@mui/material';
import { Box, Button } from '@material-ui/core';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {  FaRegEdit } from "react-icons/fa";
  import { IoMdContacts } from 'react-icons/io';
import Popup from '../components/popup/Popup'
import UserForm from '../components/forms/UserForm'; 
import Moment from 'moment';
import { ExportToCsv } from 'export-to-csv';
import { CircularProgress } from '@material-ui/core';

function sleep(delay: number) {
  return new Promise( res => setTimeout(res, delay) );
}

function getUserList(setUsers, runGetUsers, setRunGetUsers) {
  useEffect(() => {
    const dataFetch = async () => {
      if(runGetUsers[0]) {
        const users = await (
          await fetch(
            "/users"
          )
        ).json();

        setUsers(users);
        setRunGetUsers([false]);
      }
    };

    dataFetch();
  }, runGetUsers);
}

function formatDate(argDate) {
  return (Moment(argDate)).format('DD/MM/YYYY');
}

function getRoleDisplayName(cellVal) {
  if(cellVal == "ADMIN"){
    return "ניהול";
  }
  if(cellVal == "OPERATOR"){
    return "עריכה";
  }

  return "צפיה";
}

//******************************/
export const Users = (props) => {

  const [ runGetUsers, setRunGetUsers ] = useState([true]);
  const [users, setUsers] = useState();

  const [recordForEdit, setRecordForEdit] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("הוספת משתמש");
  const [popupAction, setPopupAction] = useState("add");

  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const handleExportData = () => {
    csvExporter.generateCsv(users);
  };

  const openDeleteDialog = item => {
    setDeleteTitle("האם למחוק את  " + item.name + "?")
    setRecordForDelete(item)
    setConfirmOpen(true)
  }

  const sendDeleteUser = (user) => {
    let userJson = JSON.stringify(user);
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: userJson
    };

    fetch('/user/'+user.numberId+"/delete", requestOptions)
        .then(data => {
          if(data.status < 300) {
            setRecordForDelete(null)
          } 
        });
  }

  const deleteUser = (user) => {
    sendDeleteUser(user)
  }

  const addOrEdit = (user, resetForm, action) => {
    if(action == 'add') {
      addUser(user, resetForm)
    } else {
      updateUser(user, resetForm)
    }
    setRecordForEdit(null)
    setOpenPopup(false)

    sleep(1500);
    setRunGetUsers([true])
  }
  
  const addUser = (user, resetForm) => {
    let userJson = JSON.stringify(user);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: userJson
    };

    fetch('/user/add', requestOptions)
        .then(data => {
          if(data.status < 300) {
            resetForm()
            setRecordForEdit(null)
            setOpenPopup(false)
          } 
        });
  }

  const updateUser = (user, resetForm) => {
    let userJson = JSON.stringify(user);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: userJson
    };

    fetch('/user/update', requestOptions)
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
        accessorKey: 'username',
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
        accessorKey: 'name',
        header: 'שם',
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
        accessorKey: 'lastName',
        header: 'שם משפחה',
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
        accessorKey: 'phone',
        header: 'טלפון',
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
        accessorKey: 'mobilePhone',
        header: 'פלאפון',
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
        accessorKey: 'role',
        header: 'הרשאה',
        dir: 'rtl',
        Cell: ({ cell, row }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              color: 'success.dark',
            }}
          >
            <span>{getRoleDisplayName(cell.getValue())}</span>
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

  getUserList(setUsers, runGetUsers, setRunGetUsers)

  if(users == undefined || runGetUsers[0]) {
    return(
      <CircularProgress color="secondary" />
    )
  } 

  return (
    <div dir='rtl'>
      <div className="flex flex-wrap lg:flex-nowrap justify-start">
        <Button
            color='primary'
            onClick={() => { setPopupAction("add"); setPopupTitle("הוספת משתמש"); openInPopup(null); }}>
            <IoMdContacts fontSize="large" />
            הוספת משתמש
        </Button>
      </div>
      
      <MaterialReactTable
        columns={columns}
        data={users}
        
        defaultColumn={{
          Cell: ({ cell }) => {
            return <>{cell.getValue()}</>;
          },
        }}
        
        editingMode="row"
        enableColumnOrdering
        enableDensityToggle={false}
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
          placeholder: 'חיפוש',
          sx: { minWidth: '18rem' },
        }}
        renderTopToolbarCustomActions={({ table }) => (
          <Box dir='ltr' className="flex flex-wrap lg:flex-nowrap justify-start" sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }} >
          <Typography component="span" variant="h4">
            משתמשים
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
                setPopupTitle("עריכת משתמש");
                openInPopup(null);
                setRecordForEdit(row.original);
                }
              }
              ><FaRegEdit fontSize="large" /></Button>
            ),
          },
        }}

        localization={{
          actions: 'פעולה',
          and: 'e',
          cancel: 'בטל',
          changeFilterMode: 'שינוי מצב סינון',
          changeSearchMode: 'שינוי מצב חיפוש',
          clearFilter: 'נקה סינון',
          clearSearch: 'נקה חיפוש',
          clearSort: 'נקה מיון',
          clickToCopy: 'לחץ להעתקה',
          collapse: 'קבץ',
          collapseAll: 'קבץ הכל',
          columnActions: 'עמודת פעולה',
          copiedToClipboard: 'העתק',
          dropToGroupBy: ' העבר לקבץ על-ידי: {column}',
          edit: 'ערוך',
          expand: 'הרחב',
          expandAll: 'הרחב הכל',
          filterArrIncludes: 'כלול',
          filterArrIncludesAll: 'כלול הכל',
          filterArrIncludesSome: 'כלול חלק',
          filterBetween: 'בין',
          filterBetweenInclusive: 'בין כולל',
          filterByColumn: ' סנן על-ידי: {column} ',
          filterContains: 'מכיל',
          filterEmpty: 'ריק',
          filterEndsWith: 'נגמר עם',
          filterEquals: 'שווה',
          filterEqualsString: 'שווה',
          filterFuzzy: 'מעורפל',
          filterGreaterThan: 'גדול מ',
          filterGreaterThanOrEqualTo: 'גדול או שווה',
          filterInNumberRange: 'בין',
          filterIncludesString: 'מכיל',
          filterIncludesStringSensitive: 'מכיל',
          filterLessThan: 'פחות מ',
          filterLessThanOrEqualTo: 'פחות או שווה',
          filterMode: '{filterType} מצב סינון:',
          filterNotEmpty: 'לא ריק',
          filterNotEquals: 'לא שווה',
          filterStartsWith: 'מתחיל עם',
          filterWeakEquals: 'שווה',
          filteringByColumn: '{column} - {filterType} {filterValue} סנן על-ידי',
          goToFirstPage: 'עבור לראשון',
          goToLastPage: 'עבור לאחרון',
          goToNextPage: 'דף הבא',
          goToPreviousPage: 'דף קודם',
          grab: 'Grab',
          groupByColumn: 'קבץ על-ידי: {column}',
          groupedBy: 'Grouped by ',
          hideAll: 'הסתר הכל',
          hideColumn: 'הסתר עמודה: {column}',
          max: 'מקסימום',
          min: 'מינימום',
          move: 'הזז',
          noRecordsToDisplay: 'אין רשומות',
          noResultsFound: 'לא נמצאו תוצאות',
          of: 'of',
          or: 'or',
          pinToLeft: 'הצמד לשמאל',
          pinToRight: 'הצמד לימין',
          resetColumnSize: 'שחזר רוחב עמודות',
          resetOrder: 'נקה מיון',
          rowActions: 'פעולה על שורה',
          rowNumber: '#',
          rowNumbers: 'מספר שורות',
          rowsPerPage: 'שורות בדף',
          save: 'שמור',
          search: 'חפש',
          selectedCountOfRowCountRowsSelected:
            '{selectedCount} שורות מתוך {rowCount} ',
          select: 'בחר',
          showAll: 'הצג הכל',
          showAllColumns: 'הצג את כל העמודות',
          showHideColumns: 'הצג/הסתר שורות',
          showHideFilters: 'הצג/הסתר סינון',
          showHideSearch: 'הצג/הסתר חיפוש',
          sortByColumnAsc: 'מיין על-ידי \'{column}\' בסדר עולה',
          sortByColumnDesc: 'מיין על-ידי \'{column}\' בסדר יורד',
          sortedByColumnAsc: 'ממויין על-ידי \'{column}\' בסדר עולה',
          sortedByColumnDesc: 'ממויין על-ידי \'{column}\' בסדר יורד',
          thenBy: ', then by ',
          toggleDensity: 'Toggle density',
          toggleFullScreen: 'Toggle full screen',
          toggleSelectAll: 'Toggle select all',
          toggleSelectRow: 'Toggle select row',
          toggleVisibility: 'Toggle visibility',
          ungroupByColumn: 'Ungroup by {column}',
          unpin: 'בטל הצמדה',
          unpinAll: 'בטל הצמדה לכל',
          unsorted: 'ללא מיון',
        }}
      />

      <Popup
          title={popupTitle}
          openPopup={openPopup}
          setOpenPopup={openInPopup} >
          <UserForm
              recordForEdit={recordForEdit}
              addOrEdit={addOrEdit} 
              closeForm={closeForm}
              action={popupAction}
              />
      </Popup>
  </div>
  );
};

export default Users;
