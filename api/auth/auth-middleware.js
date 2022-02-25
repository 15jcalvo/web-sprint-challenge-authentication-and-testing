const db = require('../../data/dbConfig')

const validateUser = (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        next({ status: 401, message: 'username and password required'})
    } else {
        next()
    }
}

async function checkUsernameFree(req, res, next) {
    const nameCheck = await db('users').where('username', req.body.username).first()
    if (nameCheck) {
      next({ status: 422, message: 'username taken' })
    } else {
      next()
    }
  }

module.exports = {
    validateUser,
    checkUsernameFree,
}