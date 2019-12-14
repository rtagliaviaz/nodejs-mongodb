const express = require('express');

// << db setup >>
const db = require("./db");
const dbName = "data";
const collectionName = "movies"

const app = express();

//settings
app.set('port', 3000)

// middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());



//server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});


// << db init >>
db.initialize(dbName, collectionName, function(dbCollection) { // successCallback
  // get all items
  dbCollection.find().toArray(function(err, result) {
      if (err) throw err;
        console.log(result);
  });

  //create
  app.post('/movies', (req, res) => {
    const movie = req.body;
    dbCollection.insertOne(movie, (err, result) => {
      if(err) throw err;
      //return updated list
      dbCollection.find().toArray((_err, _result) => {
        if(_err) throw err;
        res.json(_result);
      })
    })
  });

  //read one
  app.get('/movies/:id', (req, res) => {
    const id = req.params.id
    dbCollection.findOne({id}, (err, result) => {
      if(err) throw err;
      //return item
      res.json(result);
    })
  });

  //read all
  app.get('/movies', (req, res) => {
    dbCollection.find().toArray((err, result) => {
      if(err) throw err;
      res.json(result)
    })
  });

  //update
  app.put('/movies/:id', (req, res) => {
    const movie = req.body;
    const id = req.params.id;
    console.log("Editing item: ", id, " to be ", movie);
      dbCollection.updateOne({ id }, { $set: movie }, (err, result) => {
        if (err) throw err;
        // send back entire updated list, to make sure frontend data is up-to-date
        dbCollection.find().toArray(function(_error, _result) {
            if (_error) throw _error;
            res.json(_result);
      });
    });
  });
  //delete
  app.delete("/movies/:id", (req, res) => {
    const id = req.params.id;
    console.log("Delete item with id: ", id);

    dbCollection.deleteOne({ id }, function(err, result) {
        if (err) throw err;
        // send back entire updated list after successful request
        dbCollection.find().toArray(function(_err, _res) {
            if (_err) throw _err;
            res.json(_res);
        });
    });
});
  
  
}, function(err) { // failureCallback
  throw (err);
});

