// Load Packages
const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

// Create object to hold each company we will pull listings from *will use this down the road
//const employers = [
//    {
//        name: '',
//        address: '',
//        base: ''
//    }
//]

// Array for holding the job postings

const postings = []

// Homepage greeting for local host 

app.get('/', (req, res) => {
    res.json('Welcome to the Data Analyst Job Postings API')
})


// Page where jobs will be listed

app.get('/jobs', (req, res) => {
    // res.json(postings)
    axios.get('https://jobs.memorialhermann.org/search-jobs/analyst?orgIds=5358&kt=1')
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            // Getting every a-tag containing 'Analyst'
            $('a:contains("Analyst")', html).each(function () {
                const job_title = $(this).children('h2').text()     //Job titles are in an h2-tag nested in the a-tag
                const url = 'https://jobs.memorialhermann.org/' + $(this).attr('href')

                postings.push({
                    job_title: job_title,
                    url: url,
                    // source: company.name
                }) 
            })
            res.json(postings)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
