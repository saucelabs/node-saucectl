#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const BinWrapper = require('bin-wrapper');

const version = '0.36.0'
const base = 'https://github.com/saucelabs/saucectl/releases/download';
const binWrapper = (binInstallURL = null) => {
    const bw = new BinWrapper();

    if (binInstallURL) {
        bw.src(binInstallURL, '', '')
    } else {
        bw.src(`${base}/v${version}/saucectl_${version}_mac_32-bit.tar.gz`, 'darwin', 'x86')
            .src(`${base}/v${version}/saucectl_${version}_mac_64-bit.tar.gz`, 'darwin', 'x64')
            .src(`${base}/v${version}/saucectl_${version}_linux_32-bit.tar.gz`, 'linux', 'x86')
            .src(`${base}/v${version}/saucectl_${version}_linux_64-bit.tar.gz`, 'linux', 'x64')
            .src(`${base}/v${version}/saucectl_${version}_win_32-bit.zip`, 'win32', 'x86')
            .src(`${base}/v${version}/saucectl_${version}_win_32-bit.zip`, 'win32', 'x64')
            .src(`${base}/v${version}/saucectl_${version}_win_64-bit.zip`, 'win64', 'x64')
            .version(`v${version}`);
    }

    bw.dest(path.join(__dirname, 'bin'))
        .use(process.platform.startsWith('win') ? 'saucectl.exe' : 'saucectl');

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
    const bw = binWrapper(process.env.SAUCECTL_INSTALL_BINARY);
	main(bw, process.argv.slice(2));
}

module.exports = main;
module.exports.binWrapper = binWrapper;
