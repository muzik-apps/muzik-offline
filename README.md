<img src="Presentation/app_logo.svg" width="5219"></img>
\
\
\
\
![application](Presentation/Application.png "Application")
<br></br>
# Muzik-offline
A cross platform, local music player that is an offline(no streaming) version of <a href="https://github.com/waveyboym/Muzik">Muzik</a>. This app allows you to listen to music that is stored on your local machine, that being music in mp3, wav etc format.

# I am a user/tester
1. Navigate to the <a href="https://github.com/waveyboym/Muzik-offline/releases">releases tab</a> and find the latest app release for your operating system.
2. Download it and install and enjoy the application

# I am a developer
1. Download <a href="https://tauri.app/v1/guides/getting-started/prerequisites">the pre-requisites</a> for tauri only by following the pre-requisites page for your operating system.
2. If you are on linux OS(debian/ubuntu), run
```
sudo apt-get install libasound2-dev
```
3. Clone this repo
4. run
```
cd Muzik-offline/muzik-offline
```
5. run
```
npm install
```
6. run
```
npm run tauri dev
```
Please note that when you run ```npm run tauri``` dev for the first time, it may take a lengthy amount of minutes to compile everything. However this only occurs just on your first run. In subsequent runs, it will be faster.

# Node modules used
1. <a href="https://www.npmjs.com/package/@tauri-apps/cli">tauri-apps/api</a>
2. <a href="https://dexie.org/">dexie</a>
3. <a href="https://www.framer.com/motion/">framer motion</a>
4. <a href="https://react.dev/">react and react-dom</a>
5. <a href="https://reactrouter.com/en/main">react-router-dom</a>
6. <a href="https://www.npmjs.com/package/react-viewport-list">react viewport list</a>
7. <a href="https://sass-lang.com/">sass</a>
8. <a href="https://docs.pmnd.rs/zustand/getting-started/introduction">zustand</a>

# Rust libraries used
1. <a href="https://tauri.app/">tauri</a>
2. <a href="https://serde.rs/">serde</a>
3. <a href="https://docs.rs/serde_json">serde_json</a>
4. <a href="https://docs.rs/id3">id3</a>
5. <a href="https://docs.rs/lofty/latest/lofty/">lofty</a>
6. <a href="https://crates.io/crates/tokio">tokio</a>
7. <a href="https://docs.rs/base64">base64</a>
8. <a href="https://docs.rs/image">image</a>
9. <a href="https://docs.rs/kira/latest/kira/">kira</a>
10. <a href="https://docs.rs/rand/latest/rand/">rand</a>
11. <a href="https://docs.rs/rayon/latest/rayon/">rayon</a>
12. <a href="https://docs.rs/sled/latest/sled/">sled</a>