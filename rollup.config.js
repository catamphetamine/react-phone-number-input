import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const resolveModules = resolve({
//   only: ['lodash']
})

export default [
  {
    input: 'min/index.js',
    plugins: [
      resolveModules,
      commonjs(),
      json(),
      terser()
    ],
    external: [
      'react',
      'prop-types'
    ],
    output: {
      format: 'umd',
      name: 'PhoneInput',
      file: 'bundle/react-phone-number-input.js',
      sourcemap: true,
      exports: 'named',
      globals: {
        'react': 'React',
        'prop-types': 'PropTypes'
      }
    }
  },
  {
    input: 'mobile/index.js',
    plugins: [
      resolveModules,
      commonjs(),
      json(),
      terser()
    ],
    external: [
      'react',
      'prop-types'
    ],
    output: {
      format: 'umd',
      name: 'PhoneInput',
      file: 'bundle/react-phone-number-input-mobile.js',
      sourcemap: true,
      exports: 'named',
      globals: {
        'react': 'React',
        'prop-types': 'PropTypes'
      }
    }
  },
  {
    input: 'max/index.js',
    plugins: [
      resolveModules,
      commonjs(),
      json(),
      terser()
    ],
    external: [
      'react',
      'prop-types'
    ],
    output: {
      format: 'umd',
      name: 'PhoneInput',
      file: 'bundle/react-phone-number-input-max.js',
      sourcemap: true,
      exports: 'named',
      globals: {
        'react': 'React',
        'prop-types': 'PropTypes'
      }
    }
  },
  {
    input: 'input/index.js',
    plugins: [
      resolveModules,
      commonjs(),
      json(),
      terser()
    ],
    external: [
      'react',
      'prop-types'
    ],
    output: {
      format: 'umd',
      name: 'PhoneInput',
      file: 'bundle/react-phone-number-input-input.js',
      sourcemap: true,
      exports: 'named',
      globals: {
        'react': 'React',
        'prop-types': 'PropTypes'
      }
    }
  },
  {
    input: 'input-mobile/index.js',
    plugins: [
      resolveModules,
      commonjs(),
      json(),
      terser()
    ],
    external: [
      'react',
      'prop-types'
    ],
    output: {
      format: 'umd',
      name: 'PhoneInput',
      file: 'bundle/react-phone-number-input-input-mobile.js',
      sourcemap: true,
      exports: 'named',
      globals: {
        'react': 'React',
        'prop-types': 'PropTypes'
      }
    }
  },
  {
    input: 'input-max/index.js',
    plugins: [
      resolveModules,
      commonjs(),
      json(),
      terser()
    ],
    external: [
      'react',
      'prop-types'
    ],
    output: {
      format: 'umd',
      name: 'PhoneInput',
      file: 'bundle/react-phone-number-input-input-max.js',
      sourcemap: true,
      exports: 'named',
      globals: {
        'react': 'React',
        'prop-types': 'PropTypes'
      }
    }
  }
]