var path = require('path');
var slug = require('slug');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var PouchDB = require('pouchdb');

// Express server
var app = express();
// Pouch DB
var db = PouchDB('db');
//Return client/public on /
app.use(express.static(path.join(__dirname, 'client', 'public')));

app.use(methodOverride());
app.use(bodyParser.json());
app.use(morgan('dev'));

var controllers = {
  base: {
    index: function (req, res) {
      res.send({welcome: 'My Bookmarks API v1.0.0'});
    }
  },
  bookmarks: {
    all: function (req, res) {
      console.log('here');
      var allBookmarks = function (doc) {
        console.log('allBm');
        if (doc.type === 'bookmark') {
          emit(doc._id, null);
        };
      };

      db.query(allBookmarks, {include_docs: true}, function (err, data) {
        console.log('dbQ');
        if (err) {
          console.log(err);
          res.status(500).send({msg: err});
        } else {
          var result = [];
          data.rows.forEach(function (row) {
            result.push(row.doc);
          });
          res.send(result);
        }
      });
      res.send("failed");
    },
    create: function(req, res) {
      var bookmark = req.body;

      if (bookmark === undefined || bookmark.link === undefined) {
        res.status(400).send({msg: 'Bookmark malformed.'});
      } else {
        var id = slug(bookmark.link);
        db.get(id, function (err, doc) {
          if (err && !(err.status === 404)) {
            console.log(err);
            res.status(500).send({msg:err});
          } else if (doc !== undefined) {
            res.status(400).send({msg: 'Bookmark already exists.'});
          } else {
            bookmark.type = 'bookmark';
            bookmark._id = id;
            db.put(bookmark, function(err, bookmark) {
              if (err) {
                console.log(err);
                res.status(500).send({msg:err});
              } else {
                res.send(bookmark);
              }
            });
          }
        });
      }
    },
    delete: function (req, res) {
      var id = req.params.id;
      db.get(id, function (err, doc){
        if (err) {
          console.log(err);
          res.status(500).send({msg: err});
        } else if (doc === null){
          res.status(404).send({msg: 'Bookmark does not exist'});
        } else {
          db.remove(doc, function (err, doc) {
            if (err) {
              console.log(err);
              res.status(500).send({msg: err});
            } else {
              res.sendStatus(204);
            }
          });
        }
      });
    }
  }
};

app.get('/api', controllers.base.index);
app.get('/api/bookmarks', controllers.bookmarks.all);
app.post('/api/bookmarks', controllers.bookmarks.create);
app.delete('/api/bookmarks/:id', controllers.bookmarks.delete);


var port = process.env.PORT || 8080;
var host = process.env.HOST || '0.0.0.0';
var server = app.listen(port, host, function(){
  console.log("Example app listening at http://%s:%s", host, port);
});
