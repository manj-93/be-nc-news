const db = require ("../db/connection")

exports.fetchTopics = () => {
    return db.query(`SELECT slug, description FROM topics;`)
    .then(({rows})=>{
        return rows;
    })
}