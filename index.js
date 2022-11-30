const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
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

        const buyingCollection = client.db('computerCetagory').collection('bookings');

        const usersCollection = client.db('computerCetagory').collection('users');
        

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
        });

        app.get('/bookings', async(req, res) =>{
            const email = req.query.email;
            const query = {email: email}
            const bookings = await buyingCollection.find(query).toArray();
            res.send(bookings);
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await buyingCollection.insertOne(booking);
            res.send(result);
        });

        app.get('/jwt', async(req, res) =>{
            const email = req.query.email;
            const query = {email: email}
            const user = await usersCollection.findOne(query);
            if(user){
                const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '2h'})
                return res.send({accessToken: token})
            }
            console.log(user);
            res.status(403).send({accessToken: ''});
        })

        app.get('/users', async(req, res)=>{
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        })

app.get('users/admin/:email', async(req, res)=>{
  const email = req.params.email;
    const query = { email}
    const user = await usersCollection.findOne(query);
    res.send({isAdmin: user?.role === 'admin'});
})

        app.post('/users', async(req, res) =>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
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