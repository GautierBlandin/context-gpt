import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.e2e' });

module.exports = async function () {
  // Configure axios for tests to use.
  axios.defaults.baseURL = process.env.API_URL || 'http://localhost:8000';
};
