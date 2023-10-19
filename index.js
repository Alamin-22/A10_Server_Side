const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.MDB_USER}:${process.env.MDB_PASS}@cluster0.4hda1bm.mongodb.net/?retryWrites=true&w=majority`;


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

    const carCollection = client.db("CarDB").collection("car")
    const Add_CartCollection = client.db("CarDB").collection("Added_Cart");

    app.get("/car", async (req, res) => {
      const cursor = carCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    // update
    app.get("/car/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carCollection.findOne(query);
      res.send(result);
    })

    app.post("/car", async (req, res) => {
      const newCar = req.body;
      console.log(newCar);
      const result = await carCollection.insertOne(newCar);
      res.send(result);
    })

    app.put(`/car/:id`, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const UpdatedCar = req.body;
      const Car = {
        $set: {
          name: UpdatedCar.name,
          quantity: UpdatedCar.quantity,
          brand: UpdatedCar.brand,
          type: UpdatedCar.type,
          price: UpdatedCar.price,
          rating: UpdatedCar.rating,
          details: UpdatedCar.details,
          photo: UpdatedCar.photo,
        }
      }

      const result = await carCollection.updateOne(filter, Car, options);
      res.send(result);

    })
    // added_Cart

    app.get("/added_cart", async (req, res) => {
      const cursor = Add_CartCollection.find();
      const Carts = await cursor.toArray();
      res.send(Carts);
    })

    app.post("/added_cart", async (req, res) => {
      const Added_Cart = req.body;
      console.log(Added_Cart);
      const result = await Add_CartCollection.insertOne(Added_Cart);
      res.send(result);
    })
    // cart Delete
    // app.delete(`/added_cart/:id`, async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await Add_CartCollection.deleteOne(query);
    //   console.log(result);
    //   res.send(result);
    // })
    // car delete
    app.delete(`/car/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carCollection.deleteOne(query);
      res.send(result);
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


app.get("/", (req, res) => {
  res.send("AutoMotive server is Running")
})

app.listen(port, () => {
  console.log(`AutoMotive server is running on port${port}`)
})


