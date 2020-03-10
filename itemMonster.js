import mongodb from 'mongodb'
import fs, { exists } from 'fs';
const MongoClient = mongodb.MongoClient;
let dbUrl = "mongodb://localhost:27017/"

MongoClient.connect(dbUrl, (err, db) => {
    if (err) throw err;
    var itemMonster = getMonsterData();
    console.log(itemMonster);

    let dbo = db.db("mhwDatabase");

    dbo.collection("itemMonster").findOne({}, function (err, result) {
        if (err) throw err;

        if (result != null) {
            dbo.collection("itemMonster").drop(function (err, delOK) {
                if (err) throw err + "DELETED";
                if (delOK) console.log("Collection deleted");
                dbo.createCollection("itemMonster", function (err, res) {
                    if (err) throw err;
                    console.log("Collection created!");
                    dbo.collection("itemMonster").insertMany(itemMonster, function (err, res) {
                        if (err) throw err;
                        console.log("Documents inserted");
                        db.close();
                    })
                });
            });
        }
        else {
            dbo.createCollection("itemMonster", function (err, res) {
                if (err) throw err;
                console.log("Collection created!");
                dbo.collection("itemMonster").insertMany(itemMonster, function (err, res) {
                    if (err) throw err;
                    console.log("Documents inserted");
                    db.close();
                })
            });
        }
    });
})

function getMonsterData() {
    var file = fs.readFileSync("./cache/monsters");
    var itemMonster = [];

    file = JSON.parse(file);

    file.forEach(monster => {
        let monsterId = monster.id;
        let monsterName = monster.name;
        
        monster.rewards.forEach(item => {
            getRank(item.conditions).forEach(rank => {
                let temp = { itemId: item.id, monsterId: monsterId, monsterName: monsterName, rank: rank };
                itemMonster.push(temp);
            });
        })
    });

    return itemMonster;
}

function getRank(conditions) {
    var itemRank = [];

    conditions.forEach(data => {
        if (!itemRank.includes(data.rank)) {
            itemRank.push(data.rank);
        }
    });

    return itemRank;
}