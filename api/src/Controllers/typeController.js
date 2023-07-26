const {Type} = require('../db')

const getTypesDb = async () => {
    const types = await Type.findAll()
    return types
}

const saveTypesDb = async (types) => {
    (types.forEach(t => {
        Type.create({
            name:t
        })
    }))
}


module.exports = {
    saveTypesDb,
    getTypesDb,
}