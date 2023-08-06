const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const { connection } = require('./db');
require("dotenv").config();
const cors = require("cors")

const app = express();
app.use(express.json());
app.use(cors())

app.get("/user", (req,res) => {
    res.send({msg:"OK!"})
})

const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post('/', async (req, res) => {
    try {
        const keyword  = req.body.keyword;
        const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: `You are a Shayari Generator.` },
                { role: "user", content: `${keyword}` }],
                max_tokens: 100,
                temperature: 0.5,
            }
        );

        const shayari = response.data.choices[0].message.content;
        res.status(200).send({shayari});
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Something went wrong' });
    }
});

app.listen(process.env.PORT, async () => {
    try {
        await connection
        console.log("connected to db")
    } catch (error) {
        console.log(error.message)
    }
    console.log("connected to server")
});
