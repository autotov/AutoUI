import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const ConfirmDialog = (props) => {
  const { title, children, open, setOpen, onConfirm, recordForEdit, okLable, cancelLable } = props;
  return (
    <Dialog
      dir='rtl'
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <div className="m-3 md:m-5 mt-5 p-10 md:p-5 bg-white rounded-3xl">
          <Button
            variant="contained"
            onClick={() => setOpen(false)}
            style={{ backgroundColor: "#64b5f6" }}
            >
            {cancelLable}
          </Button>
        
          <Button
            variant="contained"
            onClick={() => {
              setOpen(false);
              onConfirm(recordForEdit);
            }}
            style={{ backgroundColor: "#f57f17" }}
            >
            {okLable}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;