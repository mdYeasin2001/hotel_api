const express = require('express');
const cors = require('cors');
const app = express();
const ObjectId = require('mongodb').ObjectId;
const port = 5000;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mydb:ub@_$53i-SGv2nG@cluster0.54hym.mongodb.net/hotelBookings?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(express.json());
app.use(cors());





client.connect(err => {
  const hotelsCollection = client.db("hotelBookings").collection("hotels");

  app.post('/addHotels', (req, res) => {
    console.log(req.body);
    hotelsCollection.insertMany(req.body)
      .then(result => res.send(result.insertedCount))
  })

  // get single hotel data
  app.post('/hotel', (req, res) => {
    const id = req.body.id;
    hotelsCollection.find({ _id: ObjectId(id) })
      .toArray((err, hotels) => res.send(hotels))
  })

  // all hotels
  app.get('/hotels', (req, res) => {
    hotelsCollection.find({})
      .toArray((err, hotels) => res.send(hotels))
  })

  // location 
  app.get('/availableHotels/:location', (req, res) => {
    const location = req.params.location;
    hotelsCollection.find({ location: location })
      .toArray((err, hotels) => {
        if (hotels.length > 0) {
          res.send(hotels)
        } else {
          hotelsCollection.find({})
          .toArray((err, hotels) => res.send(hotels.slice(2, 4)))
        }
      })
  })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})