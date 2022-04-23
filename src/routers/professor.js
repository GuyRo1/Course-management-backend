const express = require('express')
const { professorAuth } = require('../middleware/authorization')
const { checkProf,changeMyData, changePassword, loginProf } = require('../controllers/professor')

const router = new express.Router()

router.post('/check', professorAuth, checkProf)

router.post('/login', loginProf)

router.patch('/me/pass', professorAuth, changePassword)

router.patch('/me', professorAuth, changeMyData)

router.post('', professorAuth, (req, res) => {
    res.send(req.params)
})

module.exports = router