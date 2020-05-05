const { spawn } = require('child_process')

const main = require('../')

jest.mock('child_process')

test('should run the executeable', async () => {
	const bin = {
		run: jest.fn().mockReturnValue(Promise.resolve(true)),
		path: jest.fn().mockReturnValue('/bin/saucectl')
	}
	await main(bin, ['bar', '--foo'])
	expect(bin.run).toBeCalledTimes(1)
	expect(spawn).toBeCalledWith('/bin/saucectl', ['bar', '--foo'], expect.any(Object))
})
