# Egg Chair

[![Build Status](https://travis-ci.org/garbados/eggchair.svg)](https://travis-ci.org/garbados/eggchair)

Couchapp for sharing images from your [Quilt](http://github.com/garbados/quilt.js), like Pinterest and Flickr but without the service agreements.

[![Egg Chair](http://upload.wikimedia.org/wikipedia/commons/e/e6/The_Egg_Chair.jpg)](http://eggchair.maxthayer.org/api/Screen%20Shot%202013-06-19%20at%202.58.19%20PM.png/file)

## Install

Before we begin, you'll need to install these:

* [node.js](http://nodejs.org/): download and install manually.
* [couchdb](http://couchdb.apache.org/), or just use [Cloudant](https://cloudant.com/)
* [grunt](http://gruntjs.com/): `npm install -g grunt-cli`
* [quilter](http://github.com/garbados/quilt.js): `npm install -g quilter`

Then get the repo and its dependencies:

  	git clone git://github.com/garbados/eggchair.git
    cd eggchair
  	npm install

Next, we'll use quilter to map our image directory to wherever we want to host our app:

    quilt push --local $IMG_DIR --remote $REMOTE_DB
  	npm start

Now your app is live at `http://localhost:5984/eggchair/_design/eggchair/_rewrite`! If you're using [Cloudant](https://cloudant.com/), change the `REMOTE_DB` variable to something like `https://YOUR_USERNAME:YOUR_PASSWORD@YOUR_USERNAME.cloudant.com/eggchair`, and run `npm run-script config` to set it appropriately for eggchair too. (N.B. This inconvenience will be resolved shortly.)

## Permissions

If you're using Cloudant, head to the permissions dashboard for your app and check "Read" for the row "Everyone else". This lets you share your images with the world.

If you're using CouchDB, open up Futon, go to your app, click "Security", and make sure under "Members" that "Names" is `[]` but "Roles" is `["reader"]`. That makes it publicly readable.

## Enabling Pretty URLs with Cloudant

By default, your app will live at some url like `user.cloudant.com/eggchair/_design/eggchair/_rewrite`, but that's not very pretty. To get pretty urls, like [eggchair.maxthayer.org](http://eggchair.maxthayer.org), go to your Cloudant dashboard, and create a Virtual Host pointing from some URL you control, to the `_rewrite` url of your app, like this:

![Rewrite screencap](http://eggchair.maxthayer.org/api/Screen%20Shot%202013-06-23%20at%2010.04.52%20PM.png/img)

Use your DNS provider (ex: [namecheap](http://www.namecheap.com/)) to configure your subdomain settings. Here's what mine looks like: (note: only the part about sub-domains matters):

![Sub-domain screencap](http://eggchair.maxthayer.org/api/Screen%20Shot%202013-06-23%20at%2010.06.55%20PM.png/img)

Egg Chair comes with a `rewrites.json` file that takes care of all the URL rewrites. If you want to change the URL structure, change that file.
