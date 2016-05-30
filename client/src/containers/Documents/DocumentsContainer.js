import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import {
  fetchDocumentsFromServer, expandDocument, toggleDocumentUpdate
} from '../../actions/DocumentsActions';
import Documents from '../../components/Documents/Documents';
import DocumentsLoading from '../../components/Documents/DocumentsLoading';

class DocumentsContainer extends React.Component {
  constructor (props) {
    super(props);

    this.handleExpandChange = this.handleExpandChange.bind(this);
    this.handleToggleUpdateThisDocument =
      this.handleToggleUpdateThisDocument.bind(this);
    this.shouldWeAllowEditDocument = this.shouldWeAllowEditDocument.bind(this);
  }

  componentDidMount () {
    this.props.dispatch(fetchDocumentsFromServer());
  }

  /**
   * Handle toggle between expanding a single document and collapsing it.
   *
   * If a document id is provided, expand that document, else collapse
   * whichever document is expanded.
   */
  handleExpandChange (docId) {
    this.props.dispatch(expandDocument(docId));
  }

  /**
   * Select a document to update.
   */
  handleToggleUpdateThisDocument (doc) {
    this.props.dispatch(toggleDocumentUpdate(doc));
  }

  /**
   * Determine whether to show an edit button in the document component.
   *
   * Allow edits from either admins or document owners.
   */
  shouldWeAllowEditDocument (doc) {
    const authenticatedUser = this.props.auth.get('user');
    return authenticatedUser && (authenticatedUser.role.title === 'admin' ||
      authenticatedUser.username === doc.owner.username);
  }

  render () {
    return (
      this.props.docs.isFetching
        ? <DocumentsLoading />
        : <Documents
            documentCrudOptions={this.props.docs.documentCrudOptions}
            documents={this.props.docs.documents}
            expandedDocId={this.props.docs.documentViewOptions.expandedDocId}
            isUpdatingDocument={
              this.props.docs.documentCrudOptions.isUpdatingDocument}
            onExpandChange={this.handleExpandChange}
            onUpdateThisDocument={this.handleToggleUpdateThisDocument}
            shouldWeAllowEditDocument={this.shouldWeAllowEditDocument}
          />
    );
  }
}

DocumentsContainer.propTypes = {
  auth: function (props, propName, componentName) {
    if (!props[propName] instanceof Map) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}. ` +
        `Expected 'Immutable.Map', got ${typeof props[propName]}`
      );
    }
  },
  dispatch: PropTypes.func.isRequired,
  docs: PropTypes.shape({
    documents: PropTypes.array,
    isFetching: PropTypes.bool.isRequired,
    documentCrudOptions: PropTypes.object, // eslint-disable-line
    documentViewOptions: PropTypes.shape({
      expandedDocId: PropTypes.string
    })
  })
};

function mapStateToProps (state) {
  const {dispatch} = state;
  const auth = state.get('auth');
  const docs = state.get('docs').toJS();

  return {
    auth,
    dispatch,
    docs
  };
}

export default connect(mapStateToProps)(DocumentsContainer);
