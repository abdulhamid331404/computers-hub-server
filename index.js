const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mlgekjs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
try{
    const serviceCollection = client.db('computerCetagory').collection('allComputers');
console.log(serviceCollection);

 app.get('/allComputers', async (req, res) => {
        const query = {};
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        console.log(services);
        res.send(services);
      });

}
finally{

}
}
run().catch(console.log);



app.get('/', async(req, res) =>{
    res.send('computers hub server is running')
});


app.listen(port, () => console.log(`computers hub running on ${port}`))
