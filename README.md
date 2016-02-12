Storybook-road-library
===============

A browser app that teaches kids grades 1-5 spelling and grammar with an interactive storybook.

Currently, server functionality is implemented on the app_interface branch.

Installation
============


To configure and open the app locally:
----------------------------------

1.  Install MongoDB:    
[Windows install](https://docs.mongodb.org/v3.0/tutorial/install-mongodb-on-windows/)
[OSX install](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)    
[Linux install)(https://docs.mongodb.org/manual/administration/install-on-linux/)


2.  Install node.js:

        ![Node.js Installation](https://docs.npmjs.com/getting-started/installing-node)


3.  Make sure that the /data/db directory exists in your root directory. If it isn't, create it (this is where Mongodb stores its data)    

4.  Navigate to the root directory for the project (the one that contains index.js)    

5.  Run the command 'npm install'. This will install all necessary node.js modules. 

6.  Run the server with the command 'node index.js'       


7.  In another terminal window, run the command 'mongod' to start the database    

8.  Open a browser and navigate to 'localhost:8080'    
