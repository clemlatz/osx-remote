osx-remote
==========

A node web server to remote control a Mac running OSX

Installation
------------

1. Install node http://nodejs.org/download/
2. Clone osx-remote from github : `git clone https://github.com/iwazaru/osx-remote.git`
3. Change directory `cd osx-remote`
4. Install dependencies `npm install`
5. Create config file from example `cp config.json.example config.json`
6. Edit config file and set password `nano config.json`
7. Start server `node server.js`

You can now control your mac @ [http://localhost:8080/](http://localhost:8080/) !
