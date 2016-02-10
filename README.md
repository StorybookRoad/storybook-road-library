# storybook-road-library
A browser app that teaches kids grades 1-5 spelling and grammar with an interactive storybook.

Currently, server functionality is implemented on the app_interface branch.

To configure and open the app locally:

1) Install node.js and mongodb.
2) Make sure that the /data/db directory exists in your root directory. If it isn't, create it (this is where Mongodb stores its data).
2) Navigate to the root directory for the project (the one that contains index.js).
3) Run the server with the command 'node index.js'.
4) In another terminal window, run the command 'mongod' to start the database.
5) Open a browser and navigate to 'localhost:8080'
