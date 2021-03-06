const { Alert } = require('../models');
var express = require('express');
var router = express.Router();

router.get('/alerts/v1', async function (req, res, next) {
  let q = {};

  const data = await Alert.findOne().or([{ affectedSummonerIds: { $in: req.query.summoner ? req.query.summoner.split(',') : [] } }, { affectedVersions: req.query.v }, { affectedSummonerIds: null }, { affectedVersions: null }]).lean().exec();
  if (!data) return res.send('');

  res.send(data.message);
  if (data.selfDestruction) data.remove();
});

router.get('/alerts/v2', async function (req, res, next) {
  let q = {};

  let data;

  if (req.query.summoner && req.query.v)
    data = await Alert.find().or([{ affectedSummonerIds: parseInt(req.query.summoner.split(',')), affectedVersions: req.query.v }, { affectedSummonerIds: null, affectedVersions: null }, { affectedSummonerIds: parseInt(req.query.summoner.split(',')), affectedVersions: null }, { affectedSummonerIds: null, affectedVersions: req.query.v } ]).exec();
  else if (req.query.summoner)
    data = await Alert.find().or([{ affectedSummonerIds: parseInt(req.query.summoner.split(',')) }, { affectedSummonerIds: null }]).exec();
  else if (req.query.v)
    data = await Alert.find().or([{ affectedVersions: req.query.v }, { affectedVersions: null }]).exec();

  res.send(data);
});

module.exports = router;
