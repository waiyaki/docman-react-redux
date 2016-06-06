import {fromJS, Map, List} from 'immutable';
import {expect} from 'chai';

import * as actionTypes from '../../../client/src/constants';

import DocumentsReducer, {
  INITIAL_DOCUMENTS_STATE
} from '../../../client/src/reducers/DocumentsReducer';

describe('Documents Reducer', () => {
  it('return the initial state', () => {
    expect(DocumentsReducer(undefined, {})).to.eql(INITIAL_DOCUMENTS_STATE);
  });

  it('handles FETCH_DOCUMENTS_REQUEST', () => {
    expect(DocumentsReducer(Map(), {type: actionTypes.FETCH_DOCUMENTS_REQUEST}))
      .to.eql(Map({
        isFetching: true
      }));
  });

  it('handles FETCH_DOCUMENTS_SUCCESS', () => {
    const action = {
      type: actionTypes.FETCH_DOCUMENTS_SUCCESS,
      documents: 'Dummy docs'.split()
    };

    expect(DocumentsReducer(Map(), action)).to.eql(Map({
      isFetching: false,
      documents: List('Dummy docs'.split())
    }));
  });

  it('handles FETCH_DOCUMENTS_FAILURE', () => {
    const action = {
      type: actionTypes.FETCH_DOCUMENTS_FAILURE,
      error: 'Nyet'
    };

    expect(DocumentsReducer(Map(), action)).to.eql(Map({
      isFetching: false,
      documentsFetchError: 'Nyet'
    }));
  });

  it('handles EXPAND_DOCUMENT', () => {
    const state = Map({
      documentViewOptions: Map({
        expandedDocId: ''
      })
    });
    const action = {
      type: actionTypes.EXPAND_DOCUMENT,
      docId: 123
    };

    expect(DocumentsReducer(state, action)).to.eql(Map({
      documentViewOptions: Map({
        expandedDocId: 123
      })
    }));
  });

  it('handles CREATE_DOCUMENT_REQUEST', () => {
    const state = Map({
      documents: List('these documents'.split(' ')),
      documentCrudOptions: Map()
    });
    const action = {
      type: actionTypes.CREATE_DOCUMENT_REQUEST,
      documentContent: {
        title: 'title',
        content: 'content'
      }
    };
    expect(DocumentsReducer(state, action)).to.eql(Map({
      documents: fromJS(
        [action.documentContent].concat(['these', 'documents'])
      ),
      documentCrudOptions: Map({
        documentContent: fromJS(action.documentContent),
        isFetching: true
      })
    }));
  });

  it('handles CREATE_DOCUMENT_SUCCESS', () => {
    const state = Map({
      documents: fromJS([{
        title: 'This should change'
      }, {
        title: 'This should not.'
      }]),
      documentCrudOptions: Map({
        documentContent: Map({
          title: 'This should change'
        })
      })
    });

    const action = {
      type: actionTypes.CREATE_DOCUMENT_SUCCESS,
      documentContent: {
        _id: 123,
        title: 'This did change',
        content: 'Yay!'
      }
    };

    expect(DocumentsReducer(state, action)).to.eql(Map({
      documents: fromJS(
        [action.documentContent].concat([{title: 'This should not.'}])
      ),
      documentCrudOptions: INITIAL_DOCUMENTS_STATE.get('documentCrudOptions')
    }));
  });

  it('handles CREATE_DOCUMENT_FAILURE', () => {
    const state = Map({
      documents: fromJS([{
        title: 'This should go'
      }, {
        title: 'This should not.'
      }]),
      documentCrudOptions: Map()
    });

    const action = {
      type: actionTypes.CREATE_DOCUMENT_FAILURE,
      error: {
        message: 'An error occurred.'
      }
    };

    expect(DocumentsReducer(state, action)).to.eql(Map({
      documents: fromJS([{title: 'This should not.'}]),
      documentCrudOptions: Map({
        isFetching: false,
        isShowingCreateModal: true,
        crudError: fromJS(action.error)
      })
    }));
  });

  it('handles UPDATE_NEW_DOCUMENT_CONTENTS', () => {
    const state = Map({
      documentCrudOptions: Map({
        documentContent: Map()
      })
    });

    const action = {
      type: actionTypes.UPDATE_NEW_DOCUMENT_CONTENTS,
      documentContent: {
        title: 'test',
        content: 'content'
      }
    };

    expect(DocumentsReducer(state, action)).to.eql(Map({
      documentCrudOptions: Map({
        documentContent: fromJS(action.documentContent)
      })
    }));
  });

  it('handles TOGGLE_CREATE_MODAL', () => {
    const state = Map({
      documentCrudOptions: Map({
        isShowingCreateModal: false
      })
    });
    const action = {
      type: actionTypes.TOGGLE_CREATE_MODAL
    };
    expect(DocumentsReducer(state, action)).to.eql(Map({
      documentCrudOptions: Map({
        isShowingCreateModal: true
      })
    }));
  });

  it('handles DOCUMENT_UPDATE_REQUEST', () => {
    const state = Map({
      documentCrudOptions: Map()
    });
    const action = {
      type: actionTypes.DOCUMENT_UPDATE_REQUEST,
      document: {
        title: 'test'
      }
    };
    expect(DocumentsReducer(state, action)).to.eql(Map({
      documentCrudOptions: Map({
        documentContent: Map({
          title: 'test'
        }),
        isFetching: true,
        isShowingCreateModal: false
      })
    }));
  });

  it('handles DOCUMENT_UPDATE_SUCCESS', () => {
    const state = Map({
      documents: fromJS([{
        _id: 1,
        title: 'This should remain unchanged.'
      }, {
        _id: 2,
        title: 'This should not.'
      }]),
      documentCrudOptions: Map()
    });

    const action = {
      type: actionTypes.DOCUMENT_UPDATE_SUCCESS,
      document: {
        _id: 2,
        title: 'That changed.'
      }
    };

    expect(DocumentsReducer(state, action)).to.eql(Map({
      documents: fromJS([{
        _id: 1,
        title: 'This should remain unchanged.'
      }, {
        _id: 2,
        title: 'That changed.'
      }]),
      documentCrudOptions: INITIAL_DOCUMENTS_STATE.get('documentCrudOptions')
    }));
  });

  it('handles DOCUMENT_UPDATE_FAILURE', () => {
    const state = Map({
      documentCrudOptions: Map({
        documentContent: Map()
      })
    });
    const action = {
      type: actionTypes.DOCUMENT_UPDATE_FAILURE,
      error: {
        message: 'Something happened.'
      }
    };

    expect(DocumentsReducer(state, action)).to.eql(Map({
      documentCrudOptions: Map({
        documentContent: Map(),
        isFetching: false,
        isShowingCreateModal: true,
        isUpdatingDocument: true,
        crudError: fromJS(action.error)
      })
    }));
  });

  it.skip('handles DOCUMENT_ROLE_UPDATE', () => {
    // TODO: Write tests for every variation of role updates.
  });

  it('handles TOGGLE_SHOW_DOCUMENT_UPDATE', () => {
    const state = Map({
      documentCrudOptions: Map({
        documentContent: Map({
          title: 'Test',
          content: 'This will be deleted.',
          role: 'public'
        }),
        isShowingCreateModal: true,
        isUpdatingDocument: true
      })
    });
    const action = {
      type: actionTypes.TOGGLE_SHOW_DOCUMENT_UPDATE,
      document: {
        title: 'Does not matter'
      }
    };

    expect(DocumentsReducer(state, action)).to.eql(Map({
      documentCrudOptions: Map({
        documentContent: Map({
          title: '',
          content: '',
          role: ''
        }),
        isShowingCreateModal: false,
        isUpdatingDocument: false
      })
    }));
  });

  it('handles DELETE_DOCUMENT_REQUEST', () => {
    const state = Map({
      documents: fromJS([{
        _id: 1,
        title: 'This should remain unchanged.'
      }, {
        _id: 2,
        title: 'This should not.'
      }]),
      documentCrudOptions: Map()
    });

    const action = {
      type: actionTypes.DELETE_DOCUMENT_REQUEST,
      documentId: 2
    };

    expect(DocumentsReducer(state, action)).to.eql(Map({
      documents: fromJS([{
        _id: 1,
        title: 'This should remain unchanged.'
      }]),
      documentCrudOptions: Map({
        deletedDocument: Map({
          index: 1,
          item: fromJS({
            _id: 2,
            title: 'This should not.'
          })
        })
      })
    }));
  });

  it('handles DELETE_DOCUMENT_SUCCESS', () => {
    const state = Map({
      documentCrudOptions: Map({
        deletedDocument: Map({
          index: 1,
          item: fromJS({
            _id: 2,
            title: 'This should not.'
          })
        })
      })
    });
    const action = {
      type: actionTypes.DELETE_DOCUMENT_SUCCESS
    };

    expect(DocumentsReducer(state, action)).to.eql(Map({
      documentCrudOptions: INITIAL_DOCUMENTS_STATE.get('documentCrudOptions')
    }));
  });

  it('handles DELETE_DOCUMENT_SUCCESS with specified document ID', () => {
    const state = Map({
      documents: fromJS([{
        _id: 1,
        title: 'This should be deleted.'
      }, {
        _id: 2,
        title: 'This should not.'
      }]),
      documentCrudOptions: Map()
    });

    const action = {
      type: actionTypes.DELETE_DOCUMENT_SUCCESS,
      docId: 1
    };

    expect(DocumentsReducer(state, action)).to.eql(Map({
      documents: fromJS([{
        _id: 2,
        title: 'This should not.'
      }]),
      documentCrudOptions: INITIAL_DOCUMENTS_STATE.get('documentCrudOptions')
    }));
  });

  it('handles DELETE_DOCUMENT_FAILURE', () => {
    const state = Map({
      documents: fromJS([{
        _id: 1,
        title: 'This should remain unchanged.'
      }]),
      documentCrudOptions: Map({
        deletedDocument: Map({
          index: 1,
          item: fromJS({
            _id: 2,
            title: 'This should not.'
          })
        })
      })
    });
    const action = {
      type: actionTypes.DELETE_DOCUMENT_FAILURE,
      error: 'Network Error'
    };

    expect(DocumentsReducer(state, action)).to.eql(Map({
      documents: fromJS([{
        _id: 1,
        title: 'This should remain unchanged.'
      }, {
        _id: 2,
        title: 'This should not.'
      }]),
      documentCrudOptions: Map({
        deletedDocument: Map(),
        crudError: fromJS(action.error)
      })
    }));
  });

  it('handles VALIDATE_NEW_DOCUMENT_CONTENTS', () => {
    const state = Map({
      documentContent: Map({
        title: null
      })
    });
    const action = {
      type: actionTypes.VALIDATE_NEW_DOCUMENT_CONTENTS,
      field: 'title'
    };

    expect(DocumentsReducer(state, action)).to.eql(Map({
      documentContent: Map({
        title: null
      }),
      documentCrudOptions: Map({
        validations: Map({
          title: 'This field is required',
          isValid: false
        })
      })
    }));
  });

  it('handles CHANGE_DOCUMENTS_FILTER', () => {
    const state = Map({
      documentViewOptions: Map({
        visibleFilter: 'public'
      })
    });
    const action = {
      type: actionTypes.CHANGE_DOCUMENTS_FILTER,
      filter: 'private'
    };

    expect(DocumentsReducer(state, action)).to.eql(Map({
      documentViewOptions: Map({
        visibleFilter: 'private'
      })
    }));
  });

  it('handles LOGOUT_REQUEST', () => {
    expect(DocumentsReducer(Map(), {type: actionTypes.LOGOUT_REQUEST}))
      .to.eql(INITIAL_DOCUMENTS_STATE);
  });
});
