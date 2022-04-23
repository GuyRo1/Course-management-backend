const Professor = require('../models/professor')

async function checkProf(req, res, next) {
    res.send({ status: 200, user: req.professor.sendOutData() })
}

async function loginProf(req, res, next) {
    try {

        if (!req.body.username || !req.body.password) throw {}
        const { professor, token } = await Professor.login(req.body.username, req.body.password)
        if (!token) throw new Error('')
        res.send({ status: 200, user: professor.sendOutData(), token: token })
    } catch (err) {
        next({ status: 400, message: "could not log in" })
    }

}

const changePassword = async (req, res, next) => {
    try {
        const passMatch = await req.professor.checkPass(req.body.password)
        if (!passMatch) throw "could'nt change password"
        req.professor.password = req.body.newPassword
        await req.professor.save()
        res.send({ message: "password was changed successfully" })
    } catch (err) {
        next(err)
    }
}

const changeMyData = async (req, res, next) => {
    try {

        if (req.body.userId === req.professor.id) {
            req.professor.username = req.body.username
            req.professor.email = req.body.email
            req.professor.firstname = req.body.firstname
            req.professor.lastname = req.body.lastname
            await req.professor.save()
            res.send({ user: req.professor.sendOutData() })
        } else {
            throw new Error()
        }

    } catch (err) {
        next(err)
    }
}


module.exports = { changeMyData, changePassword, checkProf, loginProf }