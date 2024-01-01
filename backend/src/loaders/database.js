const { Client } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';


const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}`;
const devConnectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

exports.getClient = async() => {
    const client = new Client({
        connectionString: devConnectionString,
        ssl: isProduction,
    });

    try {
        await client.connect();
        return client;
    } catch (err) {
        client.end(); // Close the client if there's an error during connection
        throw err;
    }
};

exports.closeClient = async(client) => {
    await client.end();
};