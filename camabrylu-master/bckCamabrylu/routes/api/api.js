/// rutas -> router ->  app : express

/// rutas -> router:entidad -> router:api -> app:express


var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportJWT = require('passport-jwt');
var extractJWT = passportJWT.ExtractJwt;
var jwtStrategy = passportJWT.Strategy;


passport.use(
  new jwtStrategy(
    {
      jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey:'leaningserver'
    },
    (payload, next)=>{
        var user = payload;
        return next(null, user);
    }
  )
)


function initApi(db){

    /// Routers de Entidades
    var seguridadRouter = require('./seguridad/seguridad')(db);
    var artesanosRouter = require('./services/services')(db);
    var clientesRouter = require('./clients/clients')(db);

    router.use('/seguridad', seguridadRouter);
    var jwtAuthMiddleware = passport.authenticate('jwt',{session:false});


    router.use('/services', jwtAuthMiddleware, servicesRouter);
    router.use('/clientes', jwtAuthMiddleware, clientesRouter);

    // http://localhost:3000/api/version
  router.get('/version', jwtAuthMiddleware, function(req, res){
        console.log(req.user);
        res.status(200).json({"version":"API v1.0"});
      } );
    return router;
}
//module.exports = router;
module.exports = initApi;
