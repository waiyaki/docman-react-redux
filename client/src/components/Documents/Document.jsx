import md5 from 'blueimp-md5';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import {
  Card, CardHeader, CardText, CardTitle
} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';
import ExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import CircularProgress from 'material-ui/CircularProgress';

import Chip from './Chip';

const Document = (props) => {
  // Construct a url for this document owner's gravatar.
  const owner = props.document.owner;
  const ownerGravatar = `https://www.gravatar.com/avatar/${owner
    ? md5(owner.email) : ''}?d=identicon`;

  const updatedAt = new Date(props.document.updatedAt);

  // Determine whether we are updating this document and show a spinner
  const updatingSelf = (doc) => props.documentCrudOptions.isFetching &&
    props.documentCrudOptions.isUpdatingDocument &&
    props.documentCrudOptions.documentContent._id === doc._id;

  return (
    <Card
      className='document-card'
      expanded={props.expandedDocId === props.document._id}
      zDepth={props.expandedDocId === props.document._id ? 3 : 1}
    >
      <CardHeader
        avatar={`${ownerGravatar}&s=40`}
        style={{ paddingBottom: '0.5em' }}
        subtitle={owner && owner.role ? owner.role.title : ''}
        title={
          <Link
            className='username-link'
            to={{
              pathname: `/@${owner.username}`,
              state: { username: owner.username, _id: owner._id }
            }}
          >
            {owner.name
              ? `${owner.name.firstName} ${owner.name.lastName}`
              : owner.username
            }
          </Link>
        }
      >
        {props.shouldWeAllowEditDocument // eslint-disable-line
          ? updatingSelf(props.document)
            ? <CircularProgress
              size={0.5}
              style={{
                position: 'absolute',
                right: '4px'
              }}
            />
            : <IconMenu
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
              iconButtonElement={
                <IconButton><MoreVertIcon /></IconButton>
              }
              style={{
                position: 'absolute',
                right: '4px'
              }}
              targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
              <MenuItem
                onTouchTap={() => props.onUpdateThisDocument(props.document)}
                primaryText='Edit Document'
              />
              <MenuItem
                onTouchTap={() => props.onDeleteDocument(props.document._id)}
                primaryText='Delete Document'
              />
            </IconMenu>
          : null
        }
      </CardHeader>
      <CardTitle
        style={{ paddingTop: '0.5em' }}
        subtitle={
          <span>
            {updatedAt.toDateString()}, {updatedAt.toLocaleTimeString()} <br />
            <Chip content={props.document.role.title} />
          </span>
        }
        title={props.document.title.length > 64 &&
            props.expandedDocId !== props.document._id
          ? `${props.document.title.slice(0, 64)}...`
          : props.document.title
        }
      />
      {(props.document.content.length > 250 ||
        props.document.title.length > 64) &&
        props.expandedDocId !== props.document._id
      ?
        <CardText>
          <span>{props.document.content.slice(0, 250)}</span><br />
          <IconButton
            onClick={() => props.onExpandChange(props.document._id)}
            tooltip='View More'
          >
            <MoreHorizIcon />
          </IconButton>
        </CardText>
      :
        <CardText>
          {props.document.content}
        </CardText>
      }
      <CardText expandable>
        <IconButton
          onClick={() => props.onExpandChange()}
          tooltip='View Less'
        >
          <ExpandLess />
        </IconButton>
      </CardText>
    </Card>
  );
};

Document.propTypes = {
  document: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    role: PropTypes.shape({
      title: PropTypes.string.isRequired
    }).isRequired,
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
  }).isRequired,
  documentCrudOptions: PropTypes.object, // eslint-disable-line
  expandedDocId: PropTypes.string.isRequired,
  onDeleteDocument: PropTypes.func.isRequired,
  onExpandChange: PropTypes.func.isRequired,
  onUpdateThisDocument: PropTypes.func.isRequired,
  shouldWeAllowEditDocument: PropTypes.bool
};

export default Document;
