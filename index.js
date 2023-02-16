const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middle ware 
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.ixsnvhr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri)
async function dbConnect() {
    try {
        await client.connect()
    }
    catch (err) {
        console.error(err)
        res.send({
            success: false,
            message: err.message
        })
    }
}
const servicesCollection = client.db("geniusCar").collection("services")
const ordersCollection = client.db("geniusCar").collection("orders");
app.post("/orders", async (req, res) => {
    try {
        const order = req.body
        const result = await ordersCollection.insertOne(order)
        if (result.insertedId) {
            res.send({
                success: true,
                message: `Order placed successfully to  ${order.service_name}`
            })
        }
    }
    catch (err) {
        console.error(err)
        res.send({
            success: false,
            message: err.message
        })
    }
})
app.get("/orders", async (req, res) => {
    try {
        let query = {}
        if (req.query.email) {
            query = { email: req.query.email }
        }
        const cursor = ordersCollection.find(query)
        const orders = await cursor.toArray()
        res.send({
            success: true,
            message: "Successfully got orders data",
            data: orders
        })
    }
    catch (err) {
        console.error(err)
        res.send({
            success: false,
            message: err.message
        })
    }
})
app.patch("/orders/:id", async (req, res) => {
    try {
        const id = req.params.id
        const query = { _id: new ObjectId(id) }
        // const order = await ordersCollection.findOne(query)
        const { status } = req.body
        console.log(status);
        const udpatedStatus = {
            $set: {
                status: status
            }
        }
        const result = await ordersCollection.updateOne(query, udpatedStatus)
        if (result.modifiedCount) {
            res.send({
                success: true,
                message: `successfully Approved `
            })
        }
    }
    catch (err) {
        console.error(err)
        res.send({
            success: false,
            message: err.message
        });
    }
})
app.delete("/orders/:id", async (req, res) => {
    try {
        const id = req.params.id
        const query = { _id: new ObjectId(id) }
        const order = await ordersCollection.findOne(query)
        const result = await ordersCollection.deleteOne(query)
        if (result.deletedCount) {
            res.send({
                success: true,
                message: `Successfully deleted order ${order.service_name}`
            })
        }
    }
    catch (err) {
        console.error(err)
        res.send({
            success: false,
            message: err.message
        })
    }
})
app.get("/services", async (req, res) => {
    try {
        const query = {}
        const cursor = servicesCollection.find({})
        const services = await cursor.toArray()
        res.send({
            success: true,
            message: `services data found`,
            data: services
        })
    }
    catch (err) {
        console.error(err);
        res.send({
            success: false,
            message: err.message
        })
    }
})
app.get("/services/:id", async (req, res) => {
    try {
        const id = req.params.id
        const query = { _id: new ObjectId(id) }
        const service = await servicesCollection.findOne(query)
        res.send({
            success: true,
            message: "Successfully got service dat",
            data: service
        })
    }
    catch (err) {
        console.error(err)
        res.send({
            success: false,
            message: err.message
        })
    }
})
app.listen(port, () => { console.log("Server is running on port " + port) });