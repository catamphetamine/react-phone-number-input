import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const resolveModules = resolve()

const COMMON_PLUGINS = [
  resolveModules,
  commonjs(),
  json(),
  terser()
];

const COMMON_OUTPUT = {
  format: 'umd',
  name: 'PhoneInput',
  sourcemap: true,
  exports: 'named',
  globals: {
    'react': 'React',
    'prop-types': 'PropTypes',
    'react-hook-form': 'ReactHookForm'
  }
};

const COMMON_EXTERNAL = ['react', 'prop-types']

export default [
  {
    input: 'min/index.js',
    plugins: COMMON_PLUGINS,
    external: COMMON_EXTERNAL,
    output: {
      file: 'bundle/react-phone-number-input.js',
        ...COMMON_OUTPUT
    }
  },
  {
    input: 'mobile/index.js',
    plugins: COMMON_PLUGINS,
    external: COMMON_EXTERNAL,
    output: {
      file: 'bundle/react-phone-number-input-mobile.js',
      ...COMMON_OUTPUT
    }
  },
  {
    input: 'max/index.js',
    plugins: COMMON_PLUGINS,
    external: COMMON_EXTERNAL,
    output: {
      file: 'bundle/react-phone-number-input-max.js',
      ...COMMON_OUTPUT
    }
  },
  {
    input: 'input/index.js',
    plugins: COMMON_PLUGINS,
    external: COMMON_EXTERNAL,
    output: {
      file: 'bundle/react-phone-number-input-input.js',
      ...COMMON_OUTPUT
    }
  },
  {
    input: 'input-mobile/index.js',
    plugins: COMMON_PLUGINS,
    external: COMMON_EXTERNAL,
    output: {
      file: 'bundle/react-phone-number-input-input-mobile.js',
      ...COMMON_OUTPUT
    }
  },
  {
    input: 'input-max/index.js',
    plugins: COMMON_PLUGINS,
    external: COMMON_EXTERNAL,
    output: {
      file: 'bundle/react-phone-number-input-input-max.js',
      ...COMMON_OUTPUT
    }
  },
  {
    input: 'react-hook-form/index.js',
    plugins: COMMON_PLUGINS,
    external: COMMON_EXTERNAL,
    output: {
      file: 'bundle/react-phone-number-input-react-hook-form.js',
      ...COMMON_OUTPUT
    }
  },
  {
    input: 'react-hook-form-input/index.js',
    plugins: COMMON_PLUGINS,
    external: COMMON_EXTERNAL,
    output: {
      file: 'bundle/react-phone-number-input-react-hook-form-input.js',
      ...COMMON_OUTPUT
    }
  }
]
