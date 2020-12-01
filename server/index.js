const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */


/* ---- (Dashboard) ---- */
// The route localhost:8081/genres is registered to the function
// routes.getAllGenres, specified in routes.js.


app.get('/minifig-actor/:theme', routes.getMinifigActors);
app.get('/sets/:themeID', routes.getSets);
app.get('/product/parts/:set_num', routes.getAllParts);
app.get('/product/reviews/:set_num', routes.getProductReview);
app.get('/product/similarSet/:set_num', routes.getSimilarSet);
app.get('/minifig/:fig_num', routes.getMinifigById)
// app.get('/minifig/all', routes.getMinifigs)
app.get('/minifig/actor/:fig_num', routes.getActorByFigNum);
app.get('/minifig/set/:fig_num', routes.querySet)
app.get('/sets/relative/:set_num', routes.queryRelative)



app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});