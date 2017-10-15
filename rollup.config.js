import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/app.js',
  output: {
    file: 'public/bundle.js',
    format: 'iife'
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [['es2015', {modules: false}]]
    })
  ]
}
