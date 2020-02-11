import mongodb from 'mongodb'
import fs from 'fs';
const MongoClient = mongodb.MongoClient;
let dbUrl = "mongodb://localhost:27017/"

MongoClient.connect(dbUrl, (err, db) => {
    if (err) throw err;
    var directory = fs.readdirSync("./cache/");
    console.log(directory);
    var searchArray = [];
    directory.forEach(element => {
        let file = fs.readFileSync("./cache/" + element);
        file = JSON.parse(file);

        file.forEach(item => {
            let temp = { id: item.id, name: item.name, category: element };
            searchArray.push(temp);
        });
    });
    let dbo = db.db("mhwDatabase");
    dbo.collection("search").drop(function (err, delOK) {
        if (err) throw err + "DELETED";
        if (delOK) console.log("Collection deleted");
        dbo.createCollection("search", function (err, res) {
            if (err) throw err;
            console.log("Collection created!");
            dbo.collection("search").insertMany(searchArray, function (err, res) {
                if (err) throw err;
                console.log("Documents inserted");
                db.close();
            })
        });
    });
})