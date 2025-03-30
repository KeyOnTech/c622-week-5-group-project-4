// const express = require('express');
// const bodyParser = require('body-parser');
// const cassandra = require('cassandra-driver');

// const app = express();
// const port = 8003; // change the port to your port i just made this up
// const keyspace_database = 'scylladb_test_keyspace_db'; // this is your database name but nosql it is a keyspace
//     // const keyspace_database = ''; // use this to make a connection to the server and no specific db

// const client = new cassandra.Client({
//     contactPoints: ['localhost:8011'], // change the port to your port in your docker file 
//    localDataCenter: 'DC1', // default not set in docker file
//    keyspace: keyspace_database
// });

// const routes = require('./routes/routes')(client, keyspace_database);

// app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use('/', routes);

// async function connectWithRetry() {
//     try 
//     {
//         await client.connect().then(() => {
//             console.log('Connected to ScyllaDB!');
//             startServer();
//         }).catch(err => {
//             console.log('Failed to connect to ScyllaDB server, retrying in 5 seconds...');
//             setTimeout(connectWithRetry, 5000);
//         });
//     } catch (err) {
//         console.error('Failed to connect to ScyllaDB press Ctrl + c to stop trying to connect:', err);
//         setTimeout(connectWithRetry, 5000); // Retry every 5 seconds
//     }
// }

// function startServer() {
//     app.listen(port, () => {
//         console.log(`Server is running on port ${port}`);
//     });
// }

// connectWithRetry();
