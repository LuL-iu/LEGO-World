var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


function getMinifigActors(req, res) {
  var query = `
    WITH sets_of_interest AS (
      SELECT S.set_num AS set_num
      FROM theme T JOIN sets S ON S.theme_id = T.id 
      WHERE T.name = '${req.params.theme}'
    ),
    inventories_to_check AS (
      SELECT DISTINCT id AS inventory_id 
      FROM sets_of_interest JOIN inventory ON inventory.set_num = sets_of_interest.set_num
      UNION
      SELECT DISTINCT inventory_id
      FROM  sets_of_interest JOIN inventory_set ON sets_of_interest.set_num = inventory_set.set_num 
    ),
    minifigs_to_check AS (
      SELECT *
      FROM minifig
      WHERE fig_num IN (
        SELECT IM.fig_num AS fig_num
        FROM inventories_to_check ITC JOIN inventory_minifig IM ON ITC.inventory_id = IM.inventory_id
      )
    )
    SELECT actor.name AS actor_name, minifig.name AS minifig_name, image_url
    FROM actor JOIN (inventories_to_check NATURAL JOIN inventory_minifig NATURAL JOIN minifig NATURAL JOIN actor_minifig_mapping) ON actor.id = actor_minifig_mapping.actor_id
    WHERE image_url IS NOT NULL
    ORDER BY RAND();
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// The exported functions, which can be accessed in index.js.
module.exports = {
  getMinifigActors: getMinifigActors
}