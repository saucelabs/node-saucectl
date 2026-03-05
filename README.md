Node.js saucectl Wrapper 
========================
[![Release](https://github.com/saucelabs/node-saucectl/actions/workflows/release.yml/badge.svg)](https://github.com/saucelabs/node-saucectl/actions/workflows/release.yml)

Node.js wrapper for [saucectl](https://github.com/saucelabs/saucectl).

## Install

To install `saucectl` via `npm`, simply run the following command:

```sh
$ npm i -g saucectl
```

The command should be globally available:

```sh
$ saucectl -v
saucectl version 0.197.2
(build a301436d5b178bcfda8db106c50bfb78ac5be679)
```

__Note:__ When you run the command for the first time, it will initially download the binary. This only happens once.

__Note:__ `saucectl` installation is disabled on Sauce Labs Cloud. If you wish to force the installation, set
the `SAUCECTL_FORCE_INSTALL` environment variable to `true`.

### Install Binary from a Specified Source

If you want the installer to download `saucectl` from a specific source, set the following environment variable:

**macOS/Linux:**
```bash
export SAUCECTL_INSTALL_BINARY=http://localhost:9000/saucectl_0.32.2_mac_64-bit.tar.gz
```

**Windows (PowerShell):**
```powershell
$env:SAUCECTL_INSTALL_BINARY = "http://localhost:9000/saucectl_0.32.2_win_64-bit.zip"
```

**Windows (Command Prompt):**
```cmd
set SAUCECTL_INSTALL_BINARY=http://localhost:9000/saucectl_0.32.2_win_64-bit.zip
```

### Install Binary from a Mirror Site

Override the default download site by setting the `SAUCECTL_INSTALL_BINARY_MIRROR` environment variable to a
custom URL. The default site is [Sauce Labs saucectl releases](https://github.com/saucelabs/saucectl/releases/download).

**macOS/Linux:**
```bash
SAUCECTL_INSTALL_BINARY_MIRROR=https://your-mirror-download-site.com/foo/bar npm i -g saucectl
```

**Windows (PowerShell):**
```powershell
$env:SAUCECTL_INSTALL_BINARY_MIRROR = "https://your-mirror-download-site.com/foo/bar"
npm i -g saucectl
```

**Windows (Command Prompt):**
```cmd
set SAUCECTL_INSTALL_BINARY_MIRROR=https://your-mirror-download-site.com/foo/bar
npm i -g saucectl
```

### Use a Local Binary

If you already have a `saucectl` binary on your machine, you can point the installer directly to it by setting
the `SAUCECTL_INSTALL_BINARY_LOCAL` environment variable to the absolute (or relative) path of the binary.
No download will occur. The binary will be copied into the package's `bin` directory.

**macOS/Linux:**
```bash
export SAUCECTL_INSTALL_BINARY_LOCAL=/usr/local/bin/saucectl
npm i -g saucectl
```

**Windows (PowerShell):**
```powershell
$env:SAUCECTL_INSTALL_BINARY_LOCAL = "C:\tools\saucectl.exe"
npm i -g saucectl
```

**Windows (Command Prompt):**
```cmd
set SAUCECTL_INSTALL_BINARY_LOCAL=C:\tools\saucectl.exe
npm i -g saucectl
```

> **Note:** `SAUCECTL_INSTALL_BINARY_LOCAL` takes precedence over `SAUCECTL_INSTALL_BINARY` and
> `SAUCECTL_INSTALL_BINARY_MIRROR` if multiple variables are set simultaneously.

---

For more information about `saucectl`, visit its main repository: [saucelabs/saucectl](https://github.com/saucelabs/saucectl).
