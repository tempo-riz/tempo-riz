require('dotenv').config()
const axios = require('axios');
const fs = require('fs');



axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`)
    .then(response => format(response.data))
    .catch(error => {
        console.log(error);
        // read backup.md and write to README.md
        const str = fs.readFileSync('backup.md');
        fs.writeFileSync('README.md', str)

    });

function format(data) {
    const txt = `# ${data.title} - NASA Picture of the Day
<img src="${data.url}" alt="nasa picture of the day" width="300"/>

readme updated at ${new Date().toLocaleString()}
`
    fs.writeFileSync('README.md', txt)

}
