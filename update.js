require('dotenv').config()
const axios = require('axios');
const fs = require('fs');





function format(data) {
    const txt = `# ${data.title} 
### Picture of the Day - NASA - ${new Date().toLocaleDateString()}
<img src="${data.url}" alt="nasa picture of the day" width="300"/>`
    fs.writeFileSync('README.md', txt)

}

function isSpecialDay() {
    const today = new Date();


}


function main() {

    if (!isSpecialDay()) {
        return
    }

    axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`)
        .then(response => format(response.data))
        .catch(error => {
            console.log(error);
            // read backup.md and write to README.md
            const str = fs.readFileSync('backup.md');
            fs.writeFileSync('README.md', str)

        });

}

// main()


// TODO : for now returns true on every 4th sunday, check if the current day belongs to the same week 
function check(today) {
    //yyyy-mm-dd
    const referenceDate = new Date('2023-01-07'); // thats a sunday

    // Calculate the interval in milliseconds for 4 weeks
    const intervalInMilliseconds = 4 * 7 * 24 * 60 * 60 * 1000;

    // Calculate the time difference in milliseconds
    const timeDifference = today - referenceDate;

    //if the day is in this week
    if(timeDifference >= 0 && timeDifference % intervalInMilliseconds < 24 * 60 * 60 * 1000){
        return true
    }
    return false

}



function iterateThroughDaysOfYear(year, checkFunc) {
    const startDate = new Date(year, 0, 1); // January 1st of the given year
    const endDate = new Date(year, 11, 31); // December 31st of the given year

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        if (currentDate.getDay() === 0) {
            console.log(); // Print the current date
        }
        console.log(currentDate.toDateString(), checkFunc(currentDate) ? "<---" : ""); // Print the current date
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }
}

iterateThroughDaysOfYear(2023,check);
