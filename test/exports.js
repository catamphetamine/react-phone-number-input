// testing exported variables and functions

import React from 'react'

// ES6

import Phone, { formats } from '../index.es6'

(<Phone input="" format={ formats.RU } onChange={ () => {} }/>);
formats.RU.city

// UMD

var Phone_2 = require('../index.umd')

var formats_2 = Phone_2.formats;

(<Phone_2 input="" format={ formats_2.RU } onChange={ () => {} }/>);
formats_2.RU.city