# Egg Chair

Couchapp for sharing images, like Pinterest and Flickr but without the service agreements.

[![Egg Chair](http://upload.wikimedia.org/wikipedia/commons/e/e6/The_Egg_Chair.jpg)](http://en.wikipedia.org/wiki/Egg_\(chair\))

## Install

Before we begin, you'll need to install these:

* [node.js](http://nodejs.org/): download and install manually.
* [grunt](http://gruntjs.com/): `npm install -g grunt-cli`

Then get the repo and its dependencies:

	git clone git://github.com/garbados/egg_chair.git
    cd egg_chair
	npm install

Egg Chair copies images from a directory on your computer to its `attachments/imgs` folder. In order to do that, it'll need to know where to copy images from. In `config.json` set `img_dir` accordingly. It defaults to `~/Pictures`.

	grunt

Now your app is live!

## Configuration

`config.json` contains application settings. Specifically:

* `db`: The remote URL where your Couchapp will get pushed.
* `img_dir`: Where Egg Chair copies your images from.

## Permissions

If you're using Cloudant, head to the permissions dashboard for your app and check "Read" for the row "Everyone else". This lets you share your images with the world.

If you're using CouchDB, open up Futon, go to your app, click "Security", and make sure under "Members" that "Names" is `[]` but "Roles" is `["reader"]`. That makes it publicly readable.

## Enabling Pretty URLs with Cloudant

By default, your app will live at some url like `user.cloudant.com/egg_chair/_design/egg_chair/index.html`, but that's not very pretty. To get pretty urls, like [eggchair.maxthayer.org](http://eggchair.maxthayer.org), go to your Cloudant dashboard, and create a Virtual Host pointing from some URL you control, to the `_rewrite_` url of your app, like this:

![Rewrite screencap](https://garbados.cloudant.com/egg_chair/Screen%20Shot%202013-06-23%20at%2010.04.52%20PM.png/img)

Use your DNS provider (ex: [namecheap](http://www.namecheap.com/)) to configure your subdomain settings. Here's what mine looks like: (note: only the part about sub-domains matters):

![Sub-domain screencap](http://garbados.cloudant.com/egg_chair/Screen%20Shot%202013-06-23%20at%2010.06.55%20PM.png/img)

Egg Chair comes with a `rewrites.json` file that takes care of all the URL rewrites. If you want to change the URL structure, change that file.
