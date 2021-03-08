const { bin } = require('./index.js');

async function install () {
  console.info('Fetching saucectl binary');
  bin.run(['--version'])
    .then(() => {
      console.info(`Installation succeed`);
      process.exit(0);
    })
    .catch((e) => {
      console.error(`Installation failed: ${e}`);
      console.error(`Check that you have access to https://github.com/saucelabs/saucectl/releases\n\n`);
      process.exit(1);
    });
}

if (require.main === module) {
	install();
}

module.exports = install;
