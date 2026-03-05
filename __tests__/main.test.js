jest.mock('child_process');
const main = require('../');
const childProcess = require('child_process');
const { EventEmitter } = require('events');
const packageJson = require('../package.json');
const path = require('path');
const fs = require('fs');

const { BinWrapper } = require('@saucelabs/bin-wrapper');
jest.mock('@saucelabs/bin-wrapper');
jest.mock('fs');

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
    exitSpy.mockImplementation(() => {});
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
      httpOptions: jest.fn(),
    });

    fs.existsSync.mockReturnValue(true);
    fs.statSync.mockReturnValue({ isFile: () => true });
    fs.mkdirSync.mockReturnValue(undefined);
    fs.copyFileSync.mockReturnValue(undefined);
    fs.chmodSync.mockReturnValue(undefined);
  });
  afterEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(process, 'platform', { value: originalOs });
    Object.defineProperty(process, 'arch', { value: originalArch });
  });

  test('should run the executable', async function () {
    const bin = {
      run: jest.fn().mockReturnValue(Promise.resolve(0)),
      path: jest.fn().mockReturnValue('/bin/saucectl'),
    };
    await main(bin, ['bar', '--foo']);
    expect(bin.run).toHaveBeenCalledTimes(1);
    expect(childProcess.spawn).toHaveBeenCalledWith(
      '/bin/saucectl',
      ['bar', '--foo'],
      expect.any(Object),
    );
    mockSpawnEventEmitter.emit('exit', 0);
    expect(exitSpy.mock.calls).toEqual([[0]]);
  });
  test('should display carry the exitCode', async function () {
    const bin = {
      run: jest.fn().mockReturnValue(Promise.resolve(1)),
      path: jest.fn().mockReturnValue('/bin/saucectl'),
    };
    await main(bin, ['bar', '--foo']);
    expect(bin.run).toHaveBeenCalledTimes(1);
    expect(childProcess.spawn).toHaveBeenCalledWith(
      '/bin/saucectl',
      ['bar', '--foo'],
      expect.any(Object),
    );
    expect(exitSpy.mock.calls).toEqual([[1]]);
  });
  describe('.binWrapper', function () {
    test('should create a binary wrapper', async function () {
      await main.binWrapper();

      expect(mockSrc.mock.calls).toEqual([
        [
          'https://github.com/saucelabs/saucectl/releases/download/v{{version}}/saucectl_{{version}}_mac_arm64.tar.gz'.replaceAll(
            '{{version}}',
            packageJson.version,
          ),
          'darwin',
          'arm64',
        ],
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
          'https://some-fake-mirror-url/v{{version}}/saucectl_{{version}}_mac_arm64.tar.gz'.replaceAll(
            '{{version}}',
            packageJson.version,
          ),
          'darwin',
          'arm64',
        ],
      ]);
    });

    test('should use the local binary when SAUCECTL_INSTALL_BINARY_LOCAL is set', async function () {
      const localPath = '/usr/local/bin/saucectl';
      const mockDest = jest.fn();
      const mockUse = jest.fn();
      BinWrapper.mockReturnValueOnce({
        use: mockUse,
        dest: mockDest,
        src: mockSrc,
        run: jest.fn(),
        httpOptions: jest.fn(),
      });

      const bw = await main.binWrapper(null, null, localPath);

      expect(bw).toBeDefined();
      expect(BinWrapper).toHaveBeenCalled();
      // should copy into the bin dir, not the original location
      expect(fs.mkdirSync).toHaveBeenCalledWith(expect.stringContaining('bin'), { recursive: true });
      expect(fs.copyFileSync).toHaveBeenCalledWith(
        path.resolve(localPath),
        expect.stringContaining('saucectl'),
      );
      expect(mockDest).toHaveBeenCalledWith(expect.stringContaining('bin'));
      expect(mockUse).toHaveBeenCalledWith('saucectl');
      // src should never be called — no download
      expect(mockSrc).not.toHaveBeenCalled();
    });

    test('should return undefined and log an error when SAUCECTL_INSTALL_BINARY_LOCAL path does not exist', async function () {
      fs.existsSync.mockReturnValue(false);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const bw = await main.binWrapper(null, null, '/nonexistent/saucectl');

      expect(bw).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('SAUCECTL_INSTALL_BINARY_LOCAL'));
      consoleSpy.mockRestore();
    });

    test('should return undefined and log an error when SAUCECTL_INSTALL_BINARY_LOCAL points to a directory', async function () {
      fs.existsSync.mockReturnValue(true);
      fs.statSync.mockReturnValue({ isFile: () => false });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const bw = await main.binWrapper(null, null, '/some/directory');

      expect(bw).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('SAUCECTL_INSTALL_BINARY_LOCAL'));
      consoleSpy.mockRestore();
    });

    test('should warn when SAUCECTL_INSTALL_BINARY_LOCAL is set alongside SAUCECTL_INSTALL_BINARY', async function () {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const bw = await main.binWrapper('http://some-url', null, '/usr/local/bin/saucectl');

      expect(bw).toBeDefined();
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('SAUCECTL_INSTALL_BINARY_LOCAL'));
      warnSpy.mockRestore();
    });

    test('should return undefined and log an error when SAUCECTL_INSTALL_BINARY is an invalid URL', async function () {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const bw = await main.binWrapper('not-a-valid-url');

      expect(bw).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('saucectl binary source is valid'));
      consoleSpy.mockRestore();
    });

    test('should return undefined and log an error when SAUCECTL_INSTALL_BINARY_MIRROR is an invalid URL', async function () {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const bw = await main.binWrapper(null, 'not-a-valid-mirror');

      expect(bw).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('saucectl binary source mirror is valid'));
      consoleSpy.mockRestore();
    });

    test('should reject when no binary matches the current platform/arch', async function () {
      Object.defineProperty(process, 'platform', { value: 'freebsd' });
      Object.defineProperty(process, 'arch', { value: 'mips' });

      await expect(main.binWrapper()).rejects.toThrow('No binary found matching your system');
    });

    test('should handle preRun failure and exit with non-zero code', async function () {
      const bin = {
        run: jest.fn().mockResolvedValue(1),
        path: jest.fn().mockReturnValue('/bin/saucectl'),
      };
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      await main(bin, []);

      expect(exitSpy).toHaveBeenCalledWith(1);
      consoleSpy.mockRestore();
    });
  });
});
