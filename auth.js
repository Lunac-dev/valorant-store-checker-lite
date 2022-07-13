const express = require('express')
const router = express.Router()
const axios = require("axios").default;
const Valorant = require('./auth/main');

const rate = require('express-rate-limit');
var authlimiter = rate({
    windowMs: 20*60*1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: function (_req, res, _next) {
        return res.status(200).json({
            status: 'You sent too many requests. Please wait a while then try again.'
        })
    },
    keyGenerator: (req, _res) => req.headers["cf-connecting-ip"]
});

let skinlevels = ""
let skindata = ""
let offers = "";

getData();

async function getData() {
  await axios.get("https://valorant-api.com/v1/weapons/skinlevels")
  .then((response) => {
    skinlevels = response.data
  })
  await axios.get("https://valorant-api.com/v1/weapons/skins")
  .then((response) => {
    skindata = response.data
  })
  await axios.get("https://api.henrikdev.xyz/valorant/v1/store-offers")
  .then((response) => {
    offers = response.data;
  })
  console.log("Got data")
}

router.get('/api/auth', authlimiter, async (req, res, _next) => {
  const accname = req.header("accname")
  const accpassword = req.header("accpassword")
  const accregion = req.header("accregion")
  let store = null
  let wallet = null
  let status = true
  if (accname == undefined || accpassword == undefined || accregion == undefined) {
    res.json({ status: 'Incorrect request' })
    return
  }

  const valorantApi = new Valorant.API(accregion);
  await valorantApi.auth(accname, accpassword).then(() => {
  }).catch((err) => {
    status = false
    if (err.message === "2fa") {
      res.json({ status: '2fa', asidcookie: valorantApi.asidcookie})
    } else {
      res.json({ status: err.message});
    }
  });

  if (!status) return

  await valorantApi.getPlayerStoreFront(valorantApi.user_id).then((response) => {
    store = response.data
  });

  await valorantApi.getPlayerWallet(valorantApi.user_id).then((response) => {
    wallet = response.data
  });

  if (store) {
    const offersweapons = getStoreWeapons(store)
    res.json({ status: 200, store: offersweapons, wallet: wallet})
  }
})

router.get('/api/auth2fa', async (req, res, _next) => {
  const code = req.header("code")
  const asidcookie = req.header("asidcookie")
  const accregion = req.header("accregion")
  let store = null
  let wallet = null
  let status = true
  if (code == undefined || asidcookie == undefined || accregion == undefined) {
    res.json({ status: 'Incorrect request' })
    return
  }

  const valorantApi = new Valorant.API(accregion);
  await valorantApi.authWithCode(asidcookie, code).then(() => {
  }).catch((err) => {
    res.json({ status: err.code});
  });

  if (!status) return

  await valorantApi.getPlayerStoreFront(valorantApi.user_id).then((response) => {
    store = response.data
  });

  await valorantApi.getPlayerWallet(valorantApi.user_id).then((response) => {
    wallet = response.data
  });

  if (store) {
    const offersweapons = getStoreWeapons(store)
    res.json({ status: 200, store: offersweapons, wallet: wallet})
  }
})

function getStoreWeapons(store) {
  const offersIDs = store["SkinsPanelLayout"]["SingleItemOffers"];

  const offerleft = store["SkinsPanelLayout"]["SingleItemOffersRemainingDurationInSeconds"];

  let offersweapons = [];

  offersweapons.push({ offerleft: offerleft, date: new Date().getTime() });

  for (var i = 0;  i < 4;  i++) {
    const weapon1 = skinlevels.data.find((v) => v.uuid == offersIDs[i]);
    //Get offers
    const offer = offers.data.Offers.find((v) => v.OfferID == offersIDs[i]);
    const offerid = Object.keys(offer.Cost)[0];
    const vp = offer.Cost[offerid];

    //Get Tier
    const tierid = skindata.data.filter((v) => v.levels[0]["uuid"] == weapon1.uuid)[0]["contentTierUuid"];

    //Weapon Videos and Image
    const image = 'https://s3.valorantstore.net/weaponskinlevels/' + offersIDs[i] + '.png'
    let video = 'null'
    if (weapon1.streamedVideo != undefined) {
      video = 'https://s3.valorantstore.net/streamedVideo/' + offersIDs[i] + '.mp4'
    }

    //Push
    offersweapons.push({ name: weapon1.displayName, imgsrc: image, vp: vp, tierid: tierid, videosrc: video })
  }

  //Night Marcket
  if ("BonusStore" in store) {
    let bonusweapons = [];
    const bonus = store["BonusStore"]["BonusStoreOffers"];

    const bonusleft = store["BonusStore"]["BonusStoreRemainingDurationInSeconds"];

    for (var i = 0;  i < 6;  i++) {
      let weapon1 = skinlevels.data.find((v) => v.uuid == bonus[i]["Offer"]["Rewards"][0]["ItemID"]);
      let discount = Object.keys(bonus[i]["DiscountCosts"])[0];

      //Get Tier
      let tierid = skindata.data.filter((v) => v.levels[0]["uuid"] == weapon1.uuid)[0]["contentTierUuid"];

      //Weapon Videos and Image
      const image = 'https://s3.valorantstore.net/weaponskinlevels/' + weapon1.uuid + '.png'
      let video = 'null'
      if (weapon1.streamedVideo != undefined) {
        video = 'https://s3.valorantstore.net/streamedVideo/' + weapon1.uuid + '.mp4'
      }

      //Push
      bonusweapons.push({ name: weapon1.displayName, imgsrc: image, vp: bonus[i]["DiscountCosts"][discount], vpold: bonus[i]["Offer"]["Cost"][discount],tierid: tierid, videosrc: video})
    }
    bonusweapons.push({BonusLeft: bonusleft});
    offersweapons.push({BonusStore: bonusweapons});
  }

  return offersweapons
}

module.exports = router