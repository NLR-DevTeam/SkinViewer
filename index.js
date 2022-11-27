const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

let win;

// Electron: Create window
const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        resizable: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.setTitle("Skin Viewer");
    win.loadFile(path.join(__dirname, 'frontend/index.html'));
    win.show();

    win.webContents.openDevTools({ mode: "detach" });
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    app.quit();
});

Menu.setApplicationMenu();

// 最小化窗口
ipcMain.on("minimize-request", (_event, _requestMessage) => {
    win.minimize();
});