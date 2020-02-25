import express from 'express';
const app = express();
import path from 'path';
import axios from 'axios';
import fs from 'fs';
import cors from 'cors';
import bodyParser from 'body-parser';

import mongodb from 'mongodb'
const MongoClient = new mongodb.MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });
const dirname = path.resolve();

app.use(bodyParser.json())
app.use(express.static(dirname))

app.route('/api/:path/:id').get(cors(), (req, res) => {
  let data = retrievePath(req);
  data.then(result => {
    // console.log(result);
    let ret = result.filter(elem => {
      return elem.id == req.params.id;
    });

    res.send(ret.pop());
  });
})

app.route('/api/:path').get(cors(), (req, res) => {
  let data = retrievePath(req);
  data.then(result => {
    res.send(result);
  });
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

app.route('/api/images/:path/:file').get(cors(), (req, res) => {
  if (fs.existsSync(dirname + '/assets/images/' + req.params['path'] + '/' + req.params['file'])) {
    console.log("Path exists")
    res.sendFile(dirname + '/assets/images/' + req.params['path'] + '/' + req.params['file']);
  } else {
    console.log("Micky Maus")

    res.sendFile(dirname + '/assets/images/' + "default.png");

  }
});

app.use(cors())
app.listen(8000, () => { console.log('Server started') });

function retrievePath(req) {
  var path = './cache/' + req.params["path"];
  if (fs.existsSync(path)) {
    return new Promise((resolve, reject) => {
      var file = fs.readFileSync(path);
      file = JSON.parse(file);
      if (file) resolve(file);
      else reject("no file");
    })
  }
  else {
    return new Promise((resolve, reject) => {
      axios.get('https://mhw-db.com/' + req.params["path"])
        .then(response => {
          //console.log(response.data);
          fs.writeFile(path, JSON.stringify(response.data), () => { });

          if (response.data) resolve(response.data);
          else reject("NO DATA");
        })
        .catch(error => {
          console.error(error);
        });
    });

  }
}
