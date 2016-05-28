import React, {PropTypes} from 'react';

import Document from './Document';

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
              expandedDocId={props.expandedDocId}
              key={doc._id}
              onExpandChange={props.onExpandChange}
            />
          ))
        : <div className='col-xs-12'>
            <div className='box' style={noDocsFoundStyles.box}>
              <span style={noDocsFoundStyles.containerSpan}>
                No Documents Found.
              </span>
            </div>
          </div>
      }
    </div>
  );
};

Documents.propTypes = {
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
  onExpandChange: PropTypes.func.isRequired
};

export default Documents;
