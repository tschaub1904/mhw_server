import mongodb from 'mongodb'
import fs, { exists } from 'fs';
const MongoClient = mongodb.MongoClient;
import {database} from './config.js';

MongoClient.connect(database.path, (err, db) => {
    if (err) throw err;
    var itemMonster = getMonsterData();
    console.log(itemMonster);

    let dbo = db.db(database.name);

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
        
        monster.rewards.forEach(reward => {
            getRank(reward.conditions).forEach(rank => {
                let temp = { itemId: reward.item.id, monsterId: monsterId, monsterName: monsterName, rank: rank };
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