### Texture Extract example
``` bash
FILE_NAME=lava
mkdir -p ./$FILE_NAME
wget -qO- "https://firebasestorage.googleapis.com/v0/b/mateka-online.appspot.com/o/textures%2F$FILE_NAME.tar.xz?alt=media" | tar -xvJ -C ./$FILE_NAME
```

### [DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event)
``` javascript
window.addEventListener('DOMContentLoaded', () => {
  // Create the game using the 'renderCanvas'.
  let game = new Game('renderCanvas');

  // Create the scene.
  game.createScene();

  // Start render loop.
  game.doRender();
});
```

### Issues
* [New "Solution Style" tsconfig.json file breaks the unused files in most Editors](https://github.com/angular/angular-cli/issues/18040)
* [Issues with importing interfaces created with export interface in Angular and TypeScript 3.9.6](https://github.com/angular/angular-cli/issues/18170)
