import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import {
  fetchDocumentsFromServer, expandDocument
} from '../../actions/DocumentsActions';
import Documents from '../../components/Documents/Documents';
import DocumentsLoading from '../../components/Documents/DocumentsLoading';

class DocumentsContainer extends React.Component {
  constructor (props) {
    super(props);

    this.handleExpandChange = this.handleExpandChange.bind(this);
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

  render () {
    return (
      this.props.docs.isFetching
        ? <DocumentsLoading />
        : <Documents
            documents={this.props.docs.documents}
            expandedDocId={this.props.docs.documentViewOptions.expandedDocId}
            onExpandChange={this.handleExpandChange}
          />
    );
  }
}

DocumentsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  docs: PropTypes.shape({
    documents: PropTypes.array,
    isFetching: PropTypes.bool.isRequired,
    documentViewOptions: PropTypes.shape({
      expandedDocId: PropTypes.string
    })
  })
};

function mapStateToProps (state) {
  const {dispatch} = state;
  const docs = state.get('docs').toJS();

  return {
    dispatch,
    docs
  };
}

export default connect(mapStateToProps)(DocumentsContainer);
