const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");

const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const { Helpers } = require("./helpers/helpers");
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const { Constants } = require("./constants");


module.exports = {
  AWSClient: class AWSClient {
    constructor() {
      this.credentials = Constants.AWS_CREDS;
      this.s3Client = new S3Client(this.credentials);
      this.dynamoDBClient = new DynamoDBClient(this.credentials);
      this.sqsClient = new SQSClient(this.credentials);
      this.snsClient = new SNSClient(this.credentials);
      this.helpers = new Helpers();
    }

    static getInstance() {
      if (!AWSClient.instance) {
        AWSClient.instance = new AWSClient();
      }
      return AWSClient.instance;
    }

    async headS3ObjectCMD(params) {
      try {
        await this.s3Client.send(new HeadObjectCommand(params));
      } catch (error) {
        throw error;
      }
    }

    async putS3ObjCMD(params) {
      try {
        await this.s3Client.send(new PutObjectCommand(params));
        console.log("Item successfully put in S3: ", response);
      } catch (error) {
        console.log("Error storing item in S3: ", error);
        throw error;
      }
    }

    async getS3ObjCMD(params) {
      try {
        const response = await this.s3Client.send(new GetObjectCommand(params));
        console.log("Item retrieved successfully: ", response);
      } catch (error) {
        console.log("Error getting item from S3: ", error);
        throw error;
      }
    }

    async storeDataInDynamoDB(params) {
      try {
        const response = await this.dynamoDBClient.send(new PutItemCommand(params));
        console.log("Data stored successfully: ", response);
      } catch (error) {
        console.error("Error storing data in DynamoDB:", error);
        throw err;
      }
    }

    async sendSQSMessageWithDelay(params) {
      try {
        const response = await this.sqsClient.send(new SendMessageCommand(params));
        console.log("Message sent successfully:", response);
      } catch (error) {
        console.error("Error sending message to SQS:", error);
        throw error;
      }
    }

    async publishMessageToSNS(params) {
      try {
        const response = await this.snsClient.send(new PublishCommand(params));
        console.log('Message published successfully:', response);
      } catch (error) {
        console.error('Error publishing message to SNS:', error);
        throw error;
      }
    }
  },
};