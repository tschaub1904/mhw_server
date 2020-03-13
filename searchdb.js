import mongodb from 'mongodb'
import fs, { exists } from 'fs';
import {database} from './config.js';

const MongoClient = mongodb.MongoClient;

MongoClient.connect(database.path, (err, db) => {
    if (err) throw err;
    var searchArray = getCacheData();

    let dbo = db.db(database.name);

    dbo.collection("search").findOne({}, function (err, result) {
        if (err) throw err;

        if (result != null) {
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
        }
        else {
            dbo.createCollection("search", function (err, res) {
                if (err) throw err;
                console.log("Collection created!");
                dbo.collection("search").insertMany(searchArray, function (err, res) {
                    if (err) throw err;
                    console.log("Documents inserted");
                    db.close();
                })
            });
        }
    });
})

function getCacheData(){
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

    return searchArray;
}