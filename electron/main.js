import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // DEV MODE (Vite)
  if (!app.isPackaged) {
    win.loadURL("http://localhost:5173");
  } 
  // BUILD MODE (.exe installé)
  else {
    const indexPath = path.resolve(__dirname, "../dist/index.html");
    win.loadURL(`file://${indexPath}`);
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
