import React, {PropTypes} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const ConfirmDeleteDocument = (props) => {
  const actions = [
    <FlatButton
      key='Cancel'
      label='Cancel'
      onTouchTap={function () {
        props.confirmDeleteDocument(false);
      }}
      primary
    />,
    <FlatButton
      key='Delete'
      label='Delete'
      onTouchTap={function () {
        props.confirmDeleteDocument(true);
      }}
      primary
    />
  ];

  return (
    <Dialog
      actions={actions}
      modal
      open={props.isShowingConfirmDialog}
      title='Confirm Document Deletion'
    >
      Do you want to delete this document? Please note, you can't undo this action.
    </Dialog>
  );
};

ConfirmDeleteDocument.propTypes = {
  confirmDeleteDocument: PropTypes.func.isRequired,
  isShowingConfirmDialog: PropTypes.bool.isRequired
};

export default ConfirmDeleteDocument;
