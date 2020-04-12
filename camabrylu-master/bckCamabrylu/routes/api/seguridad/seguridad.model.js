var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');
var hasIndexEmail = false;

function pswdGenerator( pswdRaw ){
  var hashedPswd = bcrypt.hashSync(pswdRaw, 10);
  return hashedPswd;
}


module.exports = (db)=>{
  var seguridadModel = {}
  var seguridadCollection = db.collection("users");

  //verificar que tenga el indice, y si no lo tiene crearlo
  if(!hasIndexEmail) {
    seguridadCollection.indexExists("userEmail_1", (err, rslt)=>{
        if(!rslt){
          seguridadCollection.createIndex(
            { userEmail: 1 },
            { unique: true, name:"userEmail_1"},
            (err, rslt)=>{
              console.log(err, rslt);
              hasIndexEmail = true;
            });
        } else {
          hasIndexEmail = true;
        }
    });
  }

  var userTemplate = {
    userEmail: "",
    userPswd: "",
    userCompleteName: "",
    userDateCreated: null
  }
  seguridadModel.getAll = (handler)=>{
    // handler(err, docs)
    seguridadCollection.find({}).toArray(handler);
  }

  seguridadModel.addNew = (dataToAdd, handler)=>{
      //handler(err, addedDocument)
      /*
      useremail:carmengudiel625@gmail.com
      userpswd:seajoy
      usernames:Carmen Gudiel
      lola:choluteca
       */
    var { useremail, userpswd, usernames} = dataToAdd;
    var userToAdd = Object.assign(
      {},
      userTemplate,
      {
        userEmail: useremail,
        userPswd: pswdGenerator(userpswd),
        userCompleteName: usernames,
        userDateCreated: new Date().getTime()
      }
    );
    seguridadCollection.insertOne(userToAdd, (err, rslt)=>{
      if(err){
        return handler(err, null);
      }
      console.log(rslt);
      return handler(null, rslt.ops[0]);
    }); //insertOner
  }

  seguridadModel.update = ( dataToUpdate , handler )=>{
    var { _id, userpswd, usernames} = dataToUpdate;
    var query = { "_id": new ObjectID(_id)};
    var updateCommad = {
      "$set":{
        userPswd: pswdGenerator(userpswd),
        userCompleteName: usernames,
        lastUpdated: new Date().getTime()
      },
      "$inc" :{
        "updates": 1
      }
    };
    seguridadCollection.updateOne(
      query,
      updateCommad,
      (err, rslt)=>{
        if(err){
          return handler(err, null);
        }
        return handler(null, rslt.result);
      }
    );// updateOne
  }

  seguridadModel.deleteByCode = (id, handler)=>{
    var query = {"_id": new ObjectID(id)};
    seguridadCollection.deleteOne(
      query,
      (err, rslt)=>{
        if(err){
          return handler(err, null);
        }
        return handler(null, rslt.result);
      }
    ); //deleteOne
  }

  seguridadModel.getById = (id, handler) => {
    var query = { "_id": new ObjectID(id) };
    seguridadCollection.findOne(
      query,
      (err, doc) => {
        if (err) {
          return handler(err, null);
        }
        return handler(null, doc);
      }
    ); //findOne
  }

  seguridadModel.comparePswd = (hash, raw)=>{
    return bcrypt.compareSync(raw, hash);
  }

  seguridadModel.getByEmail = (email, handler)=>{
    var query = {"userEmail":email};
    var projection = { "userEmail": 1, "userPswd": 1, "userCompleteName":1};
    seguridadCollection.findOne(
      query,
      {"projection":projection},
      (err, user)=>{
        if(err){
          return handler(err,null);
        }
        return handler(null, user);
      }
    )
  }

  return seguridadModel;
}

// var userModel = {};

// var userCollection = [];
// var userTemplate = {
//     userEmail: "",
//     userPswd: "",
//     userCompleteName:"",
//     userID:"",
//     userDataCreated:null 

     
// }
// userModel.getAll =()=>{
//     return userCollection;

// }
//     userModel.getById = (id)=>{
//         var filteredUsers = userCollection.filter(
//             (o)=>{
//                 return o.userID === id;

//             }
//         );
//         if(filteredUsers.length){
//             return filteredUsers[0];
//         }else{
//             return null
//         }
//     }

    
//     userModel.addNew =( {useremail, userpswd, usernames} )=>{
//          var newUser= Object.assign(
//             {}, 
//             userTemplate,
//         {
//             userEmail: useremail,
//             userPswd: userpswd,
//             userCompleteName: usernames,
//             userDataCreated:new Date().getTime()
//         }
//         );
//         newUser.userID = userCollection.length + 1;
//         userCollection.push(newUser);
//         return newUser;
    
//     }
        
//     userModel.update=(id, { userpswd, usernames})=>{
//         var updatingUser = userCollection.filter(
//             (o, i)=>{
//                 return o.userID ===id;

//             }

//         );

//     }

// userCollection.push(
//     Object.assign(
//         {}, 
//         userTemplate,
//     {
//         userEmail:"carmengudiel625@gmail.com",
//         userPswd: "seminario0601",
//         userCompleteName:"Carmen Gudiel",
//         userID: 1,
//         userDataCreated:new Date().getTime()
//     }
//     )
// );
// userCollection.push(
// Object.assign(
//     {}, 
//     userTemplate,
// {
//     userEmail:"manueleaguilarr@gmail.com",
//     userPswd: "choluteca0601",
//     userCompleteName:"Manuel Aguilar",
//     userID: 2,
//     userDataCreated:new Date().getTime()
// }
// )
// );
// module.exports = userModel;