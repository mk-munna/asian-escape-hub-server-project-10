const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yfvcqxe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const touristSpotCollection = client.db("TouristSpotDB").collection("TouristSpotCollection");
        const CountryCollection = client.db("CountryDB").collection("CountryCollection");

        app.post('/tourist-spot', async (req, res) => {
            const newTouristSpot = req.body;
            const result = await touristSpotCollection.insertOne(newTouristSpot);
            res.send(result);
            console.log(newTouristSpot)
        })

        app.get('/tourist-spots', async (req, res) => { 
            const touristSpots = await touristSpotCollection.find({}).toArray();
            res.send(touristSpots);
        })

        app.get('/country', async (req, res) => {
            const countries = await CountryCollection.find({}).toArray();
            res.send(countries);
        })

        app.put('/update/:id', async (req, res) => { 
            const touristSpotId = req.params.id;
            const updatedTouristSpot = req.body;
            const result = await touristSpotCollection.updateOne({ _id: new ObjectId(touristSpotId) }, { $set: updatedTouristSpot });
            res.send(result);
            console.log(touristSpotId);
        })


        app.delete('/touristSpot/:id', async (req, res) => { 
            const touristSpotId = req.params.id;
            const result = await touristSpotCollection.deleteOne({ _id: new ObjectId(touristSpotId) });
            res.send(result);
            console.log(touristSpotId);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})