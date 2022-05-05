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
        const itemsCollection = database.collection("items");
        //find all items
        app.get('/items', async (req, res) => {

            const items = await itemsCollection.find({}).toArray();
            res.json(items);
        });
        //find current user's items
        app.get('/useritems', async (req, res) => {
            const email = req.query;
            const items = await itemsCollection.find(email).toArray();
            res.json(items);
        });
        // get single item api
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemsCollection.findOne(query);
            res.json(item);
        })
        //Inserting item to items collection
        app.post('/addItem', async (req, res) => {
            const user = req.body;
            const result = await itemsCollection.insertOne(user);
            res.json(result);
        });
        //update quantity for single item
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const quantity = req.body;
            console.log(quantity);
            // const filter = { _id: ObjectId(id) };
            // const options = { upsert: true };
            // const updateDoc = {
            //     $set: quantity
            // };
            // const result = await itemsCollection.updateOne(filter, updateDoc, options);
            // console.log('updating user', quantity, result);
            // res.json(result);
        })

        //delete api
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await itemsCollection.deleteOne(query);
            console.log('deleting service', result);
            res.json(result);
        })

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