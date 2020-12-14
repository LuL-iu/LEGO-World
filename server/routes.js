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
      FROM (SELECT set_num, theme_id FROM sets) S JOIN theme T ON S.theme_id = T.id
      WHERE T.name = '${req.params.theme}'
    ),
    minifigs_to_check AS (
        SELECT name AS minifig_name, fig_num, image_url
        FROM minifig WHERE fig_num IN (
            SELECT fig_num
            FROM inventory_minifig
            WHERE inventory_id IN (
                SELECT id AS inventory_id 
                FROM sets_of_interest NATURAL JOIN (SELECT set_num, id FROM inventory) I
                UNION
                SELECT inventory_id
                FROM sets_of_interest NATURAL JOIN (SELECT set_num, inventory_id FROM inventory_set) I
            )
        ) AND image_url IS NOT NULL
    )
    SELECT actor.name AS actor_name, minifig_name, image_url 
    FROM actor JOIN (minifigs_to_check NATURAL JOIN actor_minifig_mapping) ON actor.id = actor_minifig_mapping.actor_id
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
    SELECT *
    FROM sets
    WHERE theme_id = '${req.params.themeID}'
    OR theme_id IN
    (SELECT id 
    FROM theme 
    WHERE parent_id = '${req.params.themeID}')
    OR theme_id IN
    (SELECT id
    FROM theme
    WHERE parent_id in
    (SELECT id
    FROM theme
    WHERE parent_id = '${req.params.themeID}'))
    order by name;
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
    ORDER BY rating_overall;
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
    FROM selectPart),
    
    similarSet AS(
    SELECT DISTINCT I.set_num, ST.total
    FROM inventory I JOIN similarTotal ST ON ST.id = I.id)
    
    SELECT S1.name, S1.set_num, S1.year AS year, S1.image_url AS url, SS.total AS sameParts, SS.total/TS.total     AS similarity
    FROM sets S1, similarSet SS, totalSelect TS
    WHERE S1.set_num = SS.set_num
    AND S1.set_num <> '${req.params.set_num}'
    ORDER BY similarity DESC
    LIMIT 21;  
  `;

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}


function getMinifigs(req, res) {
  const query = `
  SELECT M.fig_num, M.name, M.image_url, M.num_parts
  FROM inventory_minifig Ifig JOIN inventory I ON I.id = Ifig.inventory_id
  JOIN minifig M ON Ifig.fig_num = M.fig_num
  WHERE I.set_num IN 
  (
    SELECT set_num
    FROM sets
    WHERE theme_id = '${req.params.themeID}'
    OR theme_id IN
    (SELECT id 
    FROM theme 
    WHERE parent_id = '${req.params.themeID}')
    OR theme_id IN
    (SELECT id
    FROM theme
    WHERE parent_id in
    (SELECT id
    FROM theme
    WHERE parent_id = '${req.params.themeID}'))
    order by name
  );`
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
    WHERE parent_id IS NULL
    ORDER BY name;  
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
    SELECT name, image_url, fig_num, num_parts
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

function querySet(req, res) {
  const query = `SELECT S.set_num, S.name, S.image_url
  FROM inventory_minifig Ifig JOIN inventory I ON I.id = Ifig.inventory_id
  JOIN minifig M ON Ifig.fig_num = M.fig_num
  JOIN sets S on I.set_num = S.set_num
  WHERE Ifig.fig_num = '${req.params.fig_num}';
  `;

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}


function queryRelative(req, res) {
  const query = `
  SELECT M.fig_num, M.name, M.image_url
  FROM inventory_minifig Ifig JOIN inventory I ON I.id = Ifig.inventory_id
JOIN minifig M ON Ifig.fig_num = M.fig_num
and I.set_num = '${req.params.set_num}';
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
  getSearchSet: getSearchSet,
  querySet: querySet,
  queryRelative: queryRelative

}
