jest.mock('child_process')
const main = require('../');
const childProcess = require('child_process');
const { EventEmitter } = require('events');

describe('main', function () {
	let exitSpy, mockSpawnEventEmitter;
	beforeAll(function () {
		childProcess.spawn.mockImplementation(() => {
			mockSpawnEventEmitter = new EventEmitter();
			return mockSpawnEventEmitter;
		});
		exitSpy = jest.spyOn(process, 'exit');
		exitSpy.mockImplementation(() => {});
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
			const bw = await main.binWrapper();
			expect(Array.isArray(bw._src)).toEqual(true);
			expect(typeof bw._dest).toEqual('string');
		});
		test('should respect the SAUCECTL_INSTALL_BINARY wrapper', async function () {
			const bw = await main.binWrapper('http://some-fake-url');
			expect(bw._src).toMatchSnapshot();
			expect(typeof bw._dest).toEqual('string');
		});

		test('should respect the SAUCECTL_INSTALL_BINARY_MIRROR wrapper', async function () {
			const bw = await main.binWrapper(null, 'https://some-fake-mirror-url');
			expect(Array.isArray(bw._src)).toEqual(true);
			expect(bw._src[0].url).toMatch(/^https:\/\/some-fake-mirror-url\//);
			expect(typeof bw._dest).toEqual('string');
		});
	});
});
