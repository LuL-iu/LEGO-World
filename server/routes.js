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
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getSets(req, res) {
  var query = `
  SELECT name, set_num, year, image_url 
  FROM sets 
  WHERE theme_id = '${req.params.themeID}'
  ORDER BY name;
  `;

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getSelectSet(req, res) {
  var query = `
  SELECT *
  FROM sets 
  WHERE set_num = '${req.params.set_num}';
  `;
 
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getProductReview(req, res) {
  var query = `
    SELECT rating_overall as overall, review, title, author, date
    FROM  review
    WHERE set_num = '${req.params.set_num}'
    ORDER BY date;
  `;

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getAllParts(req, res) {
  var query = `
    SELECT IP.part_num, IP.quantity, P.name, P.image_url 
    FROM inventory_part IP JOIN part P ON IP.part_num = P.part_num
    WHERE IP.inventory_id IN
    (SELECT id
    FROM inventory 
    WHERE set_num IN
    (SELECT ISet.set_num
    FROM inventory I JOIN inventory_set ISet ON I.id = ISet.inventory_id
    WHERE I.set_num = '${req.params.set_num}')
    OR set_num = '${req.params.set_num}');
  `;

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getSimilarSet(req, res) {
  var query = `
  WITH selectInventory AS(
    SELECT id, set_num
    FROM inventory 
    WHERE set_num IN
    (SELECT ISet.set_num
    FROM inventory I JOIN inventory_set ISet ON I.id = ISet.inventory_id
    WHERE I.set_num = '${req.params.set_num}')
    OR set_num = '${req.params.set_num}'),
    
    selectPart AS(
    SELECT IP.part_num, IP.color_id, IP.is_spare, SUM(IP.quantity) as q
    FROM inventory_part IP, selectInventory SI 
    WHERE IP.inventory_id = SI.id
    GROUP BY IP.part_num, IP.color_id, IP.is_spare),
    
    similarPart AS(
    SELECT IP.inventory_id as id, IP.part_num, IF(IP.quantity > SP.q, SP.q, IP.quantity) AS quantity
    FROM inventory_part IP JOIN selectPart SP ON IP.part_num = SP.part_num
    WHERE IP.color_id = SP.color_id
    AND IP.is_spare = SP.is_spare),
    
    similarTotal AS(
    SELECT id, SUM(quantity) AS total
    FROM similarPart
    GROUP BY id),
    
    totalSelect AS(
    SELECT SUM(q) AS total
    FROM selectPart)
    
    SELECT DISTINCT S1.name, S1.set_num, S1.year AS year, S1.image_url AS url, ST.total AS sameParts, ST.total/TS.total AS similarity
    FROM sets S1, totalSelect TS, similarTotal ST, inventory I
    WHERE ST.id = I.id
    AND S1.set_num = I.set_num
    AND S1.set_num <> '${req.params.set_num}'
    AND ST.total/TS.total >= 0.2
    ORDER BY similarity DESC
    LIMIT 20;    
  `;

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}


function getMinifigs(req, res) {
  const query = `select name, fig_num, num_parts, image_url 
  from minifig where num_parts > 10`
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
  
}

function getMinifigById(req, res) {

  if (req.params.fig_num === 'all') {

    getMinifigs(req, res)
    return;
  }
  const query = `select name, fig_num, num_parts, image_url 
  from minifig  WHERE fig_num = '${req.params.fig_num}'
  `
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
  
}

function getActorByFigNum(req, res) {
  console.log(123123123)
  const query = `select a.name, m. fig_num, m.image_url
  from actor_minifig_mapping am
  join actor a on a.id = am.actor_id
  join minifig m on am.fig_num = m.fig_num 
  where m.fig_num ='${req.params.fig_num}'
  `;

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getTopLevelThemes(req, res) {
  var query = `
    SELECT id, name 
    FROM theme 
    WHERE parent_id IS NULL;  
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getSearchSet(req, res) {
  var query = `
    SELECT name, image_url, set_num, year
    FROM sets
    WHERE name like concat('%','${req.params.text}','%')
    ORDER BY name;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getSearchMinifig(req, res) {
  var query = `
    SELECT name, image_url, fig_num
    FROM minifig
    WHERE name like concat('%','${req.params.text}','%')
    ORDER BY name;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// The exported functions, which can be accessed in index.js.
module.exports = {
  getMinifigActors: getMinifigActors,
  getSets: getSets,
  getProductReview: getProductReview,
  getAllParts: getAllParts,
  getSimilarSet: getSimilarSet,
  getMinifigs: getMinifigs,
  getMinifigById: getMinifigById,
  getActorByFigNum: getActorByFigNum,
  getSelectSet : getSelectSet,
  getTopLevelThemes: getTopLevelThemes,
  getSearchMinifig: getSearchMinifig,
  getSearchSet: getSearchSet

}