import * as actionTypes from '../constants';
import socket from '../sockets';

import * as documentsActions from './DocumentsActions';

/**
 * Register user to receive data using websockets.
 * By default, the user is registered to the public documents room.
 *
 * If the user is an admin, they will be registered to the admin documents room
 * later via `subscribeToUpdates`.
 */
export function registerSockets () {
  socket.emit('role:join', 'public');

  return (dispatch) => {
    socket.on('document:create', (data) => {
      dispatch(documentsActions.createDocumentSuccess({data}));
    });

    socket.on('document:update', (data) => {
      dispatch(documentsActions.documentUpdateSuccess({data}));
    });

    socket.on('document:role-update', (data) => {
      dispatch(documentsActions.documentRoleUpdate({data}));
    });

    socket.on('document:delete', (docId) => {
      dispatch(documentsActions.documentDeleteSuccess(docId));
    });

    return {
      type: actionTypes.REGISTER_WEBSOCKETS
    };
  };
}

export function subscribeToUpdates (userDetails) {
  socket.emit('role:join', userDetails.role.title);
  socket.emit('role:join', userDetails.username);

  return {
    type: actionTypes.WEBSOCKET_UPDATES_SUBSCRIPTION
  };
}
