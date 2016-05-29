import { app, Menu, protocol } from 'electron';
import { devMenuTemplate } from './helpers/dev_menu_template';
import { editMenuTemplate } from './helpers/edit_menu_template';
import createWindow from './helpers/window';
import fs from 'fs'
import path from 'path'
import jade from 'jade'
import _extend from 'util'
import mime from 'mime'

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';
import { paths } from './views';

let mainWindow;

let setApplicationMenu = function () {
    let menus = [editMenuTemplate];
    if (env.name !== 'production') {
        menus.push(devMenuTemplate);
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

app.on('ready', function () {
    setApplicationMenu();

    let getPath = function(url) {
      let parsed = require('url').parse(url);
      let result = parsed.pathname;

      // Local files in windows start with slash if no host is given
      // file:///c:/something.jade
      if(process.platform === 'win32' && !parsed.host.trim()) {
        result = result.substr(1);
      }

      return result;
    }

    protocol.interceptBufferProtocol('file', function(request, callback) {
      let file = getPath(request.url);

      try {
        var ext = path.extname(file);
        if (ext == ".dmoj") {
          console.log("Requesting view " + file);

          let view = paths[file.replace(".dmoj", "")](request);

          let jadeLocals = view.locals || {};
          file = __dirname + '/templates/' + view.view;

          let compiled = jade.compileFile(file, {})(jadeLocals);

          return callback({data: new Buffer(compiled), mimeType:'text/html'});
        } else {
          let content = fs.readFileSync(__dirname + '/' + file);
          return callback({data: content, mimeType: mime.lookup(ext)});
        }
      } catch (e) {
        console.log(e);
        // See here for error numbers:
        // https://code.google.com/p/chromium/codesearch#chromium/src/net/base/net_error_list.h
       if (e.code === 'ENOENT') {
         // NET_ERROR(FILE_NOT_FOUND, -6)
         return callback(6);
       }

       // All other possible errors return a generic failure
       // NET_ERROR(FAILED, -2)
       return callback(2);
      }
    }, function (error, scheme) {
    });

    let mainWindow = createWindow('main', {
        width: 1000,
        height: 600
    });

    mainWindow.loadURL('file:///home.dmoj');

    // if (env.name !== 'production') {
    //    mainWindow.openDevTools();
    // }
});

app.on('window-all-closed', function () {
    app.quit();
});
