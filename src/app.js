import "./stylesheets/main.css";

// Everything below is just a demo. You can delete all of it.

import { ipcRenderer } from "electron";
import jetpack from "fs-jetpack";
import { greet } from "./hello_world/hello_world";
import env from "env";
import keygen from "./keygen.js";

document.addEventListener('DOMContentLoaded', () => {
  const generateKeyButton = document.getElementById('generateKeyButton');
  const fileLocationInput = document.getElementById('fileLocationInput');
  const publicKeyElement = document.getElementById('publicKeyElement');

  generateKeyButton.addEventListener('click', async () => {
    const fileLocation = fileLocationInput.value;
    try {
      const publicKey = await ipcRenderer.invoke('generateKey', fileLocation);
      publicKeyElement.textContent = publicKey;
    } catch (error) {
      console.error('Error generating key:', error);
    }
  });
});


ipcRenderer.on('generateKeyResult', (event, data) => {
  if (data.error) {
    console.error('Error generating key:', data.error);
    // Handle the error in your UI
  } else {
    const publicKey = data;
    // Use the publicKey in your UI
    // For example, update a text element with the generated key:
    document.getElementById('publicKeyElement').textContent = publicKey;
  }
});


// Trigger key generation when a button is clicked, for example
document.getElementById('generateKeyButton').addEventListener('click', () => {
  ipcRenderer.send('generateKey');
});


document.querySelector("#app").style.display = "block";
//document.querySelector("#greet").innerHTML = greet();
//document.querySelector("#env").innerHTML = env.name;
//document.querySelector("#electron-version").innerHTML =
//  process.versions.electron;

const osMap = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux"
};
//document.querySelector("#os").innerHTML = osMap[process.platform];

// We can communicate with main process through messages.
ipcRenderer.on("app-path", (event, appDirPath) => {
  // Holy crap! This is browser window with HTML and stuff, but I can read
  // files from disk like it's node.js! Welcome to Electron world :)
  const appDir = jetpack.cwd(appDirPath);
  const manifest = appDir.read("package.json", "json");
  //document.querySelector("#author").innerHTML = manifest.author;
  
});
ipcRenderer.send("need-app-path");


