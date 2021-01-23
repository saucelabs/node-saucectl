jest.mock('child_process')
const main = require('../')
const childProcess = require('child_process');
const { EventEmitter } = require('events');

test('should run the executeable', async () => {
    childProcess.spawn.mockImplementation(() => {
        const mockSpawnEventEmitter = new EventEmitter();
        mockSpawnEventEmitter.on("exit", () => {})
        return mockSpawnEventEmitter;
    });
	const bin = {
		run: jest.fn().mockReturnValue(Promise.resolve(true)),
		path: jest.fn().mockReturnValue('/bin/saucectl')
	}
	await main(bin, ['bar', '--foo'])
	expect(bin.run).toBeCalledTimes(1)
	expect(childProcess.spawn).toBeCalledWith('/bin/saucectl', ['bar', '--foo'], expect.any(Object))
})
