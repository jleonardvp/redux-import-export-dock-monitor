Redux Import Export Dock Monitor
==============================

A simple monitor for [Redux DevTools](https://github.com/gaearon/redux-devtools) that enables exporting, then importing the serialized state of a Redux application from disk.

### Installation

```
npm install --save-dev redux-import-export-dock-monitor
```

### Usage

Include the monitor while setting up the DevTools:

##### `containers/DevTools.js`

```js
import React from 'react';
import { createDevTools } from 'redux-devtools';
import DockMonitor from 'redux-devtools-dock-monitor';
import ImportExportMonitor from 'redux-import-export-monitor';

export default createDevTools(<DockMonitor><ImportExportMonitor /></DockMonitor>);
```

### License

MIT 
