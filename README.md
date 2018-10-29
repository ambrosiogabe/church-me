# Church-Me
This is a website developed to help locals find a church that suits their needs. There are instructions to download and run it locally, as well as how to implement your own production environment of it.

## Local Installation
To run this website locally you must first have Node.js installed on your local computer. To install Node.js go to [here](https://nodejs.org/en/) and follow the installation directions on Node's website. After you have it installed execute the following command on your computer's local terminal (CMD/bash/terminal) to ensure it installed correctly:

### Windows
```
node --version
```
### Mac/Linux
```
node -v
```

You should have the version number that you installed displayed to you, if you installed it correctly. Node should install NPM by default as well, run the command:

### Windows
```
npm --version
```
### Mac/Linux
```
npm -v
```

to ensure that npm is installed. If it is not follow the directions [here](https://treehouse.github.io/installation-guides/mac/node-mac.html) for Mac and [here](https://blog.teamtreehouse.com/install-node-js-npm-windows) for Windows and [here](https://blog.teamtreehouse.com/install-node-js-npm-linux) for Linux.

Once you have Node and Npm installed you are ready to run the test locally.

### Installing the website
Now, you should download this [Github repostiory](https://github.com/ambrosiogabe/church-me) into an empty folder on you local computer. For example, you could download it into C:\church-me. Once the repository is installed, open a terminal in the directory and then type the following command:

### Windows/Mac/Linux
```
npm run-script start
```

when you run the command wait a minute or so and then your terminal should output something similar to this:
```
PS C:\Users\ambro\Documents\School\ChurchMe\repo> npm run-script start

> churchme@0.0.0 start C:\Users\ambro\Documents\School\ChurchMe\repo
> npm run-script build & node server.js


> churchme@0.0.0 build C:\Users\ambro\Documents\School\ChurchMe\repo
> npm run build-css


> churchme@0.0.0 build-css C:\Users\ambro\Documents\School\ChurchMe\repo
> gulp css

[15:24:25] Using gulpfile ~\Documents\School\ChurchMe\repo\gulpfile.js
[15:24:25] Starting 'css:compile'...
[15:24:25] Finished 'css:compile' after 224 ms
[15:24:25] Starting 'css:minify'...
[15:24:25] Finished 'css:minify' after 3.37 ms
[15:24:25] Starting 'css'...
[15:24:25] Finished 'css' after 45 μs
Server running at http://undefined:3000/
```

This means that the site has built the Sass located in the scss/ directory, and then it started a local server that you will be able to find at 127.0.0.1:3000/. In order to test that the site is running locally open a browser like Google Chrome and type in http://127.0.0.1:3000 and it should pull up a local version of the site.

If all has gone well, then you can make changes to the code as needed and test it locally.

# Deployment
The current method of deployment is via Heroku. The basic method of deploying the app is quite simple. You login to the Heroku website [here](https://id.heroku.com/login) and then put in the admin name and password for ChurchMe. Then you go to the church-me app and click on it. Once inside you will be presented with an image like this:

!(this)[/deployImage.jpg]

Click into the deploy tab at the top of the page. The current deployment method is through Github as the flow diagram shows. It says it is connected to ambrosiogabe/church-me currently, and offers a disconnect. If you wish to disconnect it, press disconnect and then you can reconnect to a different repository. You then enable automatic deploys, and every time you push to Github, Heroku will serve whatever files are located in the repository.


