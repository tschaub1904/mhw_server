import express from 'express';
const app = express();
import https from 'https';
import axios from 'axios';


app.route('/api/:path/:id').get((req, res) => {
  console.log(req.params);
    axios.get('https://mhw-db.com/' + req.params["path"] + "/" + req.params["id"] )
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
})

// app.route('/api/:path').get((req, res) => {
//     axios.get('https://mhw-db.com/' + req.params["path"] )
//       .then(response => {
//         console.log(response.data);
//         res.end(respo.data);
//       })
//       .catch(error => {
//         console.log(error);
//       });
// })

app.listen(8000, () => { console.log('Server started')});