var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.


// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform != 'darwin')
        app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function () {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600});

    console.log('ready');
    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    // TODO: configurable
    var dir = 'D:\\Dropbox\\problems\\';
    require('ipc').on('load-problems', function () {
        var wrench = require('wrench');

        wrench.readdirRecursive(dir, function (error, files) {
            if (files === null) {
                mainWindow.webContents.send('problem-list-done');
            } else {
                var ls = [];
                files.forEach(function (file) {
                    if (file.endsWith('\\init.json'))
                        ls.push(file.replace('\\init.json', ''));
                });
                mainWindow.webContents.send('problem-list', ls);
            }
        });
    }).on('query-problem-data', function (event, data) {
        require('fs').readFile(dir + '\\' + data + '\\init.json', function (err, data) {
            event.sender.send('problem-data', data.toString());
        });
    });

    mainWindow.webContents.on('new-window', function (event, url) {
        event.preventDefault();
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});
