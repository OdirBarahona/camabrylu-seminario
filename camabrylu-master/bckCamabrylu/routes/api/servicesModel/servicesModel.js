var ObjectID = require('mongodb').ObjectID;
var hasIndexOwner = false;
var hasIndexSku = false;

var servicesModelInit = function(db){
  var serviceModel = {};
  var serColl = db.collection('service');
  if (!hasIndexOwner) {
    serColl.indexExists("owner_id_1", (err, rslt) => {
      if (!rslt) {
        serColl.createIndex(
          { ownerID: 1 },
          { name: "owner_id_1" },
          (err, rslt) => {
            console.log(err, rslt);
            hasIndexOwner = true;
          });
      } else {
        hasIndexOwner = true;
      }
    });
    serColl.indexExists("sku_1", (err, rslt) => {
      if (!rslt) {
        serColl.createIndex(
          { sku: 1 },
          { unique:true, name: "sku_1" },
          (err, rslt) => {
            console.log(err, rslt);
            hasIndexSku = true;
          });
      } else {
        hasIndexSku = true;
      }
    });
  }
  serviceModel.pseudoSchema = {
    name:'',
    sku:'',
    barcod:'',
    imgUrl:'',
    price:'',
    ownerId: null,
    ownerName: '',
    stock: 0,
    dateCreated:0,
    status:'ACT',
    comments: [],
    abc:''
  }
  serviceModel.getServiceByOwner = async (ownerId, customFilter, _page, _itemsPerPage, _sortBy, handler)=>{
    var page = _page || 1;
    var itemsPerPage = _itemsPerPage || 25;
    var customFilterf = customFilter || {};
    var sortBy = _sortBy || "sku";
    var filter = {ownerId : new ObjectID(ownerId), ...customFilterf};
    var options = {
      "limit": itemsPerPage,
      "skip": ((page - 1) * itemsPerPage),
      "projection": {
        "name": 1, "sku":1, "barcod": 1, "price": 1, "stock":1
      },
      "sort": [[sortBy, 1]]
    };
    let cursor = serColl.find(filter, options);
    let totalserv = await cursor.count();
    cursor.toArray((err, docs)=>{
      if (err) {
          console.log(err);
          return handler(err, null);
      } else {
          return handler(null, {total: totalserv, services: docs});
      }
    });
  }; // getServiceByOwner

  serviceModel.getServiceByFilter = async (customFilter, _page, _itemsPerPage, _sortBy, handler) => {
    var page = _page || 1;
    var itemsPerPage = _itemsPerPage || 25;
    var customFilterf = customFilter || {};
    var sortBy = _sortBy || "sku";
    var filter = {...customFilterf };
    var options = {
      "limit": itemsPerPage,
      "skip": ((page - 1) * itemsPerPage),
      "projection": {
        "name": 1, "sku": 1, "barcod": 1, "price": 1, "stock": 1
      },
      "sort": [[sortBy, 1]]
    };
    let cursor = serColl.find(filter, options);
    let totalserv = await cursor.count();
    cursor.toArray((err, docs) => {
      if (err) {
        console.log(err);
        return handler(err, null);
      } else {
        return handler(null, { total: totalserv, services: docs });
      }
    });
  }; // getServicetByFilter

  servicesModel.getServicesById = (serId, handler) => {
      var filter= {"_id": new ObjectID(serId)};
      serColl.findOne(filter, (err, doc)=>{
        if(err){
          console.log(err);
          return handler(err, null);
        } else {
          return handler(null, doc);
        }
      });
  }; // getServicetById

  productModel.addNewService = ( ownerId, ownerName, servInput, handler) => {
    var newServices = {
      ...servicesModel.pseudoSchema,
      ...servInput
    }
    newServices.dateCreated = new Date().getTime();
    newServices.ownerId= new ObjectID(ownerId);
    newServices.ownerName= ownerName;
    serColl.insertOne(newServices, (err, rslt)=>{
      if(err){
        console.log(err);
        return handler(err, null);
      } else {
        return handler(null, rslt.ops[0]);
      }
    }); //insertOne
  }; //addNewService


  servicesModel.updateServices = (serId, servInput, handler) => {
    var filter = { "_id": new ObjectID(serId) };
    var { name, barcod, imgUrl, price} = servInput;
    var finalUpdate = {};
    if(name){
      finalUpdate.name = name;
    }
    if(barcod){
      finalUpdate.barcod = barcod;
    }
    if(imgUrl){
      finalUpdate.imgUrl = imgUrl;
    }
    if(price){
      finalUpdate.price = price;
    }
    var updateCmd = { "$set": finalUpdate };
    serColl.findOneAndUpdate(filter, updateCmd, { returnOriginal: false }, (err, rslt) => {
      if (err) {
        console.log(err);
        return handler(err, null);
      } else {
        return handler(null, rslt.value);
      }
    })
  }; 

  return servicesModel;
};

module.exports = servicesModelInit;