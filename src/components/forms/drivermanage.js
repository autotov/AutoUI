import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import {
  Plugin, Template, TemplateConnector, TemplatePlaceholder,
} from '@devexpress/dx-react-core';
import { EditingState } from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditColumn,
} from '@devexpress/dx-react-grid-material-ui';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MuiGrid from '@mui/material/Grid';
// eslint-disable-next-line
import moment from 'moment';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterMoment from '@mui/lab/AdapterMoment';
import axios from "axios";
/*
import {
  generateRows,
  employeeValues,
} from './data/generator';
*/
/* eslint-disable no-shadow */
const Popup = ({
  row,
  onChange,
  onApplyChanges,
  onCancelChanges,
  open,
}) => (
  <Dialog open={open} onClose={onCancelChanges} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">Employee Details</DialogTitle>
    <DialogContent>
      <MuiGrid container spacing={3}>
        <MuiGrid item xs={6}>
          <FormGroup>
            <TextField
              margin="normal"
              name="firstName"
              label="First Name"
              value={row.firstName || ''}
              onChange={onChange}
            />
            <TextField
              margin="normal"
              name="prefix"
              label="Title"
              value={row.prefix || ''}
              onChange={onChange}
            />
            <TextField
              margin="normal"
              name="position"
              label="Position"
              value={row.position || ''}
              onChange={onChange}
            />
          </FormGroup>
        </MuiGrid>
        <MuiGrid item xs={6}>
          <FormGroup>
            <TextField
              margin="normal"
              name="lastName"
              label="Last Name"
              value={row.lastName || ''}
              onChange={onChange}
            />
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                renderInput={props => <TextField margin="normal" {...props} />}
                label="Birth Date"
                value={row.BirthDate}
                onChange={value => onChange({
                  target: { name: 'BirthDate', value },
                })}
                inputFormat="DD/MM/YYYY"
              />
            </LocalizationProvider>
            <TextField
              margin="normal"
              name="phone"
              label="Phone"
              value={row.phone || ''}
              onChange={onChange}
            />
          </FormGroup>
        </MuiGrid>
      </MuiGrid>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancelChanges} color="secondary">
        Cancel
      </Button>
      <Button onClick={onApplyChanges} color="primary">
        Save
      </Button>
    </DialogActions>
  </Dialog>
);

const PopupEditing = React.memo(({ popupComponent: Popup }) => (
  <Plugin>
    <Template name="popupEditing">
      <TemplateConnector>
        {(
          {
            rows,
            getRowId,
            addedRows,
            editingRowIds,
            createRowChange,
            rowChanges,
          },
          {
            changeRow, changeAddedRow, commitChangedRows, commitAddedRows,
            stopEditRows, cancelAddedRows, cancelChangedRows,
          },
        ) => {
          const isNew = addedRows.length > 0;
          let editedRow;
          let rowId;
          if (isNew) {
            rowId = 0;
            editedRow = addedRows[rowId];
          } else {
            [rowId] = editingRowIds;
            const targetRow = rows.filter(row => getRowId(row) === rowId)[0];
            editedRow = { ...targetRow, ...rowChanges[rowId] };
          }

          const processValueChange = ({ target: { name, value } }) => {
            const changeArgs = {
              rowId,
              change: createRowChange(editedRow, value, name),
            };
            if (isNew) {
              changeAddedRow(changeArgs);
            } else {
              changeRow(changeArgs);
            }
          };
          const rowIds = isNew ? [0] : editingRowIds;
          const applyChanges = () => {
            if (isNew) {
              commitAddedRows({ rowIds });
            } else {
              stopEditRows({ rowIds });
              commitChangedRows({ rowIds });
            }
          };
          const cancelChanges = () => {
            if (isNew) {
              cancelAddedRows({ rowIds });
            } else {
              stopEditRows({ rowIds });
              cancelChangedRows({ rowIds });
            }
          };

          const open = editingRowIds.length > 0 || isNew;
          return (
            <Popup
              open={open}
              row={editedRow}
              onChange={processValueChange}
              onApplyChanges={applyChanges}
              onCancelChanges={cancelChanges}
            />
          );
        }}
      </TemplateConnector>
    </Template>
    <Template name="root">
      <TemplatePlaceholder />
      <TemplatePlaceholder name="popupEditing" />
    </Template>
  </Plugin>
));

const getRowId = row => row.id;
export default () => {

  const [columns] = useState([
    { name: 'firstName', title: 'First Name' },
    { name: 'lastName', title: 'Last Name' },
    { name: 'position', title: 'Position' },
    { name: 'phone', title: 'Phone' },
  ]);

/*
  const [rows, setRows] = useState([]);
  
  const [rows, setRows] = useState(generateRows({
    columnValues: { id: ({ index }) => index, ...employeeValues },
    length: 8,
  }));
  */

  const [rows, setRows] = React.useState(null);
  React.useEffect(() => {
    axios.get("/drivers").then((response) => {
      setRows(response.data);
    });
  }, []);
  if(rows == null)
    setRows([]);

  const commitChanges = ({ added, changed }) => {
    let changedRows;
    if (added) {
      const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
      changedRows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row,
        })),
      ];
    }
    if (changed) {
      changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
    }
    setRows(changedRows);
  };

  return (
    <Paper>
      <Grid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
      >
        <EditingState
          onCommitChanges={commitChanges}
        />
        <Table />
        <TableHeaderRow />
        <TableEditColumn
          showAddCommand
          showEditCommand
        />
        <PopupEditing popupComponent={Popup} />
      </Grid>
    </Paper>
  );
};
