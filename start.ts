global.Promise = require('bluebird'); // tslint:disable-line

import './config';
import NervServerApplication from './src/NervServerApplication';

const app = new NervServerApplication();

app.start();
