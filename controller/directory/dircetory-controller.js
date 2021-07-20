const AWS = require("aws-sdk");
const logger = require("../../config/customLogger");
// const logger = require("../../config/customLogger");
// const logger = require("../../config/logger");

const endpoint = new AWS.Endpoint("https://kr.object.ncloudstorage.com");

// 메인 카테고리 읽어외(Object Storage 메인 폴더)
const getMainCategory = async (req, res) => {
  const s3 = new AWS.S3({
    endpoint: endpoint,
    region: "kr-standard",
    credentials: {
      accessKeyId: process.env.NAVER_CLOUD_ACCESS_KEY_ID,
      secretAccessKey: process.env.NAVER_CLOUD_SECRET_KEY,
    },
  });

  const params = {
    Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
    Delimiter: "/",
    MaxKeys: 300,
  };

  //   let list;

  try {
    await s3
      .listObjectsV2(params)
      .promise()
      .then((result) => {
        // console.log(result);
        let list = [];
        for (let i = 0; i < result.CommonPrefixes.length; i++) {
          list.push(result.CommonPrefixes[i].Prefix.split("/")[0]);
        }
        console.log(list);
        logger.appLogger().log({
          level: "info",
          message: "getMainCategory " + list,
        });
        return res.json({
          ResultCode: 200,
          ResultMessage: list,
        });
      })
      .catch((err) => {
        logger.appLogger().log({
          level: "error",
          message: "getMainCategory--listObjectsV2 " + err,
        });
        return res.json({
          ResultCode: 400,
          ResultMessage: err.toString(),
        });
      });
  } catch (err) {
    console.log(`getMainCategory -- ${err}`);
    logger.appLogger().log({
      level: "error",
      message: "getMainCategory---catcherror " + err,
    });
    return res.json({
      ResultCode: 400,
      ResultMessage: err.toString(),
    });
    // logger.error(err);
  }
};

// 일반 카테고리 긁어오기
const getLabCategory = (req, res) => {
  const params = {
    Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
    Prefix: "일반/",
    Delimiter: "/",
    MaxKeys: 300,
  };

  try {
    let list = [];
    getListObject(params)
      .then((result) => {
        console.log(result);

        for (let i = 0; i < result.CommonPrefixes.length; i++) {
          list.push(
            result.CommonPrefixes[i].Prefix.replace("일반/", "").split("/")[0]
          );
        }

        console.log(list);
        logger.appLogger().log({
          level: "info",
          message: "getLabCategory " + list,
        });

        return res.json({
          ResultCode: 200,
          ResultMessage: list,
        });
      })
      .catch((err) => {
        logger.appLogger().log({
          level: "error",
          message: "getLabCategory listObject " + err.toString(),
        });
        return res.json({
          ResultCode: 400,
          ResultMessage: err.toString(),
        });
      });
  } catch (err) {
    logger.appLogger().log({
      level: "error",
      message: "getLabCategory catch " + err,
    });
    return res.json({
      ResultCode: 400,
      ResultMessage: err.toString(),
    });
  }
};

// 일반에 있는 모든 카테고리 긁어오기
const getLabSubCategory = (req, res) => {
  let category = req.params.category;
  console.log(category);
  const params = {
    Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
    Prefix: `일반/`,
    // Delimiter: "/",
    MaxKeys: 300,
  };

  try {
    let list = [];
    if (
      category.toString().toUpperCase() == "CA" ||
      category.toString().toUpperCase() == "PA"
    ) {
      getListObject(params)
        .then((result) => {
          for (let i = 0; i < result.Contents.length; i++) {
            list.push(result.Contents[i].Key);
          }

          console.log(result);
          logger.appLogger().log({
            level: "info",
            message: "getLabCategory " + list,
          });

          return res.json({
            ResultCode: 200,
            ResultMessage: list,
          });
        })
        .catch((err) => {
          logger.appLogger().log({
            level: "error",
            message: "getLabCategory listObject " + err.toString(),
          });
          return res.json({
            ResultCode: 400,
            ResultMessage: err.toString(),
          });
        });
    } else {
      return res.json({
        ResultCode: 400,
        ResultMessage: "Please Check Request Params",
      });
    }
  } catch (err) {
    logger.appLogger().log({
      level: "error",
      message: "getLabCategory catch " + err,
    });
    return res.json({
      ResultCode: 400,
      ResultMessage: err.toString(),
    });
  }
};

