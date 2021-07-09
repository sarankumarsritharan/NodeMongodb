const express = require('express')
const app = express();
const port = process.env.PORT || 9000;
const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient
    //const dburl = "mongodb://127.0.0.1:27017";
const dburl = "mongodb+srv://sarankumar:sarankumar@cluster0.wmylt.mongodb.net/test"



app.use(express.json()); // req.body.name (middleware)

app.get("/students", async(req, res) => {
    let client = await mongoClient.connect(dburl)
    try {
        //select the db
        let db = client.db("saran") // server name
            // select the collection and perform db operation
        const data = await db.collection("users").find().toArray(); // server--> collection (films)
        res.json({ message: "record fetched", data })
    } catch (error) {
        console.log(error);
        res.json({ message: "something went Wrong" })
    } finally {

        //close connection
        client.close();
    }

});


app.post("/post-students", async(req, res) => {
    let client = await mongoClient.connect(dburl)
    try {
        let db = client.db("saran")
        const data = await db.collection("users").insertOne(req.body);
        res.json({ message: "record created" })
    } catch (error) {
        console.log(error);
        res.json({ message: "something went Wrong" })
    } finally {
        client.close();
    }

});


app.put("/update-students/:id", async(req, res) => {
    let client = await mongoClient.connect(dburl);
    const objid = mongodb.ObjectID(req.params.id);
    try {

        let db = client.db("saran")

        const data = await db.collection("users").findOne({ _id: objid });
        if (data) {
            const updated = await db.collection("users").findOneAndUpdate({ _id: objid }, { $set: { name: req.body.name, phone: req.body.phone, email: req.body.email } });
            res.json({ message: "Record Updated" })
        } else res.json({ message: "No user with this ID" })
            // res.json({ message: "record fetched", data })
            // res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.json({ message: "something went Wrong" })
    } finally {


        client.close();
    }

});


app.delete("/delete-students/:id", async(req, res) => {
    let client = await mongoClient.connect(dburl);
    const objid = mongodb.ObjectID(req.params.id);
    try {
        //select the db
        let db = client.db("saran")

        const data = await db.collection("users").findOne({ _id: objid });
        if (data) {
            const updated = await db.collection("users").findOneAndDelete({ _id: objid })
            res.json({ message: "Deleted" })
        } else res.json({ message: "No user wth this ID exists" })

    } catch (error) {
        console.log(error);
        res.json({ message: "something went Wrong" })
    } finally {


        client.close();
    }

});


app.listen(port, () => {
    console.log("server is listening....")
})