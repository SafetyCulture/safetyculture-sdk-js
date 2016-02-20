import rp from 'request-promise';
import _ from 'lodash';

export const BASE_URL = 'https://api.safetyculture.io';

/**
* Generates an access token from a SafetyCulture username and password
* @param {string} username
* @param {string} password
* @returns {Promise} Resolves with access token
*                    Rejects with error if login failed
*/
export function generateToken(username, password, apiUrl = BASE_URL) {
  return rp({
    method: 'POST',
    uri: apiUrl + '/auth',
    form: {
      username,
      password,
      grant_type: 'password'
    },
    json: true
  })
  .then(body => body.access_token)
  .catch(() => { throw new Error('Invalid username or password'); });
}

/**
* Create a SafetyCulture Api client
* @param {object} opts The following options
* @param {string} token Valid token for authorization requests
* @returns {object} api Api client
*/
export default function Api({ token, apiUrl = BASE_URL }) {
  const defaultOptions = {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    useQuerystring: true,
    json: true
  };

  return {
    /**
    * Posts body to endpoint on SafetyCulture
    * @param {string} endpoint The endpoint to post to on SafetyCulture
    * @param {object} body The body to post
    * @returns {Promise} Resolves to body of response,
    *                    Rejects with an error from API.
    */
    post: (endpoint, options) => rp(_.assign({}, defaultOptions, {
      method: 'POST',
      uri: apiUrl + endpoint
    }, options)),

    /**
    * Gets from endpoint on SafetyCulture
    * @param {string} endpoint The endpoint to get from on SafetyCulture
    * @returns {Promise} Resolves to body of response,
    *                    Rejects with an error from API.
    */
    get: (endpoint, options) => rp(_.assign({}, defaultOptions, {
      uri: apiUrl + endpoint
    }, options))
  };
}
