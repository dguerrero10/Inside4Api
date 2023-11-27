// region: "YOUR_AWS_REGION",
// credentials: {
//   accessKeyId: "YOUR_AWS_ACCESS_KEY_ID",
//   secretAccessKey: "YOUR_AWS_SECRET_ACCESS_KEY",
// },

module.exports = {
    Constants: {
      AWS_CREDS: {},
      DYNAMO_DB_AUDIT_TABLE_NAME: "",
      STAGES: {"1": "Downloading Index Files", "2": "Parsing Index Files to CSV"},
      STATUS: {"1": "SUCCEEDED", "2": "FAILED"},
      BUCKETNAME:"" ,
      BUCKETKEY: ""
    },
  };
  