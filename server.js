import express from 'express';
const app = express();
import https from 'https';
import axios from 'axios';
import fs from 'fs';
import cors from 'cors';
import bodyParser from 'body-parser';

import mongodb from 'mongodb'
const MongoClient = new mongodb.MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });

app.use(bodyParser.json())

app.route('/api/:path/:id').get((req, res) => {
  console.log(req.params);
  axios.get('https://mhw-db.com/' + req.params["path"] + "/" + req.params["id"])
    .then(response => {
      console.log(response.data);
      res.send(response.data)
    })
    .catch(error => {
      console.log(error);
    });
})

app.route('/api/:path').get(cors(corsOptions), (req, res) => {

  var path = './cache/' + req.params["path"]
  if (fs.existsSync(path)) {
    var file = fs.readFileSync(path);

    file = JSON.parse(file);
    res.send(file);
  }
  else {
    axios.get('https://mhw-db.com/' + req.params["path"])
      .then(response => {
        //console.log(response.data);
        fs.writeFile(path, JSON.stringify(response.data), () => { })
        res.send(response.data);
      })
      .catch(error => {
        //console.log(error);
      });
  }
})

app.route('/api/search').post(cors(), (req, res) => {
  MongoClient.connect((err, db) => {
    if (err) throw err;
    var dbo = db.db('mhwDatabase');
    
    var regex = new RegExp(`.*${req.body.name}.*`, "i");
    let query = {
      name: regex
    };
    if (req.body.category)
      query['category'] = req.body.category;
    
    dbo.collection('search').find(query).toArray().then(result => {
      res.send(result);
    });
  })
});

  var corsOptions = {
    origin: 'http://example.com',
    optionsSuccessStatus: 200
  }

  app.use(cors())

  app.listen(8000, () => { console.log('Server started') });