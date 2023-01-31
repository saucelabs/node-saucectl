jest.mock('child_process')
const main = require('../');
const childProcess = require('child_process');
const { EventEmitter } = require('events');
const packageJson = require('../package.json');

const { BinWrapper } = require('@saucelabs/bin-wrapper');
jest.mock('@saucelabs/bin-wrapper');

let mockSrc;

const originalOs = process.platform;
const originalArch = process.arch;

describe('main', function () {
	let exitSpy, mockSpawnEventEmitter;
	beforeAll(function () {
		childProcess.spawn.mockImplementation(() => {
			mockSpawnEventEmitter = new EventEmitter();
			return mockSpawnEventEmitter;
		});
		exitSpy = jest.spyOn(process, 'exit');
		exitSpy.mockImplementation(() => { });
	});

	beforeEach(() => {
		BinWrapper.mockClear();

		Object.defineProperty(process, 'platform', { value: 'darwin' });
		Object.defineProperty(process, 'arch', { value: 'arm64' });

		mockSrc = jest.fn();

		BinWrapper.mockReturnValue({
			use: jest.fn(),
			dest: jest.fn(),
			src: mockSrc,
			run: jest.fn(),
		});
	});
	afterEach(() => {
		jest.clearAllMocks();

		Object.defineProperty(process, 'platform', { value: originalOs });
		Object.defineProperty(process, 'arch', { value: originalArch });
	});

	test('should run the executable', async function () {
		const bin = {
			run: jest.fn().mockReturnValue(Promise.resolve(true)),
			path: jest.fn().mockReturnValue('/bin/saucectl')
		}
		await main(bin, ['bar', '--foo'])
		expect(bin.run).toBeCalledTimes(1)
		expect(childProcess.spawn).toBeCalledWith('/bin/saucectl', ['bar', '--foo'], expect.any(Object))
		mockSpawnEventEmitter.emit('exit', 0);
		expect(exitSpy.mock.calls).toEqual([[0]]);
	});
	describe('.binWrapper', function () {
		test('should create a binary wrapper', async function () {
			await main.binWrapper();

			expect(mockSrc.mock.calls).toEqual([
				[
					'https://github.com/saucelabs/saucectl/releases/download/v{{version}}/saucectl_{{version}}_mac_arm64.tar.gz'.replaceAll('{{version}}', packageJson.version),
					'darwin',
					'arm64',
				]
			]);
		});
		test('should respect the SAUCECTL_INSTALL_BINARY wrapper', async function () {
			await main.binWrapper('http://some-fake-url');

			expect(mockSrc).toMatchSnapshot();
		});

		test('should respect the SAUCECTL_INSTALL_BINARY_MIRROR wrapper', async function () {
			await main.binWrapper(null, 'https://some-fake-mirror-url');

			expect(mockSrc.mock.calls).toEqual([
				[
					'https://some-fake-mirror-url/v{{version}}/saucectl_{{version}}_mac_arm64.tar.gz'.replaceAll('{{version}}', packageJson.version),
					'darwin',
					'arm64',
				]
			]);
		});
	});
});
