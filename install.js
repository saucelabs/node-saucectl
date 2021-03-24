const { binWrapper } = require('./index.js');

// install.js is executed during the npm installation step.
// To re-use BinWrapper logic, and limit changes, we force BinWrapper to
// execute "saucectl --version".
// So we are 100% sure that the saucectl binary will be available for the next
// execution.
async function install () {
  console.info('Fetching saucectl binary');
  const bw = binWrapper(process.env.SAUCECTL_INSTALL_BINARY);
  bw.run(['--version'])
    .then(() => {
      console.info(`Installation succeed`);
      process.exit(0);
    })
    .catch((e) => {
      console.error(`Installation failed: ${e}`);
      console.error(`Check that you have access to https://github.com/saucelabs/saucectl/releases or format of the SAUCECTL_INSTALL_BINARY environment variable is correct\n\n`);
      process.exit(1);
    });
}

if (require.main === module) {
	install();
}

module.exports = install;
