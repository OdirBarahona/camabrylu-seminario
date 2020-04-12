var express = require("express");
var router = express.Router();

function serviceInit(db) {
  var serviModel = require("../servicesModel/servicesModel")(db);

  router.get('/service/find/:id', (req, res) => {
    var { id: _id } = req.params;
    var id = _id || '';
    serviModel.getServiceById(id, (err, doc) => {
      if (err) {
        return res.status(500).json({});
      }
      return res.status(200).json(doc);
    })
  })

  router.get('/service/:page/:items', (req, res)=>{
      var {page, items} = req.params;
      serviModel.getServiceByOwner(
        req.user._id,
        {},
        parseInt(page),
        parseInt(items),
        "sku",
        (err, rslt)=>{
          if(err){
            return res.status(500).json({});
          }
          return res.status(200).json(rslt);
        });
  }); // get service page items

  router.post('/service/add', (req, res)=>{
    var {name, sku, barcod, price, stock} = req.body;
    var insertCurated= {};
    if(name && !(/^\s*$/).test(name)){
      insertCurated.name = name;
    }
    if (sku && !(/^\s*$/).test(name)) {
      insertCurated.sku = sku;
    }
    if (barcod && !(/^\s*$/).test(barcod)) {
      insertCurated.sku = sku;
    }
    if (price && !isNaN(price)) {
      insertCurated.price = parseFloat(price);
    }
    if (stock && !isNaN(stock)) {
      insertCurated.stock = parseFloat(stock);
    }
    serviModel.addNewService(
       req.user._id,
       req.user.userCompleteName,
       insertCurated,
       (err, rslt)=>{
         if(err){
           return res.status(500).json({});
         }
         return res.status(200).json(rslt);
      }
    );
  });



  router.put('/service/upd/:id', (req, res)=>{
    var { name, price, stock, status } = req.body;
    var updateCurated = {};
    if (name && !(/^\s*$/).test(name)) {
      updateCurated.name = name;
    }
    if (sku && !(/^\s*$/).test(name)) {
      updateCurated.sku = sku;
    }
    if (barcod && !(/^\s*$/).test(barcod)) {
      updateCurated.sku = sku;
    }
    if (price && !isNaN(price)) {
      updateCurated.price = parseFloat(price);
    }
    
    serviceModel.updateService(
      req.params.id,
      updateCurated,
      (err, rslt) => {
        if (err) {
          return res.status(500).json({});
        }
        return res.status(200).json(rslt);
      }
    );
  });

  router.put('/service/updimg/:id', (req, res) => {
    var { imageurl } = req.body;
    var updateCurated = {};
    updateCurated["imgUrl"] = imageurl;
    serviceModel.updateService(
      req.params.id,
      updateCurated,
      (err, rslt) => {
        if (err) {
          return res.status(500).json({});
        }
        return res.status(200).json(rslt);
      }
    );
  });

  
}

module.exports = serviceInit;
