Twitch.tv Streams Search
=====================

This project takes advantage of Twitch API for streams query. 

# Project Description
- a simple web app that hits the Twitch API URL shown at the top 
- Use JSONP when utilizing the Twitch API's
- Build the URL based on the query entered by the user in the search box
- Build out the list
- No frameworks, implemented with native JavaScript

# Local Installation and Use
- Run a simple HTTP server: python -m SimpleHTTPServer 8888
- Open the browser and connect to <http://127.0.0.1:8888>

# Test Case
- Normal Search: limit=50&game=overwatch

- Smart Search: `limit`: 100, `game`: overwatch