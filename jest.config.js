module.exports = {
    testEnvironment: 'node',
    collectCoverage: true,
    coverageThreshold: {
		global: {
			branches: 66,
			functions: 100,
			lines: 70,
			statements: 70
		}
    }
};
