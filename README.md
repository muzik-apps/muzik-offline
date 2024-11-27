<img src="Presentation/app_logo.svg" width="5219"></img>
\
\
\
\
![application](Presentation/Application.png "Application")
<br></br>

# muzik-offline
A cross platform, local music player that is an offline(no streaming) version of <a href="https://github.com/waveyboym/Muzik">muzik</a>. This app allows you to listen to music that is stored on your local machine, that being music in mp3, wav, ogg and flac format.

# Table of Contents
- [muzik-offline](#muzik-offline)
- [Table of Contents](#table-of-contents)
- [I am a user/tester](#i-am-a-usertester)
- [Usage](#usage)
- [I am a developer](#i-am-a-developer)
  - [Development Cycle](#development-cycle)
  - [Building](#building)
- [Node modules used](#node-modules-used)
- [Rust libraries used](#rust-libraries-used)

# I am a user/tester
1. Navigate to the <a href="https://github.com/waveyboym/muzik-offline/releases">releases tab</a> and find the latest app release for your operating system.
2. Download it and install and enjoy the application
3. Please read the <a href="#usage">usage</a> section for some extra information.
4. Also note that you can report <a href="https://github.com/muzik-apps/muzik-offline/issues/new?assignees=waveyboym&labels=bug&projects=&template=bug_report.md&title=%5BBUG%5D">bugs/issues</a> or make <a href="https://github.com/muzik-apps/muzik-offline/issues/new?assignees=waveyboym&labels=enhancement&projects=&template=feature_request.md&title=%5BFEATURE+REQUEST%5D">feature requests</a>

# Usage
1. Some shortcuts include
    - <small><kbd>**`SPACE`**</kbd></small> - Pause/Play music 
    - <small><kbd>**`CTRL/CMD`**</kbd> + <kbd>**`SHIFT`**</kbd> + <kbd>**`F`**</kbd></small> - Open/Close settings
    - <small><kbd>**`CTRL/CMD`**</kbd> + <kbd>**`S`**</kbd></small> - Focus on search bar
    - <small><kbd>**`CTRL/CMD`**</kbd> + <kbd>**`I`**</kbd></small> - Show song info 
    - <small><kbd>**`UP`**</kbd></small> or <small><kbd>**`DOWN`**</kbd></small> - scroll song by song
    - <small><kbd>**`LEFT`**</kdb></small> or <small><kbd>**`RIGHT`**</kdb></small> - seek by fixed value
    - <small><kbd>**`CTRL/CMD`**</kbd> + <kbd>**`P`**</kbd></small> or <small><kbd>**`ENTER`**</kbd></small> - Play the selected song  
    - <small><kbd>**`CTRL/CMD`**</kbd> + <kbd>**`SHIFT`**</kbd> + <kbd>**`A`**</kbd></small> - Add to playlist 
    - <small><kbd>**`CTRL/CMD`**</kbd> + <kbd>**`SHIFT`**</kbd> + <kbd>**`L`**</kbd></small> - Play later 
    - <small><kbd>**`CTRL/CMD`**</kbd> + <kbd>**`SHIFT`**</kbd> + <kbd>**`N`**</kbd></small> - Play Next

# I am a developer
## Development Cycle
1. Download <a href="https://tauri.app/v1/guides/getting-started/prerequisites">the pre-requisites</a> for tauri only by following the pre-requisites page for your operating system.
2. If you are on linux OS(debian/ubuntu), run
```
sudo apt-get install libasound2-dev
```
3. Clone this repo, specifically the <a href="https://github.com/muzik-apps/muzik-offline">main-app-dev</a> branch
4. run
```
cd muzik-offline/muzik-offline
```
5. run
```
npm install
```
6. This project uses <a href="https://discord.com/developers/docs/rich-presence/how-to">discord rpc</a>, so you will need a client id, otherwise the code won't compile
7. To get a client id, setup a new application on <a href="https://discord.com/developers/applications">discord developer portal</a> and then place your client id in an ```.env``` file in the <a href="https://github.com/muzik-apps/muzik-offline/tree/main-app-dev/muzik-offline/src-tauri">src-tauri</a> directory
8. The env file should look like this:
```
DISCORD_CLIENT_ID=<Your client id goes here>
```
9. If you are on linux/macos or any unix based OS, please navigate to <a href="https://github.com/muzik-apps/muzik-offline/blob/main-app-dev/muzik-offline/src-tauri/tauri.conf.json">tauri.config.json</a> and under the ```windows``` object, change the ```decorations``` property to ```true```
10. run
```
npm run tauri dev
```
11. You can encrypt your env file with:
```
openssl enc -aes-256-cbc -salt -pbkdf2 -in src-tauri/.env -out src-tauri/.env.enc -pass pass:{pass-key}
```

## Building
1. Clone the <a href="https://github.com/muzik-apps/muzik-offline/tree/releases">releases</a> branch. It is the most stable and ready to go branch
2. Before you create a build, you will have to embed any env variables into the rust code otherwise the application will panic if you try to run it. The env variables are only meant to be used in the development cycle.
4. If you want to create a production build, run
```
npm run tauri build
```
5. If you want to create a <a href="https://tauri.app/v1/guides/debugging/application#using-the-inspector-in-production">debug production build</a>(one where you have access to devtools), run
```
npm run tauri build -- --debug
```

Please note that when you run ```npm run tauri dev```, ```npm run tauri build``` or ```npm run tauri build -- --debug``` for the first time, it may take a lengthy amount of minutes to compile everything. However this only occurs just on your first run. In subsequent runs, it will be faster.

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
1. <a href="https://crates.io/crates/tauri">tauri</a>
2. <a href="https://crates.io/crates/serde">serde</a>
3. <a href="https://crates.io/crates/serde_json">serde_json</a>
4. <a href="https://crates.io/crates/id3">id3</a>
5. <a href="https://crates.io/crates/lofty">lofty</a>
6. <a href="https://crates.io/crates/tokio">tokio</a>
7. <a href="https://crates.io/crates/base64">base64</a>
8. <a href="https://crates.io/crates/image">image</a>
9. <a href="https://crates.io/crates/kira">kira</a>
10. <a href="https://crates.io/crates/rand">rand</a>
11. <a href="https://crates.io/crates/rayon">rayon</a>
12. <a href="https://crates.io/crates/sled">sled</a>
13. <a href="https://crates.io/crates/dirs">dirs</a>
14. <a href="https://crates.io/crates/discord-rich-presence">discord-rich-presence</a>
15. <a href="https://crates.io/crates/dotenv">dotenv</a>
