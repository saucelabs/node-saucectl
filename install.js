const { binWrapper } = require('./index.js');

function sanitizeURL(inputURL) {
  const parsedURL = new URL(inputURL);

  // Remove the username and password (authentication) if present
  parsedURL.username = '';
  parsedURL.password = '';

  // Convert the sanitized URL back to a string
  return parsedURL.toString();
}

// install.js is executed during the npm installation step.
// To re-use BinWrapper logic, and limit changes, we force BinWrapper to
// execute "saucectl --version".
// So we are 100% sure that the saucectl binary will be available for the next
// execution.
async function install() {
  if (process.env.SAUCE_VM) {
    if (!process.env.SAUCECTL_FORCE_INSTALL) {
      console.info('Skipping the installation of saucectl on Sauce Cloud.');
      return;
    }
  }
  console.info('Fetching saucectl binary');
  const bw = binWrapper(
    process.env.SAUCECTL_INSTALL_BINARY,
    process.env.SAUCECTL_INSTALL_BINARY_MIRROR,
  );
  if (!bw) {
    return;
  }
  bw.run(['--version'])
    .then(() => {
      console.info('Installation succeeded');
      process.exit(0);
    })
    .catch((e) => {
      console.error(`Installation failed: ${e}`);
      if (e.message.includes('AxiosError')) {
        const binarySource = process.env.SAUCECTL_INSTALL_BINARY;
        const binarySourceMirror = process.env.SAUCECTL_INSTALL_BINARY_MIRROR;
        if (binarySource) {
          console.error(
            `Please check that you have access to the URL provided by the SAUCECTL_INSTALL_BINARY environment variable: ${sanitizeURL(
              binarySource,
            )}\n\n`,
          );
        } else if (binarySourceMirror) {
          console.error(
            `Please check that you have access to the URL provided by the SAUCECTL_INSTALL_BINARY_MIRROR environment variable: ${sanitizeURL(
              binarySourceMirror,
            )}\n\n`,
          );
        } else {
          console.error(
            `Please check that you have access to https://github.com/saucelabs/saucectl/releases\n\n`,
          );
        }
      }
      process.exit(1);
    });
}

if (require.main === module) {
  install();
}

module.exports = install;
