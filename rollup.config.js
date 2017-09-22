import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/app.js',
  output: {
    file: 'public/bundle.js',
    format: 'iife'
  },
  plugins: [
    resolve(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [['es2015', {modules: false}]]
    })
  ]
}
