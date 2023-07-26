const axios = require('axios')
const {saveTypesDb, getTypesDb} = require('../Controllers/typeController')

const getTypes = async (req, res) => {
    const types = await getTypesDb()
    if (types.length > 0) {
        return res.status(200).send(types)
    }
    try {
        const response = await axios.get('https://pokeapi.co/api/v2/type')
        const typesApi = await Promise.all(response.data.results.map(t => t.name))
        await saveTypesDb(typesApi)
        res.status(200).send('Tipos guardados en la base de datos')
    } catch (error) {
        res.status(400).send('msg:', error.msg)
    }
}

module.exports = {
    getTypes
}