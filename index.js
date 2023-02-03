#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const { BinWrapper } = require('@saucelabs/bin-wrapper');

const version = '0.122.0'
const defaultBinInstallBase = 'https://github.com/saucelabs/saucectl/releases/download';
const binWrapper = (binInstallURL = null, binInstallBase = null) => {
    const bw = new BinWrapper();

    if (process.env.GITHUB_TOKEN) {
        bw.httpOptions({
            headers: {
                authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            }
        });
    }

    const base = binInstallBase || defaultBinInstallBase;

    let sources = [
        { url: `${base}/v${version}/saucectl_${version}_mac_64-bit.tar.gz`, os: 'darwin', arch: 'x64' },
        { url: `${base}/v${version}/saucectl_${version}_mac_arm64.tar.gz`, os: 'darwin', arch: 'arm64' },
        { url: `${base}/v${version}/saucectl_${version}_linux_32-bit.tar.gz`, os: 'linux', arch: 'x86' },
        { url: `${base}/v${version}/saucectl_${version}_linux_64-bit.tar.gz`, os: 'linux', arch: 'x64' },
        { url: `${base}/v${version}/saucectl_${version}_linux_arm64.tar.gz`, os: 'linux', arch: 'arm64' },
        { url: `${base}/v${version}/saucectl_${version}_win_32-bit.zip`, os: 'win32', arch: 'x86' },
        { url: `${base}/v${version}/saucectl_${version}_win_64-bit.zip`, os: 'win32', arch: 'x64' },
    ];

    sources = sources.filter(x => process.platform === x.os && process.arch === x.arch);

    if (binInstallURL) {
        bw.src(binInstallURL, process.platform, process.arch);
    } else {
        if (sources.length === 0) {
            return Promise.reject(new Error(`No binary found matching your system. It's probably not supported.`));
        }

        bw.src(sources[0].url, process.platform, process.arch);
    }

    bw.dest(path.join(__dirname, 'bin'));
    bw.use(process.platform.startsWith('win') ? 'saucectl.exe' : 'saucectl');

    return bw;
}

/* istanbul ignore next */
async function main (b, args) {
	await b.run(['--version']);
	const saucectlProcess = spawn(b.path(), args, {
		stdio: [process.stdin, process.stdout, process.stderr]
	});
    saucectlProcess.on('exit', function (code) {
        /* eslint-disable */
        process.exit(code);
        /* eslint-enable */
    });
}

/* istanbul ignore if */
if (require.main === module) {
    const bw = binWrapper(process.env.SAUCECTL_INSTALL_BINARY, process.env.SAUCECTL_INSTALL_BINARY_MIRROR);
	main(bw, process.argv.slice(2));
}

module.exports = main;
module.exports.binWrapper = binWrapper;
