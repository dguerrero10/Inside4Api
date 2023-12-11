const { Constants } = require("../../util/constants");
const fs = require('fs')
const { Helpers } = require("../../util/helpers/helpers");
const axios = require('axios')

class IndexFileLocal {
    constructor(quarter = null, year = null){
        this.quarter = quarter
        this.year = year
        this.fileName = `form-index-${this.year}-${this.quarter}.txt`
        this.url = `https://www.sec.gov/Archives/edgar/full-index/${this.year}/${this.quarter}/form.idx`
        this.formFiles = []

        this.file = null
        this.helpers = new Helpers();


        this.path = "../indexFiles/"
        this.dbTXT = "../indexFiles/db/indexFiles.txt"
    }

    //check if file exists in folder already
    //Returns: Boolean
    checkFileExists = async () => {
        try {
            // Check if the file is already in local folder
            if (fs.existsSync(`${this.path}/${this.fileName}`)) {
                console.log(`Skipping index file for ${this.year}, ${this.quarter} because it is already in S3.`);
                return true
            }

        } catch (err) {
            // File doesn't exist in local folder, proceed to download and save
            console.log("File doesn't exist in local folder, proceed to download and save")
            return false
        }
    }

    //Downloads file from website 
    downloadFormFile = async () => {

        try {

            //Download file
            const response = await axios.get(
                this.url, 
                {
                    headers: {
                        "Access-Control-Expose-Headers": "X-Suggested-Filename",
                        //"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Adam Developer",
                        "User-Agent":"Adam Developer asornoso@gmail.com",
                        "Accept-Encoding": "gzip, deflate"
                    },
                    responseType: "blob"
                }
            );

            //verify no errors
            if (!response.data) {
              throw new Error(`Error: No data in response for ${this.url}`);
            }
            
            this.file = response.data
            
            return 0
          } catch (error) {

            console.error(error);
            return -1
          }
    }

    // this saves the file locally
    saveFormFile = async () => {
        try{
            if(this.file == null){
                throw new Error(`File data not present for upload:  ${this.url}`)
            }
            //save file

            fs.writeFile(`${this.path}/${this.fileName}`, this.file, error => {
                if (error) {
                    throw new Error(error)
                }
                console.log(`Successfully saved index file for ${this.year}, ${this.quarter} to local.`);

            })
        }
        catch(error){
            console.log(error)
        }

    }

    saveURLtoDB = async (isSuccess, error) => {


        let dynamodbParams = null

        if(isSuccess){
            dynamodbParams = `${ Constants.STAGES["1"]}, Successfully stored file with url: ${this.url}, ${Constants.STATUS["1"]} , ${""}, ${this.helpers.getFormattedTimestamp()} \n`
          
        }
        else{
            dynamodbParams = `${ Constants.STAGES["1"]}, Failed to download index file for ${this.year}, ${this.quarter}, ${Constants.STATUS["2"]} , ${error}, ${this.helpers.getFormattedTimestamp()} \n`

        }
      
        fs.appendFile( this.dbTXT, dynamodbParams, (err) => { 
            if (err) { 
              console.log(err); 
            } 
          }); 
    }

}

module.exports = IndexFileLocal