const getSubCategoryDepth = (req, res) => {
  let category = req.params.category;
  let subcategory = req.params.subcategory;

  let subCategoryList = [
    "eeg",
    "fmri",
    "mutimodal",
    "모바일",
    "설문",
    "자가진단",
  ];

  console.log(category.toString().toUpperCase());
  console.log(subcategory);

  // const params = {
  //   Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
  //   Prefix: `일반/${category.toString().toUpperCase()}/EEG/`,
  //   Delimiter: "/",
  //   // MaxKeys: 300,
  // };

  let params;

  if (
    category.toString().toUpperCase() == "CA" ||
    category.toString().toUpperCase() == "PA"
  ) {
    if (subCategoryList.includes(subcategory)) {
      try {
        if (subcategory.toString().toUpperCase() == "EEG") {
          console.log("eeg");
          params = {
            Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
            Prefix: `일반/${category.toString().toUpperCase()}/EEG/`,
            Delimiter: "/",
            // MaxKeys: 300,
          };
        } else if (subcategory.toString().toUpperCase() == "FMRI") {
          console.log("fmri");
          params = {
            Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
            Prefix: `일반/${category.toString().toUpperCase()}/fMri/`,
            Delimiter: "/",
          };
        } else if (subcategory.toString().toUpperCase() == "MUTIMODAL") {
          console.log("muti");
          params = {
            Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
            Prefix: `일반/${category.toString().toUpperCase()}/MutilModal/`,
            Delimiter: "/",
          };
        } else if (subcategory.toString() == "모바일") {
          console.log("모바일");
          params = {
            Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
            Prefix: `일반/${category.toString().toUpperCase()}/모바일/`,
            Delimiter: "/",
          };
        } else if (subcategory.toString() == "자가진단") {
          console.log("자가진단");
          params = {
            Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
            Prefix: `일반/${category.toString().toUpperCase()}/자가진단/`,
            Delimiter: "/",
          };
        } else if (subcategory.toString() == "설문") {
          console.log("설문");
          params = {
            Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
            Prefix: `일반/${category.toString().toUpperCase()}/설문/`,
            Delimiter: "/",
          };
        } else {
          params = {
            Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
            Prefix: `일반/${category
              .toString()
              .toUpperCase()}/${subcategory.toString()}/`,
            Delimiter: "/",
          };
        }
        getListObject(params)
          .then((result) => {
            let list = [];
            for (let i = 0; i < result.CommonPrefixes.length; i++) {
              list.push(
                result.CommonPrefixes[i].Prefix.split("/").reverse()[1]
              );
            }
            return res.json({
              ResultCode: 200,
              ResultMessage: list,
            });
          })
          .catch((err) => {
            return res.json({
              ResultCode: 400,
              ResultMessage: err.toString(),
            });
          });
      } catch (err) {
        return res.json({
          ResultCode: 400,
          ResultMessage: err.toString(),
        });
      }
    } else {
      return res.json({
        ResultCode: 400,
        ResultMessage: "Please Check Request SubCategory Params",
      });
    }
  } else {
    return res.json({
      ResultCode: 400,
      ResultMessage: "Please Check Request Category Params",
    });
  }
};

