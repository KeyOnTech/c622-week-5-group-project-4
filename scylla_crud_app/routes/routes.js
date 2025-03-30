const express = require('express');
const router = express.Router();
const cassandra = require('cassandra-driver');
const uuid = require('uuid');

module.exports = function(client, keyspace_database) {

    router.get('/', async (req, res) => {
        let query = "";

        await client.execute(`CREATE KEYSPACE IF NOT EXISTS ${keyspace_database} WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3}`);

        console.error('\r\n');
        console.error('\r\n');

        let output_describe_keyspaces = [];
        query = "DESCRIBE KEYSPACES";
        client.execute(query, [], { prepare: true })
            .then(results => {
                console.log('Keyspaces:', results.rows);
                console.error('\r\n');
                output_describe_keyspaces = results.rows;
            })
            .catch(err => {
                console.error('Error retrieving keyspaces:', err);
                console.error('\r\n');
                output_describe_keyspaces = err;
            });

        let output_system_schema_keyspaces;
        query = "SELECT * FROM system_schema.keyspaces";
        client.execute(query, [], { prepare: true })
            .then(results => {
                console.log('System_schema.Keyspaces:', results.rows);
                console.error('\r\n');
                output_system_schema_keyspaces = results.rows;
            })
            .catch(err => {
                console.error('Error retrieving keyspaces:', err);
                console.error('\r\n');
                output_system_schema_keyspaces = err;
            });


        client.keyspace = keyspace_database;
        
        await client.execute(`CREATE TABLE IF NOT EXISTS ${keyspace_database}.test_table_siter_user_data (id UUID PRIMARY KEY, name TEXT, price INT)`);
        query = 'SELECT id, name, price FROM test_table_siter_user_data';
        client.execute(query, [], (err, results) => {
            if (err) {
                return res.send(err);
            }
            
            const sortedItems = results.rows.sort((a, b) => {
                if (a.name > b.name) return 1;
                if (a.name < b.name) return -1;
                return 0;
            });

            res.render('index', { 
                items: sortedItems , 
                output_describe_keyspaces: output_describe_keyspaces,
                output_system_schema_keyspaces: output_system_schema_keyspaces 
            });
        });
    });
    
    router.post('/add', (req, res) => {
        let { id, name, price } = req.body;
        console.log('Confirm Data Received:', { id, name, price });

        // check id is a valid UUID
        if (!uuid.validate(id)) {
            id = uuid.v4();
        }

        // check price is valid integer
        price = parseInt(price, 10);
        if (isNaN(price)) {
            return res.status(400).send("Invalid price");
        }
        
        const query = 'INSERT INTO test_table_siter_user_data (id, name, price) VALUES (?, ?, ?)';
        client.execute(query, [id, name, price], { prepare: true }, (err) => {
            if (err) {
                return res.send(err);
            }
            res.redirect('/');
        });
    });

    router.post('/update', (req, res) => {
        let { id, name, price } = req.body;
        console.log('Confirm Data Received:', { id, name, price });

        // check price is valid integer
        price = parseInt(price, 10);
        if (isNaN(price)) {
            return res.status(400).send("Invalid price");
        }
        
        const query = 'UPDATE test_table_siter_user_data SET name=?, price=? WHERE id=?';
        client.execute(query, [name, price, id], { prepare: true }, (err) => {
            if (err) {
                return res.send(err);
            }
            res.redirect('/');
        });
    });

    router.post('/delete', (req, res) => {
        let { id } = req.body;
        console.log('Confirm Data Received:', { id });
        
        const query = 'DELETE FROM test_table_siter_user_data WHERE id=?';
        client.execute(query, [id], { prepare: true }, (err) => {
            if (err) {
                return res.send(err);
            }
            res.redirect('/');
        });
    });

    router.get('/keyspaces', async (req, res) => {
        let query = "";
        let output_describe_keyspaces = [];
        let output_system_schema_keyspaces;

        console.error('\r\n');
        console.error('\r\n');

        query = "DESCRIBE KEYSPACES";
        client.execute(query, [], { prepare: true })
            .then(results => {
                console.log('Keyspaces:', results.rows);
                console.error('\r\n');

                output_describe_keyspaces = results.rows;
                console.log('output_describe_keyspaces:', output_describe_keyspaces);                
            })
            .catch(err => {
                console.error('Error retrieving keyspaces:', err);
                console.error('\r\n');
                output_describe_keyspaces = err;
            });

        query = "SELECT * FROM system_schema.keyspaces";
        client.execute(query, [], { prepare: true })
            .then(results => {
                console.log('System_schema.Keyspaces:', results.rows);
                console.error('\r\n');
                output_system_schema_keyspaces = results.rows;

                output_system_schema_keyspaces = results.rows;
                console.log('output_system_schema_keyspaces:', output_system_schema_keyspaces);                
            })
            .catch(err => {
                console.error('Error retrieving keyspaces:', err);
                console.error('\r\n');
                output_system_schema_keyspaces = err;
            });

        res.json("Data sent to server console"); // Send keyspaces info as JSON

    });

    return router;
};
