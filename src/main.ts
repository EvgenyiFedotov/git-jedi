import { app, BrowserWindow } from "electron";

let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    // titleBarStyle: "hidden",
  });

  win.webContents.openDevTools();
  win.loadFile("../app/index.html");
}

app.on("ready", createWindow);