const getLabFile = (req, res) => {
  let category = req.params.category;
  let subcategory = req.params.subcategory;
  let labName = req.params.labName;

  let subCategoryList = [
    "eeg",
    "fmri",
    "mutimodal",
    "모바일",
    "설문",
    "자가진단",
  ];

  let params;

  if (
    category.toString().toUpperCase() == "CA" ||
    category.toString().toUpperCase() == "PA"
  ) {
    if (subCategoryList.includes(subcategory)) {
      try {
        if (subcategory.toString().toUpperCase() == "EEG") {
          console.log("eeg");
          params = {
            Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
            Prefix: `일반/${category.toString().toUpperCase()}/EEG/${labName}/`,
            Delimiter: "/",
            // MaxKeys: 300,
          };
        } else if (subcategory.toString().toUpperCase() == "FMRI") {
          console.log("fmri");
          params = {
            Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
            Prefix: `일반/${category
              .toString()
              .toUpperCase()}/fMri/${labName}/`,
            Delimiter: "/",
          };
        } else if (subcategory.toString().toUpperCase() == "MUTIMODAL") {
          console.log("muti");
          params = {
            Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
            Prefix: `일반/${category
              .toString()
              .toUpperCase()}/MutilModal/${labName}/`,
            Delimiter: "/",
          };
        } else if (subcategory.toString() == "모바일") {
          console.log("모바일");
          params = {
            Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
            Prefix: `일반/${category
              .toString()
              .toUpperCase()}/모바일/${labName}/`,
            Delimiter: "/",
          };
        } else if (subcategory.toString() == "자가진단") {
          console.log("자가진단");
          params = {
            Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
            Prefix: `일반/${category
              .toString()
              .toUpperCase()}/자가진단/${labName}/`,
            Delimiter: "/",
          };
        } else if (subcategory.toString() == "설문") {
          console.log("설문");
          params = {
            Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
            Prefix: `일반/${category
              .toString()
              .toUpperCase()}/설문/${labName}/`,
            Delimiter: "/",
          };
        } else {
          params = {
            Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
            Prefix: `일반/${category
              .toString()
              .toUpperCase()}/${subcategory.toString()}/${labName}/`,
            Delimiter: "/",
          };
        }
        getListObject(params)
          .then((result) => {
            return res.json({
              ResultCode: 200,
              ResultMessage: result.Contents,
            });
          })
          .catch((err) => {
            return res.json({
              ResultCode: 400,
              ResultMessage: err.toString(),
            });
          });
      } catch (err) {
        return res.json({
          ResultCode: 400,
          ResultMessage: err.toString(),
        });
      }
    }
  } else {
    return res.json({
      ResultCode: 400,
      ResultMessage: "Please Check Request Category Params",
    });
  }
};

const getClinicCategory = (req, res) => {
  const params = {
    Bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
    Prefix: "임상/",
    Delimiter: "/",
    MaxKeys: 300,
  };

  try {
    let list = [];
    getListObject(params)
      .then((result) => {
        console.log(result);

        for (let i = 0; i < result.CommonPrefixes.length; i++) {
          list.push(
            result.CommonPrefixes[i].Prefix.replace("임상/", "").split("/")[0]
          );
        }

        console.log(list);
        logger.appLogger().log({
          level: "info",
          message: "getLabCategory " + list,
        });

        return res.json({
          ResultCode: 200,
          ResultMessage: list,
        });
      })
      .catch((err) => {
        logger.appLogger().log({
          level: "error",
          message: "getLabCategory listObject " + err.toString(),
        });
        return res.json({
          ResultCode: 400,
          ResultMessage: err.toString(),
        });
      });
  } catch (err) {
    logger.appLogger().log({
      level: "error",
      message: "getLabCategory catch " + err,
    });
    return res.json({
      ResultCode: 400,
      ResultMessage: err.toString(),
    });
  }
};

function getListObject(params) {
  const s3 = new AWS.S3({
    endpoint: endpoint,
    region: "kr-standard",
    credentials: {
      accessKeyId: process.env.NAVER_CLOUD_ACCESS_KEY_ID,
      secretAccessKey: process.env.NAVER_CLOUD_SECRET_KEY,
    },
  });

  return new Promise((resolve, reject) => {
    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = {
  getMainCategory,
  getLabCategory,
  getClinicCategory,
  getLabSubCategory,
  getSubCategoryDepth,
  getLabFile,
};
