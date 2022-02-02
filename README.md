# YELP APP
  1. Search restaurants by `Term` and `Location`.
  2. Each has detailed information and reviews.
  3. To build this app, YELP GraphQL API (https://www.yelp.com/developers/graphql/guides/intro) is used.

## How to run ?
  1. git clone `Cors-anywhere` (https://github.com/Rob--W/cors-anywhere#demo-server)
     - need to add CORS headers to access YELP GraphQL API.
     - node server.js -> http://localhost:8080
  
  2. git clone this repo.
     - cd client
     - create .env file
     - add `REACT_APP_YELP_KEY=(yelp api token) to .env file.
     - npm install
     - npm start
     - http://localhost:3000

### What are used to build this app?
    - Apollo client
    - Bulma CSS
    - React

