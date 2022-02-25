const db = require('../../data/dbConfig')

async function add(user) {
    const [id] = await db('users').insert(user)
    return getUser(id)
}

function getUser(id) {
    return db('users')
        .where({ id })
        .first()
}
function getUsername(username) {
    return db('users')
        .where('username', username)
        .first()
}
module.exports = {
    add,
    getUser,
    getUsername,
}