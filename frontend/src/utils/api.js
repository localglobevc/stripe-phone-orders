import queryString from 'query-string';

let innerToken = '';

const BASE = 'http://localhost:8080';

const api = (url, options = {}) => fetch(`${BASE}${url}`, options)
  .then((res) => {
    if (!res.ok) {
      return res.json()
        .then((data) => {
          throw new Error(data.error ? data.error : res.status);
        });
    }
    return res.json();
  });

const mergeHeaders = (headers = {}) => {
  let newHeaders = headers;
  if (innerToken) {
    newHeaders = Object.assign({}, headers, { Authorization: innerToken }); // eslint-disable-line
  }
  return newHeaders;
};

const GET = (url, query = {}) => api(`${url}?${queryString.stringify(query)}`, {headers: mergeHeaders()});

const POST = (url, data = {}) => api(`${url}`, {
  method: 'POST',
  headers: mergeHeaders({'Content-Type': 'application/json'}),
  body: JSON.stringify(data),
});

const DELETE = (url, query = {}) => api(`${url}?${queryString.stringify(query)}`, {headers: mergeHeaders(), method: 'DELETE'});

const setAuthorization = (token) => {
  innerToken = token;
};

export {
  GET,
  POST,
  DELETE,
  setAuthorization,
};
