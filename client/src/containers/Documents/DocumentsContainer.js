import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import {
  fetchDocumentsFromServer, expandDocument, toggleDocumentUpdate, deleteDocument
} from '../../actions/DocumentsActions';
import Documents from '../../components/Documents/Documents';
import DocumentsLoading from '../../components/Documents/DocumentsLoading';

class DocumentsContainer extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isShowingConfirmDialog: false,
      documentToDelete: null
    };

    this.confirmDeleteDocument = this.confirmDeleteDocument.bind(this);
    this.getDocumentsToShow = this.getDocumentsToShow.bind(this);
    this.getVisibleDocuments = this.getVisibleDocuments.bind(this);
    this.handleDeleteDocument = this.handleDeleteDocument.bind(this);
    this.handleExpandChange = this.handleExpandChange.bind(this);
    this.handleToggleUpdateThisDocument =
      this.handleToggleUpdateThisDocument.bind(this);
    this.shouldWeAllowEditDocument = this.shouldWeAllowEditDocument.bind(this);
  }

  componentDidMount () {
    this.props.dispatch(fetchDocumentsFromServer());
  }

  handleDeleteDocument (docId) {
    this.setState({
      isShowingConfirmDialog: true,
      documentToDelete: docId
    });
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
   * Give the user the chance to confirm deletion of a document.
   */
  confirmDeleteDocument (confirmed) {
    if (confirmed) {
      this.props.dispatch(deleteDocument(this.state.documentToDelete));
    }

    this.setState({
      isShowingConfirmDialog: false,
      documentToDelete: null
    });
  }

  /**
   * Determine whether to show an edit button in the document component.
   *
   * Allow edits from either admins or document owners.
   */
  shouldWeAllowEditDocument (doc) {
    const authenticatedUser = this.props.auth.get('user');
    return authenticatedUser && authenticatedUser.role && (
      authenticatedUser.role.title === 'admin' ||
      authenticatedUser.username === doc.owner.username
    );
  }

  /**
   * Filter out the visible documents based on the value of the currently
   * applied filter.
   */
  getVisibleDocuments (documents, filter) {
    if (filter === 'all') {
      return documents;
    }

    return documents.filter((doc) => {
      return doc.role.title === filter;
    });
  }

  /**
   * Determine which documents we should show when we render.
   * If we're in the main page, we'll show everything.
   * If we are in the user profile's page, we'll show that user's documents
   * fetched from the server so long as the selected user is not the logged in
   * user.
   * If the selected user is the one currently logged in, we're going to filter
   * their documents from the current state.
   */
  getDocumentsToShow () {
    const authenticatedUser = this.props.auth.get('user');
    const propUser = this.props.selectedUser;
    if (authenticatedUser && propUser && propUser.username === authenticatedUser.username) {
      return this.props.docs.documents
        .filter((doc) => doc.owner.username === authenticatedUser.username);
    }
    // Either there's no user passed in as props, in which case we can safely
    // assume that no documents were passed in as well, or the propUser isn't
    // the one currently logged in.
    return this.props.selectedUserDocuments
      ? this.props.selectedUserDocuments.documents
      : this.props.docs.documents;
  }

  render () {
    const selectedUserDocs = this.props.selectedUserDocuments;
    return (
      this.props.docs.isFetching || selectedUserDocs && selectedUserDocs.isFetching
        ? <DocumentsLoading />
        : <Documents
            appliedFilter={this.props.docs.documentViewOptions.visibleFilter}
            confirmDeleteDocument={this.confirmDeleteDocument}
            documentCrudOptions={this.props.docs.documentCrudOptions}
            documents={this.getVisibleDocuments(
              this.getDocumentsToShow(),
              this.props.docs.documentViewOptions.visibleFilter
            )}
            expandedDocId={this.props.docs.documentViewOptions.expandedDocId}
            isShowingConfirmDialog={this.state.isShowingConfirmDialog}
            isUpdatingDocument={
              this.props.docs.documentCrudOptions.isUpdatingDocument}
            onDeleteDocument={this.handleDeleteDocument}
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
      expandedDocId: PropTypes.string,
      visibleFilter: PropTypes.string
    })
  }),
  selectedUserDocuments: PropTypes.shape({
    documents: PropTypes.array,
    isFetching: PropTypes.bool
  }),
  selectedUser: PropTypes.object // eslint-disable-line
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
