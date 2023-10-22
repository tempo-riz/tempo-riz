require('dotenv').config()
const axios = require('axios');
const fs = require('fs');


const ref = new Date('2023-10-08'); // Sunday October 8, 2023
const SEPARATOR = '&nbsp; &nbsp; &nbsp; ' // 3 nb spaces, and the reference to splitting the file
const F = 'README.md'

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


function updateNasaImg(data) {

    const content = fs.readFileSync(F, 'utf8')
    const split = content.split(SEPARATOR)


    const nasa = `# ${data.title}\n### Picture of the Day - NASA - ${new Date().toLocaleDateString('en-GB')}\n<img src="${data.url}" alt="nasa picture of the day" width="300"/>`

    const newContent = nasa + SEPARATOR + split[1];

    fs.writeFileSync(F, newContent)

}

function updateStatTheme() {

    const themes = ['dark', 'radical', 'merko', 'gruvbox', 'tokyonight', 'onedark', 'cobalt', 'synthwave', 'highcontrast', 'dracula'];

    // get current theme
    const content = fs.readFileSync(F, 'utf8')
    const split = content.split("&theme=")[1] //[..., highcontrast" >]
    const currentTheme = split.split('" ')[0] // highcontrast

    // remove current theme from array (to avoid getting the same theme twice in a row and missing a day)
    themes.splice(themes.indexOf(currentTheme), 1);
    // get new theme
    const theme = themes[Math.floor(Math.random() * themes.length)];

    const newContent = content.replace(`&theme=${currentTheme}`, `&theme=${theme}`);

    fs.writeFileSync(F, newContent)
}


function updatePictureOfTheDay() {
    axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`)
        .then(response => updateNasaImg(response.data))
        .catch(error => {
            console.log(error);
            //fallback
            updateNasaImg({
                title: "Edwin Hubble Discovers the Universe",
                url: "https://apod.nasa.gov/apod/image/2004/HubbleVarOrig_Carnegie_960.jpg"
            })
        });
}

function main() {
    updatePictureOfTheDay();
    updateStatTheme();
    // const today = new Date();

    // if (today.getHours() < 12) {
    //     // update only image of the day every morning
    //     return updatePictureOfTheDay();
    // }

    // if (!isSpecialDay(today) && !isSpecialWeek(today)) {
    //     return console.log('not a special day');
    // }
    // // on special days afternoon update the stats (changing the theme) 
    // return updateStatTheme();

};

main()