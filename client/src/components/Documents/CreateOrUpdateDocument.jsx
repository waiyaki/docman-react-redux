import classNames from 'classnames';

import React, { PropTypes } from 'react';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import ValidationError from '../Auth/ValidationError';

const createButtonStyles = {
  position: 'fixed',
  right: '24px',
  bottom: '24px',
  zIndex: 1100
};

const CreateOrUpdateDocument = (props) => {
  const hideComponent = () => classNames({
    hidden: true
  });

  const actions = [
    <FlatButton
      key='Cancel'
      label='Cancel'
      onTouchTap={props.onToggleShowModal}
      primary
    />,
    <FlatButton
      disabled={!props.validations.isValid}
      key='Submit'
      label='Submit'
      onTouchTap={props.onSubmit}
      primary
    />
  ];

  return (
    <div>
      <div style={createButtonStyles}>
        <FloatingActionButton
          onTouchTap={props.onToggleShowModal}
          secondary
        >
          <ContentAdd />
        </FloatingActionButton>
      </div>
      <Dialog
        actions={actions}
        autoScrollBodyContent
        contentStyle={{ minWidth: '60%' }}
        modal
        open={props.isShowingCreateModal}
        title={props.isUpdatingDocument
          ? 'Update Document'
          : 'Create a new document'
        }
        titleStyle={{ textAlign: 'center' }}
      >
        <div>
          <TextField
            defaultValue={props.documentContent.title}
            floatingLabelText='Title'
            fullWidth
            hintText='Enter Title'
            name='title'
            onBlur={props.onFieldUpdate}
            required
            type='text'
          />
          <span>
            <br />
            <ValidationError
              error={props.validations.title}
              style={hideComponent('title')}
            />
          </span>
        </div>
        <div>
          <TextField
            defaultValue={props.documentContent.content}
            floatingLabelText='Content'
            fullWidth
            hintText='Content'
            multiLine
            name='content'
            onBlur={props.onFieldUpdate}
            onMouseLeave={props.onFieldUpdate}
            required
            rows={2}
            type='text'
          />
          <span>
            <br />
            <ValidationError
              error={props.validations.content}
              style={hideComponent('content')}
            />
          </span>
        </div>
        <div>
          <SelectField
            name='role'
            onChange={props.onRoleFieldUpdate}
            value={props.documentContent.role || 'public'}
          >
            {props.roles
              .filter(role => role.title !== 'admin')
              .map((role) => (
                <MenuItem
                  key={role._id}
                  label={role.title}
                  primaryText={role.title}
                  value={role.title}
                />
              ))
            }
          </SelectField>
        </div>
      </Dialog>
    </div>
  );
};

CreateOrUpdateDocument.propTypes = {
  documentContent: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    role: PropTypes.string
  }).isRequired,
  isShowingCreateModal: PropTypes.bool.isRequired,
  isUpdatingDocument: PropTypes.bool.isRequired,
  onFieldUpdate: PropTypes.func.isRequired,
  onRoleFieldUpdate: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onToggleShowModal: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  })),
  validations: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    isValid: PropTypes.bool.isRequired
  }).isRequired
};

export default CreateOrUpdateDocument;
