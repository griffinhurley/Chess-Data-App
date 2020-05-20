var express = require('express')
var router = express.Router()
var pool = require('./db')

//for getting data from existing user
router.get('/api/get/datafromusername', (req, res) => {
    const username = req.query.username
    console.log('username: ', req.query)
    pool.query('SELECT * FROM userdata WHERE username=$1', [username], (err, result) => {
        if (err) {
            
            console.log('get-error', err)
            throw err
        } else {
            console.log('get-result', result)
            res.send(result.rows.length > 0 ? [result.rows[0].chartdata, result.rows[0].results] : [{'white':[], 'black':[]}, {'white':[], 'black':[]}])
    }})
})
//for putting new user into database
router.post('/api/post/data', (req, res) => {
    const values = [req.body.username, req.body.chartdata, req.body.results]
    console.log('posting: ', req.body)
    pool.query('INSERT INTO userdata (username, chartdata, results, modified) VALUES($1, $2, $3, NOW())', values, (err, result) => {
        if (err) {
            console.log('post-error', err)
            //throw err
        } else {
        return res.send(result)
    }})
})

module.exports = router