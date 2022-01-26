import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from "react-router-dom";
import "bulma/css/bulma.css";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const token = localStorage.getItem('token');
const cache = new InMemoryCache();
const client = new ApolloClient({
  uri: 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/graphql',
  headers: {
        authorization: token ? `Bearer ${token}` : "",
        'Accept-Language': 'en-US',
      },
  cache,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <section class="section">
        <div class="container">
          <App />
        </div>
      </section>
    </Router>
  </ApolloProvider>,
  document.getElementById('root')
);

