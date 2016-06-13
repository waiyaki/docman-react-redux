import Axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import {expect} from 'chai';
import {Map} from 'immutable';

import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as actionTypes from '../../../client/src/constants';
import * as documentActions from '../../../client/src/actions/DocumentsActions';
// eslint-disable-next-line
import {
  __RewireAPI__ as docsActionsRewireAPI
} from '../../../client/src/actions/DocumentsActions';

const TOKEN = 'test.auth.token';

// Set up mocks for async actions
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// Mock an axios instance to use in the tests and then rewire the imported
// modules to use the instance with the mocked handler. Also rewire
// `getAuthToken` to avoid accessing `window.localStorage`.
let axiosInstance = Axios.create();
const mockAxios = new AxiosMockAdapter(axiosInstance);

docsActionsRewireAPI.__Rewire__('Axios', axiosInstance);
docsActionsRewireAPI.__Rewire__('getAuthToken', () => TOKEN);

describe('DocumentsActions', () => {
  describe('.fetchDocumentsFromServer()', () => {
    afterEach(() => {
      mockAxios.reset();
    });

    it('creates FETCH_DOCUMENTS_REQUEST and FETCH_DOCUMENTS_SUCCESS actions' +
       'on successful documents fetch',
      () => {
        const documents = 'this is a list of dummy things'.split();
        mockAxios
          .onGet('/api/documents')
          .reply(200, documents);

        const expectedActions = [{
          type: actionTypes.FETCH_DOCUMENTS_REQUEST
        }, {
          type: actionTypes.FETCH_DOCUMENTS_SUCCESS,
          documents
        }];

        const store = mockStore();
        return store.dispatch(documentActions.fetchDocumentsFromServer())
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
          });
      }
    );

    it('creates FETCH_DOCUMENTS_REQUEST and FETCH_DOCUMENTS_FAILURE on error ' +
       'while fetching documents from server',
      () => {
        const error = {
          message: 'That was unexpected.'
        };
        mockAxios
          .onGet('/api/documents')
          .reply(400, error);

        const expectedActions = [{
          type: actionTypes.FETCH_DOCUMENTS_REQUEST
        }, {
          type: actionTypes.FETCH_DOCUMENTS_FAILURE,
          error
        }];

        const store = mockStore();
        return store.dispatch(documentActions.fetchDocumentsFromServer())
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
          });
      }
    );
  });

  it('creates an EXPAND_DOCUMENT action with document id', () => {
    const docId = '123456';
    const expectedAction = [{
      type: actionTypes.EXPAND_DOCUMENT,
      docId
    }];
    const store = mockStore();
    store.dispatch(documentActions.expandDocument(docId));
    expect(store.getActions()).to.eql(expectedAction);
  });

  it('creates an EXPAND_DOCUMENT action without a document id', () => {
    const expectedAction = [{
      type: actionTypes.EXPAND_DOCUMENT,
      docId: ''
    }];
    const store = mockStore();
    store.dispatch(documentActions.expandDocument());
    expect(store.getActions()).to.eql(expectedAction);
  });

  describe('.createDocument()', () => {
    const getState = () => {
      return Map({
        auth: Map({
          user: {
            username: 'test'
          }
        })
      });
    };

    afterEach(() => {
      mockAxios.reset();
    });

    it('creates CREATE_DOCUMENT_REQUEST and SHOW_SNACKBAR_MESSAGE upon ' +
      'successful creation of a non-private document.',
      () => {
        const documentContent = {
          title: 'test',
          content: 'test content',
          role: {
            title: 'public'
          }
        };

        mockAxios
          .onPost('/api/documents')
          .reply(201, documentContent);

        const expectedActions = [{
          type: actionTypes.CREATE_DOCUMENT_REQUEST,
          documentContent
        }, {
          type: actionTypes.SHOW_SNACKBAR_MESSAGE,
          message: 'Successfully created document.'
        }];

        const store = mockStore(getState);
        return store.dispatch(documentActions.createDocument(documentContent))
          .then(() => {
            const actions = store.getActions();
            expect(actions).to.have.lengthOf(2);
            expect(actions).to.have.deep.property('[1]')
              .that.is.an('object')
              .that.deep.equals(expectedActions[1]);

            const createDocRequest = actions[0];
            expect(createDocRequest).to.have.property('type')
              .that.equals(expectedActions[0].type);
            expect(createDocRequest).to.have.property('documentContent')
              .that.includes.keys('title', 'content', 'role');
          });
      }
    );

    it('creates CREATE_DOCUMENT_REQUEST, CREATE_DOCUMENT_SUCCESS and ' +
      'SHOW_SNACKBAR_MESSAGE actions after creating a private document',
      () => {
        const documentContent = {
          title: 'test',
          content: 'test content',
          role: {
            title: 'private'
          }
        };

        mockAxios
          .onPost('/api/documents')
          .reply(201, documentContent);

        const expectedActions = [{
          type: actionTypes.CREATE_DOCUMENT_REQUEST,
          documentContent
        }, {
          type: actionTypes.CREATE_DOCUMENT_SUCCESS,
          documentContent,
          own: true
        }, {
          type: actionTypes.SHOW_SNACKBAR_MESSAGE,
          message: 'Successfully created document.'
        }];

        const store = mockStore(getState);
        return store.dispatch(documentActions.createDocument(documentContent))
          .then(() => {
            const actions = store.getActions();
            expect(actions).to.have.lengthOf(3);

            const createDocRequest = actions[0];
            expect(createDocRequest).to.have.property('type')
              .that.equals(expectedActions[0].type);
            expect(createDocRequest).to.have.property('documentContent')
              .that.includes.keys('title', 'content', 'role');

            expect(actions).to.have.deep.property('[1]')
              .that.is.an('object')
              .that.deep.equals(expectedActions[1]);

            expect(actions).to.have.deep.property('[2]')
              .that.is.an('object')
              .that.deep.equals(expectedActions[2]);
          });
      }
    );

    it('creates CREATE_DOCUMENT_REQUEST, CREATE_DOCUMENT_FAILURE and ' +
      'SHOW_SNACKBAR_MESSAGE upon failing to create a document.',
      () => {
        const documentContent = {
          title: 'test',
          content: 'test content',
          role: {
            title: 'public'
          }
        };

        const error = {
          message: 'Bad Request.'
        };

        mockAxios
          .onPost('/api/documents')
          .reply(400, error);

        const expectedActions = [{
          type: actionTypes.CREATE_DOCUMENT_REQUEST,
          documentContent
        }, {
          type: actionTypes.CREATE_DOCUMENT_FAILURE,
          error
        }, {
          type: actionTypes.SHOW_SNACKBAR_MESSAGE,
          message: 'Uh oh! An error occurred.'
        }];

        const store = mockStore(getState);
        return store.dispatch(documentActions.createDocument(documentContent))
          .then(() => {
            expect(store.getActions().slice(1))
              .to.eql(expectedActions.slice(1));
          });
      }
    );
  });

  it('creates a TOGGLE_CREATE_MODAL action', () => {
    const expectedAction = [{
      type: actionTypes.TOGGLE_CREATE_MODAL
    }];
    const store = mockStore();
    store.dispatch(documentActions.toggleCreateModal());
    expect(store.getActions()).to.eql(expectedAction);
  });

  it('creates an UPDATE_NEW_DOCUMENT_CONTENTS action', () => {
    const documentContent = {
      title: 'test',
      content: 'test content',
      role: {
        title: 'private'
      }
    };
    const expectedAction = [{
      type: actionTypes.UPDATE_NEW_DOCUMENT_CONTENTS,
      documentContent
    }];
    const store = mockStore();
    store.dispatch(documentActions.updateNewDocumentContents(documentContent));
    expect(store.getActions()).to.eql(expectedAction);
  });

  it('creates a VALIDATE_NEW_DOCUMENT_CONTENTS action', () => {
    const field = 'username';
    const expectedAction = [{
      type: actionTypes.VALIDATE_NEW_DOCUMENT_CONTENTS,
      field
    }];
    const store = mockStore();
    store.dispatch(documentActions.validateDocumentContents(field));
    expect(store.getActions()).to.eql(expectedAction);
  });

  describe('.updateDocument()', () => {
    const documentContent = {
      _id: 123456,
      title: 'test',
      content: 'test content',
      role: {
        title: 'public'
      }
    };

    afterEach(() => {
      mockAxios.reset();
    });

    it('creates DOCUMENT_UPDATE_REQUEST and SHOW_SNACKBAR_MESSAGE actions' +
      'upon the successful update of a non-private document.',
      () => {
        mockAxios
          .onPut(`/api/documents/${documentContent._id}`)
          .reply(200, documentContent);

        const expectedActions = [{
          type: actionTypes.DOCUMENT_UPDATE_REQUEST,
          document: documentContent
        }, {
          type: actionTypes.SHOW_SNACKBAR_MESSAGE,
          message: 'Successfully updated document.'
        }];

        const store = mockStore();
        return store.dispatch(documentActions.updateDocument(documentContent))
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
          });
      }
    );

    it('creates DOCUMENT_UPDATE_REQUEST, DOCUMENT_UPDATE_SUCCESS and ' +
      'SHOW_SNACKBAR_MESSAGE actions after updating a private document',
      () => {
        const newContent = Object.assign({}, documentContent, {
          role: {
            title: 'private'
          }
        });

        mockAxios
          .onPut(`/api/documents/${documentContent._id}`)
          .reply(200, newContent);

        const expectedActions = [{
          type: actionTypes.DOCUMENT_UPDATE_REQUEST,
          document: newContent
        }, {
          type: actionTypes.DOCUMENT_UPDATE_SUCCESS,
          document: newContent
        }, {
          type: actionTypes.SHOW_SNACKBAR_MESSAGE,
          message: 'Successfully updated document.'
        }];

        const store = mockStore();
        return store.dispatch(documentActions.updateDocument(newContent))
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
          });
      }
    );

    it('creates DOCUMENT_UPDATE_REQUEST, DOCUMENT_UPDATE_FAILURE and ' +
      'SHOW_SNACKBAR_MESSAGE actions upon failing to update a document.',
      () => {
        const error = {
          message: 'Bad Request.'
        };

        mockAxios
          .onPut(`/api/documents/${documentContent._id}`)
          .reply(400, error);

        const expectedActions = [{
          type: actionTypes.DOCUMENT_UPDATE_REQUEST,
          document: documentContent
        }, {
          type: actionTypes.DOCUMENT_UPDATE_FAILURE,
          error
        }, {
          type: actionTypes.SHOW_SNACKBAR_MESSAGE,
          message: 'Error while updating document.'
        }];

        const store = mockStore();
        return store.dispatch(documentActions.updateDocument(documentContent))
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
          });
      }
    );
  });

  describe('.deleteDocument()', () => {
    const documentContent = {
      _id: 123456,
      title: 'test',
      content: 'test content',
      role: {
        title: 'public'
      }
    };

    afterEach(() => {
      mockAxios.reset();
    });

    it('creates DELETE_DOCUMENT_REQUEST and ' +
      'SHOW_SNACKBAR_MESSAGE actions after deleting a document',
      () => {
        mockAxios
          .onDelete(`/api/documents/${documentContent._id}`)
          .reply(200, documentContent);

        const expectedActions = [{
          type: actionTypes.DELETE_DOCUMENT_REQUEST,
          documentId: documentContent._id
        }, {
          type: actionTypes.SHOW_SNACKBAR_MESSAGE,
          message: 'Document deleted successfully.'
        }];

        const store = mockStore();
        return store
          .dispatch(documentActions.deleteDocument(documentContent._id))
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
          });
      }
    );

    it('creates DELETE_DOCUMENT_REQUEST, DELETE_DOCUMENT_FAILURE and ' +
      'SHOW_SNACKBAR_MESSAGE upon failing to delete a document.',
      () => {
        const error = {
          message: 'Bad Request.'
        };

        mockAxios
          .onDelete(`/api/documents/${documentContent._id}`)
          .reply(400, error);

        const expectedActions = [{
          type: actionTypes.DELETE_DOCUMENT_REQUEST,
          documentId: documentContent._id
        }, {
          type: actionTypes.DELETE_DOCUMENT_FAILURE,
          error
        }, {
          type: actionTypes.SHOW_SNACKBAR_MESSAGE,
          message: 'An error occurred while deleting document.'
        }];

        const store = mockStore();
        return store
          .dispatch(documentActions.deleteDocument(documentContent._id))
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
          });
      }
    );
  });

  it('creates a CHANGE_DOCUMENTS_FILTER action', () => {
    const filter = 'public';
    const expectedAction = [{
      type: actionTypes.CHANGE_DOCUMENTS_FILTER,
      filter
    }];
    const store = mockStore();
    store.dispatch(documentActions.changeDocumentsFilter(filter));
    expect(store.getActions()).to.eql(expectedAction);
  });
});
