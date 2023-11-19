const moment = require("moment");

module.exports = {
  Validators: class Validators {
    constructor() { }

    isStartDateValid(startDate) {
      if (!startDate) return false;

      let currentDateObj = new Date();
      const parsedStartDate = moment(startDate, moment.ISO_8601, true); // Parse with strict mode

      if (!parsedStartDate.isValid() || parsedStartDate.toDate() > currentDateObj) {
        console.log(parsedStartDate.isValid())
        return false;
      }
      return true;
    }

    isEndDateValid(endDate) {
      let currentDateObj = new Date();
      const currentDate = currentDateObj.toISOString().split("T")[0]; // Get current date in 'YYYY-MM-DD' format

      const parsedEndDate = moment(endDate, moment.ISO_8601, true); // Parse with strict mode

      if (!parsedEndDate.isValid() || endDate > currentDate) {
        return false;
      }
      return true;
    }
  },
};
