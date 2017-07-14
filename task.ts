import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import * as nconf from 'nconf';
import './config';

const [ host, task ] = process.argv.slice(2);
const payload = { admin: true };
const token = jwt.sign(payload, nconf.get('AUTH_SECRET'), { algorithm: 'HS256', expiresIn: '60s' });

axios.post(`https://${host}/_internal/${task}`, {}, {
  headers: {
    Authorization: `Bearer ${token}`
  }
}).then(response => {
  console.log(response.data);
})
.catch(err => {
  console.error('Error:', err.message || err);
});
