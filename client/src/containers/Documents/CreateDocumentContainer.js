import {Map} from 'immutable';

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import {
  createDocument, toggleCreateModal, updateNewDocumentContents,
  validateDocumentContents
} from '../../actions/DocumentsActions';
import CreateDocument from '../../components/Documents/CreateDocument';
import {fetchRolesIfNecessary} from '../../actions/RolesActions';

class CreateDocumentContainer extends React.Component {
  constructor (props) {
    super(props);

    this.handleFieldUpdate = this.handleFieldUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggleShowModal = this.handleToggleShowModal.bind(this);
    this.handleRoleFieldUpdate = this.handleRoleFieldUpdate.bind(this);
    this.updateDocumentContent = this.updateDocumentContent.bind(this);
    this.handleValidateFieldOnBlur = this.handleValidateFieldOnBlur.bind(this);
  }

  componentDidMount () {
    this.props.dispatch(fetchRolesIfNecessary());
  }

  updateDocumentContent (field, value) {
    let documentContent = this.props.documentCrudOptions.get('documentContent');
    documentContent =
      documentContent.set(field, value);
    this.props.dispatch(updateNewDocumentContents(documentContent.toJS()));
    this.handleValidateFieldOnBlur(field);
  }

  /**
   * Grab new document field updates from the UI and set them to the state.
   */
  handleFieldUpdate (event) {
    event.preventDefault();
    this.updateDocumentContent(event.target.name, event.target.value);
  }

  /**
   * Handle a change in the value of the document's role.
   *
   * Handled differently from the other fields due to a discrepancy between
   * the select field's event API and that of the text fields.
   */
  handleRoleFieldUpdate (event, index, value) {
    event.preventDefault();
    this.updateDocumentContent('role', value);
  }

  /**
   * Dispatch an action to create a document in the server using the details
   * in the new document's state.
   */
  handleSubmit () {
    if (this.props.documentCrudOptions.getIn(['validations', 'isValid'])) {
      this.handleToggleShowModal();
      this.props.dispatch(createDocument(
        this.props.documentCrudOptions.get('documentContent').toJS())
      );
    }
  }

  /**
   * Show or hide the create new document modal.
   */
  handleToggleShowModal () {
    this.props.dispatch(toggleCreateModal());
  }

  handleValidateFieldOnBlur (field) {
    this.props.dispatch(validateDocumentContents(field));
  }

  render () {
    return (
      <CreateDocument
        documentContent={
          this.props.documentCrudOptions.get('documentContent').toJS()
        }
        isShowingCreateModal={
          this.props.documentCrudOptions.get('isShowingCreateModal')}
        onFieldUpdate={this.handleFieldUpdate}
        onRoleFieldUpdate={this.handleRoleFieldUpdate}
        onSubmit={this.handleSubmit}
        onToggleShowModal={this.handleToggleShowModal}
        roles={this.props.roles.toJS()}
        validations={this.props.documentCrudOptions.get('validations').toJS()}
      />
    );
  }
}

CreateDocumentContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  documentCrudOptions: function (props, propName, componentName) {
    if (!props[propName] instanceof Map) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}. ` +
        `Expected 'Immutable.Map', got ${typeof props[propName]}`
      );
    }
  },
  roles: function (props, propName, componentName) {
    if (!props[propName] instanceof Map) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}. ` +
        `Expected 'Immutable.Map', got ${typeof props[propName]}`
      );
    }
  }
};

function mapStateToProps (state) {
  const {dispatch} = state;
  const documentCrudOptions = state.getIn(['docs', 'documentCrudOptions']);
  const roles = state.getIn(['roles', 'roles']);

  return {
    dispatch,
    documentCrudOptions,
    roles
  };
}

export default connect(mapStateToProps)(CreateDocumentContainer);
