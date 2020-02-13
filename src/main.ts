import { app, BrowserWindow, ipcMain } from "electron";
import express from "express";
import bodyParser from "body-parser";

let win: BrowserWindow;

function createWindow() {
  // Создаем окно браузера.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    titleBarStyle: "hidden",
  });

  win.webContents.openDevTools();

  // и загрузить index.html приложения.
  win.loadFile("../app/index.html");
}

app.on("ready", createWindow);

const server = express();

server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

server.post("/", (req, res) => {
  const args: string[] = req.body.args;

  ipcMain.once("rebase-response", (event, status) => {
    res.send(status);
  });
  win.webContents.send("rebase-query", args);
});

server.listen(30000, function() {
  console.log("Example app listening on port 30000!");
});
