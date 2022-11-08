const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middeileware
app.use(cors());
app.use(express.json())

const uri = "mongodb+srv://surveyhelper:oJnGnqUvuRXzZaQ3@cluster0.omw9qhg.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('surveyhelperdb').collection('services')
        const reviewcollection = client.db('surveyhelperdb').collection('Reviews')
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
                .sort({
                    _id: -1,
                })
            const service = await cursor.toArray()
            res.send(service)
        })
        app.get('/home', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
                .sort({
                    _id: -1,
                })
                .limit(3);
            const limitservice = await cursor.toArray()
            res.send(limitservice)
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await serviceCollection.findOne(query);
            res.send(user)
        })

        app.post("/AddServices", async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result)
        })

        app.post("/AddReview", async (req, res) => {
            const review = req.body;
            const result = await reviewcollection.insertOne(review);
            res.send(result)
        })
        app.get("/reviews", async (req, res) => {
            let query = {};
            if (req.query.id) {
                query = { ServiceId: req.query.id };
            }
            const cursor = reviewcollection.find(query).sort({
                Time: -1,
            });
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // app.get('/users/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) }
        //     const user = await userCollection.findOne(query);
        //     res.send(user)

        // })



        // app.put('/users/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: ObjectId(id) }
        //     const updateuser = req.body;
        //     const option = { upsert: true }
        //     const userupdate = {
        //         $set: {
        //             name: updateuser.name,
        //             email: updateuser.email
        //         }
        //     }
        //     const result = await userCollection.updateOne(filter, userupdate, option)
        //     res.send(result)
        //     console.log(updateuser);
        // })

        // app.delete('/users/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) }
        //     // console.log('Delete', id);
        //     const result = await userCollection.deleteOne(query)
        //     console.log(result);
        //     res.send(result)
        // })

    } finally {
    }
}
run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('Connected')
})

app.listen(port, () => {
    console.log(`Port ${port}`);
})