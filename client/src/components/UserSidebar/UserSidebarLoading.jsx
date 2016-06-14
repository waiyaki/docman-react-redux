import React from 'react';

import { Card } from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';

export default function UserSidebarLoading() {
  return (
    <div className='sidebar'>
      <Card className='sidebar-card__loading center' zDepth={0}>
        <span>
          <CircularProgress />
        </span>
      </Card>
    </div>
  );
}
