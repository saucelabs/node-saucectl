jest.mock('child_process')
const main = require('../')
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
	test('should run the executeable', async () => {
		const bin = {
			run: jest.fn().mockReturnValue(Promise.resolve(true)),
			path: jest.fn().mockReturnValue('/bin/saucectl')
		}
		await main(bin, ['bar', '--foo'])
		expect(bin.run).toBeCalledTimes(1)
		expect(childProcess.spawn).toBeCalledWith('/bin/saucectl', ['bar', '--foo'], expect.any(Object))
		mockSpawnEventEmitter.emit('exit', 0);
		expect(exitSpy.mock.calls).toEqual([[0]]);
	})
});