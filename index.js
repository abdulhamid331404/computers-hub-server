const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mlgekjs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const computerCollection = client.db('computerCetagory').collection('allComputers');


        app.get('/allComputers', async (req, res) => {
            const query = {};
            const cursor = computerCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/computers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const computer = await computerCollection.findOne(query);
            res.send(computer);
        })

    }
    finally {

    }
}
run().catch(console.log);



app.get('/', async (req, res) => {
    res.send('computers hub server is running')
});


app.listen(port, () => console.log(`computers hub running on ${port}`))
