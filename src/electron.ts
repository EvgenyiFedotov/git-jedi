const { app, BrowserWindow } = require("electron");

function createWindow() {
  // Создаем окно браузера.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    titleBarStyle: "hidden"
  });

  win.webContents.openDevTools();

  // и загрузить index.html приложения.
  win.loadFile("../dist/index.html");
}

app.on("ready", createWindow);
