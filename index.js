const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

//middleware
app.use(cors());
app.use(express.json());

//DB access
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.74f46.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//api function
async function run() {
    try {
        await client.connect();
        const database = client.db("inventory");
        const usersCollection = database.collection("items");
       
        //Inserting item to items collection
        app.post('/addItem', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });

    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);

//default route
app.get('/', (req, res) => {
    res.send('Running Inventory server');
});
app.listen(port, () => {
    console.log('running on Inventory server', port);
});