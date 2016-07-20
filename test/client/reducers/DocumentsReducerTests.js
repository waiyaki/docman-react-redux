import { fromJS, Map, List } from 'immutable';
import { expect } from 'chai';

import * as actionTypes from '../../../client/src/constants';

import documentsReducer, {
  INITIAL_DOCUMENTS_STATE
} from '../../../client/src/reducers/DocumentsReducer';

describe('Documents Reducer', () => {
  it('return the initial state', () => {
    expect(documentsReducer(undefined, {})).to.eql(INITIAL_DOCUMENTS_STATE);
  });

  it('handles FETCH_DOCUMENTS_REQUEST', () => {
    expect(documentsReducer(Map(), {
      type: actionTypes.FETCH_DOCUMENTS_REQUEST
    })).to.have.property('isFetching', true);
  });

  it('handles FETCH_DOCUMENTS_SUCCESS', () => {
    const action = {
      type: actionTypes.FETCH_DOCUMENTS_SUCCESS,
      documents: 'Dummy docs'.split(' ')
    };

    const nextState = documentsReducer(Map(), action);
    expect(nextState).to.have.property('isFetching', false);
    expect(nextState).to.have.property('documents')
      .that.equals(List(['Dummy', 'docs']));
  });

  it('handles FETCH_DOCUMENTS_FAILURE', () => {
    const action = {
      type: actionTypes.FETCH_DOCUMENTS_FAILURE,
      error: 'Nyet'
    };

    const nextState = documentsReducer(Map(), action);
    expect(nextState).to.have.property('isFetching', false);
    expect(nextState).to.have.property('documentsFetchError', 'Nyet');
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

    expect(documentsReducer(state, action))
      .to.have.property('documentViewOptions', Map({
        expandedDocId: 123
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

    const nextState = documentsReducer(state, action);
    expect(nextState)
      .to.have.property('documents')
      .that.equals(
        List(fromJS([action.documentContent]).concat(state.get('documents')))
      );
    expect(nextState)
      .to.have.property('documentCrudOptions')
      .with.property('documentContent')
      .that.equals(fromJS(action.documentContent));
    expect(nextState)
      .to.have.property('documentCrudOptions')
      .with.property('isFetching', true);
  });

  it('handles CREATE_DOCUMENT_SUCCESS for other peoples documents', () => {
    const state = Map({
      documents: fromJS([{
        title: 'This should not change'
      }, {
        title: 'This should not.'
      }])
    });

    const action = {
      type: actionTypes.CREATE_DOCUMENT_SUCCESS,
      documentContent: {
        _id: 123,
        title: 'This did get added!',
        content: 'Yay!'
      }
    };

    expect(documentsReducer(state, action))
      .to.have.property('documents')
      .that.equals(fromJS([action.documentContent]).concat(fromJS([{
        title: 'This should not change'
      }, {
        title: 'This should not.'
      }])));
  });

  it('handles CREATE_DOCUMENT_SUCCESS for own documents', () => {
    const state = Map({
      documents: fromJS([{
        _id: '1',
        title: 'This should not change.'
      }, {
        _id: '2',
        title: 'This should not change.'
      }, {
        _id: '3',
        title: 'This should change.',
        optimistic: true
      }]),
      documentCrudOptions: Map({
        documentContent: Map({
          _id: '3',
          title: 'This should change.',
          optimistic: true
        })
      })
    });

    const action = {
      type: actionTypes.CREATE_DOCUMENT_SUCCESS,
      documentContent: {
        _id: 123,
        title: 'This did change!',
        content: 'Yay!'
      },
      own: true
    };

    const nextState = documentsReducer(state, action);
    expect(nextState).to.eql(Map({
      isFetching: false,
      documents: fromJS([{
        _id: '1',
        title: 'This should not change.'
      }, {
        _id: '2',
        title: 'This should not change.'
      }, {
        _id: 123,
        title: 'This did change!',
        content: 'Yay!'
      }]),
      documentCrudOptions: INITIAL_DOCUMENTS_STATE.get('documentCrudOptions'),
      documentsFetchError: null,
      documentViewOptions: Map({ expandedDocId: '', visibleFilter: 'all' })
    }));
  });

  it('handles CREATE_DOCUMENT_FAILURE', () => {
    const state = Map({
      documents: fromJS([{
        title: 'This should go',
        optimistic: true
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

    const nextState = documentsReducer(state, action);
    expect(nextState)
      .to.have.property('documents')
      .that.equals(fromJS([{ title: 'This should not.' }]));

    expect(nextState)
      .to.have.property('documentCrudOptions')
      .with.property('isFetching', false);
    expect(nextState)
      .to.have.property('documentCrudOptions')
      .with.property('isShowingCreateModal', true);
    expect(nextState)
      .to.have.property('documentCrudOptions')
      .with.property('crudError', fromJS(action.error));
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

    expect(documentsReducer(state, action))
      .to.have.property('documentCrudOptions')
      .with.property('documentContent', fromJS(action.documentContent));
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

    expect(documentsReducer(state, action))
      .to.have.property('documentCrudOptions')
      .with.property('isShowingCreateModal', true);
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

    const nextState = documentsReducer(state, action);
    expect(nextState)
      .to.have.property('documentCrudOptions')
      .with.property('isFetching', true);
    expect(nextState)
      .to.have.property('documentCrudOptions')
      .with.property('isShowingCreateModal', false);
    expect(nextState)
      .to.have.property('documentCrudOptions')
      .with.property('documentContent', fromJS(action.document));
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

    expect(documentsReducer(state, action)).to.eql(Map({
      isFetching: false,
      documents: fromJS([{
        _id: 1,
        title: 'This should remain unchanged.'
      }, {
        _id: 2,
        title: 'That changed.'
      }]),
      documentCrudOptions: INITIAL_DOCUMENTS_STATE.get('documentCrudOptions'),
      documentsFetchError: null,
      documentViewOptions: Map({ expandedDocId: '', visibleFilter: 'all' })
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

    const nextState = documentsReducer(state, action);
    expect(nextState)
      .to.have.property('documentCrudOptions')
      .with.property('isFetching', false);
    expect(nextState)
      .to.have.property('documentCrudOptions')
      .with.property('isShowingCreateModal', true);
    expect(nextState)
      .to.have.property('documentCrudOptions')
      .with.property('isUpdatingDocument', true);
    expect(nextState)
      .to.have.property('documentCrudOptions')
      .with.property('crudError', fromJS(action.error));
  });

  describe('handles DOCUMENT_ROLE_UPDATE', () => {
    const documents = [{
      _id: 1,
      title: 'test 1',
      role: {
        title: 'public'
      }
    }, {
      _id: 2,
      title: 'test 2',
      role: {
        title: 'public'
      }
    }, {
      _id: 3,
      title: 'test 3',
      role: {
        title: 'public'
      }
    }];

    const state = Map({
      documents: fromJS(documents)
    });

    it('on a document with role we can still access', () => {
      const action = {
        type: actionTypes.DOCUMENT_ROLE_UPDATE,
        allowAccess: true,
        document: {
          _id: 3,
          title: 'test 3 updated',
          role: {
            title: 'admin'
          }
        }
      };

      const expectedDocuments = [
        ...documents.slice(0, 2),
        {
          _id: 3,
          title: 'test 3 updated',
          role: {
            title: 'admin'
          }
        }
      ];
      expect(documentsReducer(state, action)).to.eql(Map({
        documents: fromJS(expectedDocuments),
        documentsFetchError: null,
        documentViewOptions: Map({ expandedDocId: '', visibleFilter: 'all' }),
        isFetching: false,
        documentCrudOptions: INITIAL_DOCUMENTS_STATE.get('documentCrudOptions')
      }));
    });

    it('on a document we already have but can no longer access', () => {
      const action = {
        type: actionTypes.DOCUMENT_ROLE_UPDATE,
        allowAccess: false,
        document: {
          _id: 3
        }
      };

      const expectedDocuments = documents.slice(0, 2);
      expect(documentsReducer(state, action)).to.eql(Map({
        documents: fromJS(expectedDocuments),
        documentsFetchError: null,
        documentViewOptions: Map({ expandedDocId: '', visibleFilter: 'all' }),
        isFetching: false,
        documentCrudOptions: INITIAL_DOCUMENTS_STATE.get('documentCrudOptions')
      }));
    });

    it('on a document we can access but do not already have in state', () => {
      const action = {
        type: actionTypes.DOCUMENT_ROLE_UPDATE,
        allowAccess: true,
        document: {
          _id: 4,
          title: 'test 4 updated',
          role: {
            title: 'public'
          }
        }
      };

      const expectedDocuments = [
        action.document,
        ...documents
      ];
      expect(documentsReducer(state, action)).to.eql(Map({
        documents: fromJS(expectedDocuments),
        documentsFetchError: null,
        documentViewOptions: Map({ expandedDocId: '', visibleFilter: 'all' }),
        isFetching: false,
        documentCrudOptions: INITIAL_DOCUMENTS_STATE.get('documentCrudOptions')
      }));
    });
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

    const nextState = documentsReducer(state, action);
    expect(nextState)
      .to.have.property('documentCrudOptions')
      .with.property('isShowingCreateModal', false);
    expect(nextState)
      .to.have.property('documentCrudOptions')
      .with.property('isUpdatingDocument', false);
    expect(nextState)
      .to.have.property('documentCrudOptions')
      .with.property('documentContent', Map({
        title: '',
        content: '',
        role: ''
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
      deletedDocument: {
        index: 1,
        item: fromJS({
          _id: 2,
          title: 'This should not.'
        })
      }
    };

    const nextState = documentsReducer(state, action);

    expect(nextState)
      .to.have.property('documents')
      .that.equals(fromJS([{
        _id: 1,
        title: 'This should remain unchanged.'
      }]));

    expect(nextState)
      .to.have.property('documentCrudOptions')
      .with.property('deletedDocument', Map({
        index: 1,
        item: fromJS({
          _id: 2,
          title: 'This should not.'
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

    expect(documentsReducer(state, action)).to.eql(Map({
      documentCrudOptions: INITIAL_DOCUMENTS_STATE.get('documentCrudOptions'),
      documentsFetchError: null,
      documentViewOptions: Map({ expandedDocId: '', visibleFilter: 'all' }),
      isFetching: false,
      documents: List()
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

    expect(documentsReducer(state, action)).to.eql(Map({
      documents: fromJS([{
        _id: 2,
        title: 'This should not.'
      }]),
      documentCrudOptions: INITIAL_DOCUMENTS_STATE.get('documentCrudOptions'),
      documentsFetchError: null,
      documentViewOptions: Map({ expandedDocId: '', visibleFilter: 'all' }),
      isFetching: false
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
      error: 'Network Error',
      deletedDocument: {
        index: 1,
        item: {
          _id: 2,
          title: 'This should not.'
        }
      }
    };

    const nextState = documentsReducer(state, action);
    expect(nextState)
      .to.have.property('documentCrudOptions')
      .with.property('deletedDocument', Map());
    expect(nextState)
      .to.have.property('documentCrudOptions')
      .with.property('crudError', fromJS(action.error));

    expect(nextState)
      .to.have.property('documents')
      .that.equals(fromJS([{
        _id: 1,
        title: 'This should remain unchanged.'
      }, {
        _id: 2,
        title: 'This should not.'
      }]));
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

    const nextState = documentsReducer(state, action);
    expect(nextState)
      .to.have.property('documentContent', Map({
        title: null
      }));

    expect(nextState)
      .to.have.property('documentCrudOptions')
      .with.property('validations', Map({
        title: 'This field is required',
        isValid: false
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

    expect(documentsReducer(state, action))
      .to.have.property('documentViewOptions', Map({
        visibleFilter: 'private'
      }));
  });

  it('handles LOGOUT_REQUEST', () => {
    expect(documentsReducer(Map(), { type: actionTypes.LOGOUT_REQUEST }))
      .to.eql(INITIAL_DOCUMENTS_STATE);
  });
});
