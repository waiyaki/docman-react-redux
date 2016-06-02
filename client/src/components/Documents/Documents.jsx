import React, {PropTypes} from 'react';

import Document from './Document';
import CreateDocumentContainer from '../../containers/Documents/CreateDocumentContainer';
import ConfirmDeleteDocument from './ConfirmDeleteDocument';

const noDocsFoundStyles = {
  box: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  containerSpan: {
    fontSize: '24px',
    color: 'rgba(0, 0, 0, 0.87)',
    display: 'block',
    lineHeight: '36px'
  }
};

const Documents = (props) => {
  return (
    <div className='row'>
      {props.documents && props.documents.length
        ? props.documents.map((doc) => (
            <Document
              document={doc}
              documentCrudOptions={props.documentCrudOptions}
              expandedDocId={props.expandedDocId}
              key={doc._id}
              onDeleteDocument={props.onDeleteDocument}
              onExpandChange={props.onExpandChange}
              onUpdateThisDocument={props.onUpdateThisDocument}
              shouldWeAllowEditDocument={props.shouldWeAllowEditDocument(doc)}
            />
          ))
        : <div className='col-xs-12'>
            <div className='box' style={noDocsFoundStyles.box}>
              {props.appliedFilter === 'all'
                ? <span style={noDocsFoundStyles.containerSpan}>
                    No Documents Found.
                  </span>
                : <span style={noDocsFoundStyles.containerSpan}>
                    {
                      `No Documents Matching Role '${props.appliedFilter}' Were Found.`
                    }
                  </span>
              }
            </div>
          </div>
      }
      <CreateDocumentContainer />
      <ConfirmDeleteDocument
        confirmDeleteDocument={props.confirmDeleteDocument}
        isShowingConfirmDialog={props.isShowingConfirmDialog}
      />
    </div>
  );
};

Documents.propTypes = {
  appliedFilter: PropTypes.string.isRequired,
  confirmDeleteDocument: PropTypes.func.isRequired,
  documentCrudOptions: PropTypes.object, // eslint-disable-line
  documents: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      role: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired
  })).isRequired,
  expandedDocId: PropTypes.string.isRequired,
  isShowingConfirmDialog: PropTypes.bool.isRequired,
  onDeleteDocument: PropTypes.func.isRequired,
  onExpandChange: PropTypes.func.isRequired,
  onUpdateThisDocument: PropTypes.func.isRequired,
  shouldWeAllowEditDocument: PropTypes.func.isRequired
};

export default Documents;
