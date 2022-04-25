// Load Packages
const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()


const jobPostings = []

// Homepage greeting for local host 
app.get('/', (req, res) => {
    res.json('Welcome to the Data Analyst Job Postings API')
})


// Job postings landing page
app.get('/jobs', (req, res) => {
    axios.get('https://jobs.memorialhermann.org/search-jobs/analyst?orgIds=5358&kt=1')
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            // Grabbing every a-tag containing 'Analyst'
            $('a:contains("Analyst")', html).each(function () {
                const jobTitle = $(this).children('h2').text()     //Job titles are in an h2-tag nested in the a-tag
                const url = 'https://jobs.memorialhermann.org/' + $(this).attr('href')

                jobPostings.push({
                    Job Title: jobTitle,
                    URL: url,
                    // source: company.name
                }) 
            })
            res.json(jobPostings)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
