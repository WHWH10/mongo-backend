const mongoose = require("mongoose");
const csvtojsonV2 = require("csvtojson");
const util = require("util");
const {
  HeartRate,
  HeartRateData,
} = require("../../model/structured-data/heartrate-model");
const Storage = require("../../model/common/storage-model");
const moment = require("moment");
require("moment-timezone");

moment.tz.setDefault("Asia/Seoul");
const seoulDate = moment().format("YYYY-MM-DD HH:mm:ss");

const saveHeartRate = async (params, result, author, labName) => {
  if (params.Key.includes("csv")) {
    let saveCsv = await saveToCsv(params);
    let heartRateDataList = [];
    console.log(util.inspect(saveCsv, { showHidden: false, depth: null }));
    saveCsv.map((item) => {
      // Params : Object Storage Bucket Name, Key, Body(buffer), ACL
      // Result : OBject Storage Location, Key, Bucket Name
      console.log(
        `Params ? ` + util.inspect(params, { showHidden: false, depth: null })
      );
      console.log(
        `Result ? ` + util.inspect(result, { showHidden: false, depth: null })
      );
      let heartRateData = new HeartRateData({
        measure_time_YY: item.measure_time_YY,
        measure_time_HH: item.measure_time_HH,
        measure_part: item.measure_part,
        status_ID: item.status_ID,
        heart_rate: item.heart_rate,
        accuracy: item.accuracy,
      });
      heartRateDataList.push(heartRateData);
    });

    const heartRate = new HeartRate({
      fileName: params.Key.split("/").reverse()[0],
      labName: labName,
      author: author,
      objectStorageUrl: result.Location,
      objectStorageKey: result.Key,
      heartRateData: heartRateDataList,
      created_at: seoulDate,
      updated_at: seoulDate,
    });

    await heartRate.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("SUCCESS");
      }
    });
  } else {
    console.log(`?`);
  }
};

const saveToCsv = async (params) => {
  try {
    let list = await csvtojsonV2().fromString(params.Body.toString());
    const bodyJson = JSON.parse(JSON.stringify(list));
    // bodyJson.push({ fileName: params.Key });
    // console.log(util.inspect(bodyJson, { showHidden: false, depth: null }));
    //csvHeader 구할 수 있음 (Json Key값)
    // const keys = Object.keys(bodyJson[0]);
    // console.log(`bodyJson : ${bodyJson}`);
    return bodyJson;
  } catch (err) {
    console.log(err);
    return;
  }
};

module.exports = { saveHeartRate };
