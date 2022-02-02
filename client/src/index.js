import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import "bulma/css/bulma.css";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const token = process.env.REACT_APP_YELP_KEY;
const cache = new InMemoryCache();
const client = new ApolloClient({
  uri: 'http://localhost:8080/https://api.yelp.com/v3/graphql',
  headers: {
        authorization: token ? `Bearer ${token}` : "",
        'Accept-Language': 'en-US',
      },
  cache,
});

ReactDOM.render(
  <ApolloProvider client={client}>
      <section class="section">
        <div class="container">
          <App />
        </div>
      </section>
  </ApolloProvider>,
  document.getElementById('root')
);

