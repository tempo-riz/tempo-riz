require('dotenv').config()
const axios = require('axios');
const fs = require('fs');


const ref = new Date('2023-10-08'); // Sunday October 8, 2023

function getNbWeeks(date1, date2) {
    const timeDifference = Math.abs(date1.getTime() - date2.getTime());

    // Convert the time difference to weeks (1 week = 7 days)
    const weeksDifference = timeDifference / (7 * 24 * 60 * 60 * 1000);

    return Math.floor(weeksDifference);
}

function iterate_test() {
    const startDate = ref;
    const endDate = new Date(ref.getTime()).setFullYear(ref.getFullYear() + 1);

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        if (currentDate.getDay() === 0) {
            console.log(); 
        }
        console.log(currentDate.toDateString(), isSpecialWeek(currentDate) || isSpecialDay(currentDate) ? "<---" : "");
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }
}


function isSpecialWeek(day) {

    const d = new Date(day.getTime());

    const firstDayOfTheWeek = new Date(
        d.setDate(d.getDate() - d.getDay()),
    );

    // interval in milliseconds for 4 weeks
    const intervalInMilliseconds = 4 * 7 * 24 * 60 * 60 * 1000;

    const timeDifference = firstDayOfTheWeek - ref;

    return timeDifference % intervalInMilliseconds < 24 * 60 * 60 * 1000

}

function isSpecialDay(today) {

    const nb = getNbWeeks(today, ref)
    const day = today.getDay()
    // Sunday or saturday
    return day == 0 && nb % 8 >= 4 || day == 6 && nb % 8 < 4;

}


function format(data) {
    const txt = `# ${data.title} 
### Picture of the Day - NASA - ${new Date().toLocaleDateString()}
<img src="${data.url}" alt="nasa picture of the day" width="300"/>`
    fs.writeFileSync('README.md', txt)

}


// Update the readme on special days
function main() {
    const today = new Date();

    if (!isSpecialDay(today) && !isSpecialWeek(today)) {
        return console.log('not a special day')
    }

    axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`)
        .then(response => format(response.data))
        .catch(error => {
            console.log(error);
            //fallback
            format({
                title: "Edwin Hubble Discovers the Universe",
                url: "https://apod.nasa.gov/apod/image/2004/HubbleVarOrig_Carnegie_960.jpg"
            })
        });
};

main()