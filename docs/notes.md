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

### Resources
* [TypeScript Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)



### Sound Tools
* [Site soundation.com](https://soundation.com/)
* [Video soundation.com](https://www.youtube.com/user/SoundationStudio)
* [Soundtrap](https://www.soundtrap.com/musicmakers)

### Art Tools
* [Sketchup](https://www.sketchup.com/)


### Game Engines
* [Getting Started With Three.js](https://www.youtube.com/watch?v=8jP4xpga6yY)
* [three.js 3D library with a default WebGL renderer](https://threejs.org/)
* [BabylonJs Simple Web rendering engine](https://www.babylonjs.com/)
* [BabylonJs playground](https://playground.babylonjs.com/)
* [Video BabylonJs](https://www.youtube.com/watch?v=m-YWBmim2Fo)

### Art Theme
[track](https://demos.littleworkshop.fr/track)


### Game Theme Inspiration
* [Wally](https://www.google.com/imgres?imgrefurl=https%3A%2F%2Ftwitter.com%2Froboticstsf%2Fstatus%2F1004052975952777217&tbnid=y561aLx-B67EJM&vet=10CAcQxiAoCGoXChMI-JXgiaH-6QIVAAAAAB0AAAAAEBs..i&docid=ou_UPwabPw9ORM)
* Cube Movie
* [Kings Valley MSX 2 game](https://www.youtube.com/watch?v=UnUdAkDAsfg)
* [Gauntlet](https://www.youtube.com/watch?v=6eedjv-3XmI)


### Game Description Story
Start with a basic robot in a room with no threats, you can stay in the room for as long as you want. The room can contain zero or more components to change you robot setup. When leaving the room and entering another room the components left behind will stay there for ever and can be used at a later time.

#### Room by Room Puzzels
The game excists of one room at a time. When leaving a room the room state will freeze and be saved. You can go back to a room at a later time then it will continue running in the state you left it in.

#### Remote Controled Driving Robot
It is a command based game, so you will give the robot a command and it will execute it. The robot can also do autonomous actions depending on the components it is build out of.

#### Improve/Build Robot in Game
A Robot exists out of multiple components like: scanners, wheels, guns, radars, computers, receivers, etc... Components can break and or decrade in functional. Components can also be replaced by other components. When replace a component, the replaced component will remain in the room it is replaced in.
