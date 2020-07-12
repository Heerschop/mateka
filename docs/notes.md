### Texture Extract example
``` bash
FILE_NAME=lava
mkdir -p ./$FILE_NAME
wget -qO- "https://firebasestorage.googleapis.com/v0/b/mateka-online.appspot.com/o/textures%2F$FILE_NAME.tar.xz?alt=media" | tar -xvJ -C ./$FILE_NAME
```
