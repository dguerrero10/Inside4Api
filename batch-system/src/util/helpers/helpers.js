const { XMLParser } = require("fast-xml-parser");
const { Constants } = require("../constants");

module.exports = {
  Helpers: class Heleprs {
    constructor() {
      this.XMLparser = new XMLParser();
    }

    getFormattedTimestamp() {
      const currentDate = new Date();
    
      // Get individual components of the date
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
      const year = currentDate.getFullYear();
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
    
      // Pad the day, month, hours, and minutes with leading zeros if necessary
      const paddedDay = day < 10 ? `0${day}` : day;
      const paddedMonth = month < 10 ? `0${month}` : month;
      const paddedHours = hours < 10 ? `0${hours}` : hours;
      const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
      // Format the timestamp as DD-MM-YYYY HH:MM
      return `${paddedDay}-${paddedMonth}-${year} ${paddedHours}:${paddedMinutes}`;
    }
    

    mapXMLToJSON(xml) {
      const xmlToMap = xml.substring(
        xml.indexOf("<ownershipDocument>"),
        xml.lastIndexOf("</ownershipDocument>")
      );
      return JSON.stringify(this.parser.parse(xmlToMap)["ownershipDocument"]);
    }

    buildS3HeadParams(bucketName, s3Key) {
      return {
        Bucket: bucketName,
        Key: s3Key
      }
    }

    buildS3PutParams(bucketName, s3Key, body, contentType) {
      return {
        Bucket: bucketName,
        Key: s3Key,
        Body: body,
        ContentType: contentType
      };
    }

    buildS3GetParams(bucketName, s3Key) {
      return {
        Bucket: bucketName,
        Key: s3Key,
      };
    }

    buildSQSParams(queueUrl, messageBody, delaySeconds) {
      return  {
        QueueUrl: queueUrl,
        MessageBody: messageBody,
        DelaySeconds: delaySeconds,
      };
    }

    buildSNSParams(topicArn, message) {
      return {
        TopicArn: topicArn,
        Message: message,
      };
    }

    buildDynamoDBParams(stage, msg, url, status, errMsg) {
      return {
        TableName: Constants.DYNAMO_DB_AUDIT_TABLE_NAME,
        Item: {
          stage: { S: stage },
          msg: { S: msg },
          url: { S: url },
          status: { S: status },
          errMsg: { S: errMsg },
          timeStored: { S: this.helpers.getFormattedTimestamp() },
        },
      };
    }
  },
};
