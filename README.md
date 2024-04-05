# Mateka Online
Isometric puzzle game running in the browser. It's not a game yet :-)

![Mateka-readme](https://firebasestorage.googleapis.com/v0/b/mateka-online.appspot.com/o/images%2Fmateka-readme.png?alt=media)

### Tools
- [tsc](https://www.typescriptlang.org/) - TypeScript
- [Babylon.js](https://www.babylonjs.com/) - Real time 3D engine using a JavaScript
- [launch](https://www.npmjs.com/package/script-launcher) - Script Launcher

### Basic setup
``` bash
# Download resources
curl --location --silent https://github.com/Heerschop/mateka/releases/download/textures-0.0.0/textures.tar.xz | tar -xvJ -C src/assets

nvm use
npm install

npm start serve:dev
```
