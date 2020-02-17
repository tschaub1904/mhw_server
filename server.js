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

app.route('/api/:path/:id').get(cors(),(req, res) => {
  let result = retrievePath(req, res);
  result = result.filter(el => {
    return el.id == req.params.id;
  }).pop();
  res.send(result);
})

app.route('/api/:path').get(cors(corsOptions), (req, res) => {
  let result = retrievePath(req, res);
  res.send(result);
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

function retrievePath(req) {
  var path = './cache/' + req.params["path"];
  if (fs.existsSync(path)) {
    var file = fs.readFileSync(path);
    file = JSON.parse(file);
    return file;
  }
  else {
    axios.get('https://mhw-db.com/' + req.params["path"])
      .then(response => {
        //console.log(response.data);
        fs.writeFile(path, JSON.stringify(response.data), () => { });
        return response.data;
      })
      .catch(error => {
      });
  }
}
