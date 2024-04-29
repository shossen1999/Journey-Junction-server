const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());




// const uri = `mongodb://localhost:27017`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wzcn8fz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
//const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kqq9as2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
//var uri = "mongodb://soheb:soheb@ac-g0x8uov-shard-00-00.wzcn8fz.mongodb.net:27017,ac-g0x8uov-shard-00-01.wzcn8fz.mongodb.net:27017,ac-g0x8uov-shard-00-02.wzcn8fz.mongodb.net:27017/?ssl=true&replicaSet=atlas-t3o8m2-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
 
console.log(uri);


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
    // await client.connect();
    const tourCollection = client.db('tourDB').collection('tour');
    const countryCollection = client.db('tourDB').collection('country');
    // const userCollection = client.db('tourDB').collection('user');

    // R ->here concept use for finding multiple documents
    app.get('/tourSpot', async (req, res) => {
      
      const result = await tourCollection.find({}).toArray();
      res.send(result);
    })

    // R ->here concept use for finding multiple documents
   app.get('/country', async (req, res) => {
     
      const result = await countryCollection.find({}).toArray();
      res.send(result);
    }) 

    // R-> single country card
    app.get('/countrySpot/:country_name', async (req, res) => {
      const country_name = req.params.country_name;
      const query = { country_name : country_name }
      const result = await tourCollection.find(query).toArray();
      // console.log(result);
      res.send(result);
      
     
      
    })


    //  U ->here concept use for finding a documents
     app.get('/tourSpot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await tourCollection.findOne(query);
      res.send(result);
    })

    // U ->here concept use for finding a documents
    app.get('/tourSpot/user/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email : email }
      const result = await tourCollection.find(query).toArray();
      res.send(result);
    })

    // U
  //  U ->here concept use for finding a documents
     app.get('/singleSpot/:id', async (req, res) => {
     
      const result = await tourCollection.findOne( { _id: new ObjectId( req.params.id) });
      console.log(result);
      res.send(result);
    })


    // C
    app.post('/tourSpot', async (req, res) => {
        const newTourSpot = req.body;
        console.log(newTourSpot);
        const result = await tourCollection.insertOne(newTourSpot);
        res.send(result);
      })

      // Update
      app.put('/updateTourSpot/:id', async (req, res) => {
        
        const filter = { _id: new ObjectId(req.params.id) }
        const options = { upsert: true };
        const updatedTourSpot = req.body;
        const tourSpot = {
          $set: {
            tourists_spot_name: updatedTourSpot.tourists_spot_name,
            country_name: updatedTourSpot.country_name,
            location: updatedTourSpot.location,
            average_cost: updatedTourSpot.average_cost,
            seasonality: updatedTourSpot.seasonality,
            travel_time: updatedTourSpot.travel_time,
            photo: updatedTourSpot.photo,
            totalVisitorsPerYear: updatedTourSpot.totalVisitorsPerYear,
            email: updatedTourSpot.email,
            name: updatedTourSpot.name,
            short_description: updatedTourSpot.short_description
            
          }
        }
  
        const result = await tourCollection.updateOne(filter, tourSpot, options);
        console.log(result);
        res.send(result);
  
  
  
      })
    //  Delete
      app.delete('/delete/:id', async (req, res) => {
        
        const result = await tourCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.send(result)
  
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
  res.send('Journey Junction server is running')
})

app.listen(port, () => {
  console.log(`Journey Junction  is running on port ${port}`);
})