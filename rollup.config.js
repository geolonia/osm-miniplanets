import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

const config = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    typescript({ tsconfig: './tsconfig.build.json', useTsconfigDeclarationDir: true }),
  ],
};
export default config;
