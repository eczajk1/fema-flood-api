var express = require('express');
var router = express.Router();

var env = process.env.NODE_ENV || 'development';
var config = require('../config/config.json')[env];
var FirmModels = require('fema-firm-sequelize');
var models = new FirmModels(config);

router.get('/streams', function(req, res, next) {
  var where = req.query ? req.query : {};
  var options = {
    where: where
  };
  models.s_profil_basln.findAll(options).then(function (instances) {
    res.status(200).send(instances);
    res.end();
  }, function (reason) {
    console.log(reason);
  });
});

router.get('/studies', function(req, res, next) {
  var where = req.query ? req.query : {};
  var options = {
    where: where
  };
  models.study_info.findAll(options).then(function (instances) {
    res.status(200).send(instances);
    res.end();
  }, function (reason) {
    console.log(reason);
  });
});

router.get('/xs', function (req, res, next) {
  var where = req.query ? req.query : {};
  var raw =   'select * from "firm"."s_profil_basln" as "s_profil_basln" ' +
              'INNER JOIN "firm"."s_xs" as "s_xs" ' +
              'ON ST_Intersects("s_xs"."THE_GEOM", "s_profil_basln"."THE_GEOM") ' +
              'WHERE "s_xs"."WTR_NM" = \'' + where.WTR_NM + '\'' +
              'AND "s_xs"."DFIRM_ID" = \'' + where.DFIRM_ID + '\'';

  models.sequelize.query(raw, {
    model: models.s_xs
  }).then(function (baslns) {

    res.status(200).send(baslns);
    res.end();

  }, function (reason) {
    console.log('error');
  });
});

router.get('/profile', function (req, res, next) {
  var where = req.query ? req.query : {};
  var options = {
    include: [
      models.l_xs_elev,
      models.l_xs_struct
    ],
    where: where
  };

  models.s_xs.findAll(options).then(function (instances) {

    res.status(200).send(instances);
    res.end();

  }, function (reason) {
    console.log('error');
  });
});

module.exports = router;
