import jest from 'eslint-plugin-jest';

export default [
  {
    files: ['**/*.js'],
    ignores: ['/bin'],
    plugins: {
      jest: jest,
    },
  },
];
