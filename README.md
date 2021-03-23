Node.js saucectl Wrapper ![build](https://github.com/saucelabs/node-saucectl/workflows/saucectl%20pipeline/badge.svg)
========================

Node.js wrapper for saucectl: Sauce Labs Testrunner Toolkit.

## Install

To install `saucectl` using NPM just run:

```sh
$ npm i -g saucectl
```

In case you need to download `saucectl` from a known source or in case you use `npx saucectl` you can use environment variable:

```
export SAUCECTL_INSTALL_BINARY=http://localhost:9000/saucectl_0.32.2_mac_64-bit.tar.gz
```

The command should be globally available:

```sh
$ saucectl -v
saucectl version 0.4.0
(build 7468a24c788b4ca4d67d50372c839edf03e5df6a)
```

__Note:__ if you run the command for the first time it will initially download the binary for you. This only happens once.

---

For more information to `saucectl`, visit its main repository: [saucelabs/saucectl](https://github.com/saucelabs/saucectl).
