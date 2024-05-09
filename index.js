#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const { BinWrapper } = require('@saucelabs/bin-wrapper');
const { Writable } = require('stream');

const version = '0.175.1';
const defaultBinInstallBase =
  'https://github.com/saucelabs/saucectl/releases/download';
const binWrapper = (binInstallURL = null, binInstallBase = null) => {
  const bw = new BinWrapper();

  if (binInstallURL) {
    try {
      new URL(binInstallURL);
    } catch (e) {
      console.error(
        `Please ensure the provided saucectl binary source is valid: ${e}`,
      );
      return;
    }
  }
  if (binInstallBase) {
    try {
      new URL(binInstallBase);
    } catch (e) {
      console.error(
        `Please ensure the provided saucectl binary source mirror is valid: ${e}`,
      );
      return;
    }
  }

  if (process.env.GITHUB_TOKEN) {
    bw.httpOptions({
      headers: {
        authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    });
  }

  const base = binInstallBase || defaultBinInstallBase;

  let sources = [
    {
      url: `${base}/v${version}/saucectl_${version}_mac_64-bit.tar.gz`,
      os: 'darwin',
      arch: 'x64',
    },
    {
      url: `${base}/v${version}/saucectl_${version}_mac_arm64.tar.gz`,
      os: 'darwin',
      arch: 'arm64',
    },
    {
      url: `${base}/v${version}/saucectl_${version}_linux_32-bit.tar.gz`,
      os: 'linux',
      arch: 'x86',
    },
    {
      url: `${base}/v${version}/saucectl_${version}_linux_64-bit.tar.gz`,
      os: 'linux',
      arch: 'x64',
    },
    {
      url: `${base}/v${version}/saucectl_${version}_linux_arm64.tar.gz`,
      os: 'linux',
      arch: 'arm64',
    },
    {
      url: `${base}/v${version}/saucectl_${version}_win_32-bit.zip`,
      os: 'win32',
      arch: 'x86',
    },
    {
      url: `${base}/v${version}/saucectl_${version}_win_64-bit.zip`,
      os: 'win32',
      arch: 'x64',
    },
  ];

  sources = sources.filter(
    (x) => process.platform === x.os && process.arch === x.arch,
  );

  if (binInstallURL) {
    bw.src(binInstallURL, process.platform, process.arch);
  } else {
    if (sources.length === 0) {
      return Promise.reject(
        new Error(
          `No binary found matching your system. It's probably not supported.`,
        ),
      );
    }

    bw.src(sources[0].url, process.platform, process.arch);
  }

  bw.dest(path.join(__dirname, 'bin'));
  bw.use(process.platform.startsWith('win') ? 'saucectl.exe' : 'saucectl');

  return bw;
};

async function preRun(b) {
  let buf = Buffer.from('');
  const st = new Writable();
  st._write = (d) => (buf = Buffer.concat([buf, d]));

  const exitCode = await b.run(['--version'], {
    stdout: st,
    stderr: st,
  });

  if (exitCode !== 0) {
    console.log('Post-installation checks failed. saucectl output was:');
    console.log(buf.toString());
    process.exit(exitCode);
  }
}

async function main(b, args) {
  await preRun(b);
  const saucectlProcess = spawn(b.path(), args, {
    stdio: [process.stdin, process.stdout, process.stderr],
  });
  saucectlProcess.on('exit', function (code) {
    process.exit(code);
  });
}

if (require.main === module) {
  const bw = binWrapper(
    process.env.SAUCECTL_INSTALL_BINARY,
    process.env.SAUCECTL_INSTALL_BINARY_MIRROR,
  );
  main(bw, process.argv.slice(2));
}

module.exports = main;
module.exports.binWrapper = binWrapper;
