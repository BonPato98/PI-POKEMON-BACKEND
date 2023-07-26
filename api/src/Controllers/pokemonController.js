const {Pokemon, Type } = require('../db')

const getPokemonDb = async (name) => {
    if (name) {
       const pokemonName = await Pokemon.findOne({
        where: {name},
        include: {
            model: Type,
            attribute: "name",
            through: { attributes: [] }
        }
    })
       return pokemonName
    }
    const allPokemon = await Pokemon.findAll({
        include: {
            model: Type,
            through: { attributes: [] }
        }
    })

    const modified = await Promise.all(allPokemon.map( async p => {
        const types = []
        await p.types.forEach(type => {
            types.push(type.dataValues.name)
        })
        const newTypes = {...p.dataValues, types:types}
        return newTypes
    }))
    
    return modified
}

const getPokemonById = async (id) => {
    const pokemonId = await Pokemon.findOne({
        where: {id},
        include: {
            model: Type,
            attribute: "name",
            through: { attributes: [] }
        }})
    return pokemonId
}

const createPokemonDb = async (name, image, hp, attack, defense, speed, height, weight, types) => {
    const nameLowerCase = name.toLowerCase()
    const newPokemon = await Pokemon.create({
        name: nameLowerCase,
        image,
        hp,
        attack,
        defense,
        speed,
        height,
        weight,
    })
    const typesId = await Promise.all(types.map(async name => {
        const foundType = await (Type.findOne({
            where: {name}
        }))
        const typeId = foundType.dataValues.id
        return typeId;
    }))
    newPokemon.addTypes(typesId)
    return newPokemon
}

module.exports = {
    getPokemonDb,
    getPokemonById,
    createPokemonDb
}