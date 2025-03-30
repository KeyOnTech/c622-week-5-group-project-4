const express = require('express');
const bodyParser = require('body-parser');
const cassandra = require('cassandra-driver');

const app = express();
const port = 8073; // change the port to your port i just made this up

                    const vContactPoints = ['scylladb-node-h-1:9042'];  // this only works between the docker compose containters
// const vContactPoints = ['localhost:8072']; // use this when you run local outside of docker

// default not set in docker file
                    // const vLocalDataCenter = 'DC1'; 
const vLocalDataCenter = 'datacenter1'; 

const keyspace_database = 'scylladb_test_keyspace_db'; // this is your database name but nosql it is a keyspace

const client = new cassandra.Client({
    contactPoints: vContactPoints,
    localDataCenter: vLocalDataCenter
                    //    keyspace: keyspace_database
});

const routes = require('./routes/routes')(client, keyspace_database);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', routes);

async function connectWithRetry() {
    try 
    {
        await client.connect().then(() => {
            console.log('Connected to ScyllaDB!');
            startServer();
        }).catch(err => {
            console.log('ERR: 7702: Failed to connect to ScyllaDB server, retrying in 5 seconds... - ', err);
            setTimeout(connectWithRetry, 5000);
        });
    } catch (err) {
        console.error('ERR: 7701: Failed to connect to ScyllaDB press Ctrl + c to stop trying to connect:', err);
        setTimeout(connectWithRetry, 5000); // Retry every 5 seconds
    }
}

function startServer() {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

connectWithRetry();
