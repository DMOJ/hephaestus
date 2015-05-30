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


    mainWindow.webContents.on('did-finish-load', function () {
        mainWindow.webContents.send('problem-list', [
            'dmpg15b1', 'dmpg15b2', 'dmpg15b3', 'dmpg15b4', 'dmpg15b5', 'dmpg15b6',
            'dmpg15s1', 'dmpg15s2', 'dmpg15s3', 'dmpg15s4', 'dmpg15s5', 'dmpg15s6',
            'dmpg15g1', 'dmpg15g2', 'dmpg15g3', 'dmpg15g4', 'dmpg15g5', 'dmpg15g6']);
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});
