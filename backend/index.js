require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { PORT } = process.env;

const { seed, getTest, getRecipeCard } = require('./controller')

const app = express();

app.use(express.json());
app.use(cors());

//setting up the DB
app.post('/seed', seed)

//this is for testing purposes
app.get('/test', getTest)


//get all the recipes for the logged in user
app.get('/recipe-cards', getRecipeCard)




app.listen(5432, () => console.log(`Database sync successful and server is running on 5432`));