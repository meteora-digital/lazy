# Pacman Skeleton

- These are very basic instruction on how to set up your new package with npm.
- For more detailed instructions view [How to publish npm packages](https://zellwk.com/blog/publish-to-npm/)

Initialise the package with npm.

```sh
$ npm login
$ cd package/directory
$ npm init
$ npm publish
```

Create a [git repo](https://github.com/new) for your package

Install [np](https://www.npmjs.com/package/np) to help publish your packages

```sh
$ sudo npm install --global np
```

Once updates are made and pushed to the git repo, you can publish the package to npm using 

```sh
$ np
```