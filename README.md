Node.js saucectl Wrapper ![build](https://github.com/saucelabs/node-saucectl/workflows/saucectl%20pipeline/badge.svg)
========================

Node.js wrapper for [saucectl](https://github.com/saucelabs/saucectl).

## Install

To install `saucectl` via `npm`, simply run the following command:

```sh
$ npm i -g saucectl
```

The command should be globally available:

```sh
$ saucectl -v
saucectl version 0.4.0
(build 7468a24c788b4ca4d67d50372c839edf03e5df6a)
```

__Note:__ When you run the command for the first time, it will initially download the binary. This only happens once.

__Note:__ `saucectl` installation is disabled on Sauce Labs Cloud. If you wish to force the installation, set the `SAUCECTL_FORCE_INSTALL` environment variable to `true`.

### Install Binary from a Specified Source

If you want the installer to download `saucectl` from a specific source, set the following environment variable:

```
export SAUCECTL_INSTALL_BINARY=http://localhost:9000/saucectl_0.32.2_mac_64-bit.tar.gz
```

### Install Binary from a Mirror Site

Override the default download site by setting the `SAUCECTL_INSTALL_BINARY_MIRROR` environment variable to a custom URL. The default site is [Sauce Labs saucectl releases](https://github.com/saucelabs/saucectl/releases/download).

```bash
SAUCECTL_INSTALL_BINARY_MIRROR=https://your-mirror-download-site.com/foo/bar npm i -g saucectl
```

---

For more information about `saucectl`, visit its main repository: [saucelabs/saucectl](https://github.com/saucelabs/saucectl).
