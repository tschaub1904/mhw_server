import express from 'express';
const app = express();
import https from 'https';
import axios from 'axios';
import fs from 'fs';

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

app.route('/api/:path').get((req, res) => {

  var path = './cache/' + req.params["path"]
  if (fs.existsSync(path)) {
    var file = fs.readFileSync(path)
    console.log(file);
    
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

app.listen(8000, () => { console.log('Server started') });