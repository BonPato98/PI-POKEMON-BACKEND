const axios = require('axios')
const {getPokemonDb, getPokemonById, createPokemonDb} = require('../Controllers/pokemonController')

const getPokemonsHandler = async (req, res) => {
    const {name} = req.query
        try {
            if (name) {
                const nameLowerCase = name.toLowerCase()
                try {
                    // ------> caso DB
                    const pokemonDb = await getPokemonDb(nameLowerCase)
                    if (pokemonDb){
                        return res.status(200).json(pokemonDb)
                    }
                    // ------> caso API
                    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nameLowerCase}`)
                    const pokemon = response.data
                    if (pokemon) {
                            const {id, sprites, height, weight, stats, types} = pokemon
                            const pokemonData = {
                                id,
                                name: nameLowerCase,
                                image: sprites.front_default,
                                hp: stats[0].base_stat,
                                attack: stats[1].base_stat,
                                defense: stats[2].base_stat,
                                speed: stats[5].base_stat,
                                height,
                                weight,
                                types: types.map(t => t.type.name)
                            }
                            return res.status(200).send(pokemonData)
                    }
                } catch (error) {
                    return res.status(404).send('Pokemon no existe')
                }
            }


            //----------------------------------------------------------GET ALL------------------------------------//
            const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151')
            const pokemonsApi = await Promise.all (response.data.results.map(async p => {
                const info = await axios.get(p.url)
                const {id, name, sprites, height, weight, stats, types} = info.data
                return {
                    id,
                    name,
                    image: sprites.front_default,
                    hp: stats[0].base_stat,
                    attack: stats[1].base_stat,
                    defense: stats[2].base_stat,
                    speed: stats[5].base_stat,
                    height,
                    weight,
                    types: types.map(t => t.type.name)
                }
            }))
            const pokemonDb = await getPokemonDb()
            const allPokemons = [...pokemonsApi, ...pokemonDb]
            res.status(200).send(allPokemons)
        } catch (error) {
            res.status(400).send('error')
        }
}

const getPokemonIdHandler = async (req, res) => {
    const {id} = req.params
        // -----> caso API
        if (id <= 151) {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
                const pokemon = response.data
                    const { name, sprites, height, weight, stats, types} = pokemon
                    const pokemonData = {
                        id,
                        name,
                        image: sprites.front_default,
                        hp: stats[0].base_stat,
                        attack: stats[1].base_stat,
                        defense: stats[2].base_stat,
                        speed: stats[5].base_stat,
                        height,
                        weight,
                        types: types.map(t => t.type.name)
                    }
               return res.status(200).send(pokemonData)
            } catch (error) {
                return res.status(400).send("msg:", error.message)
            }
        }
        try {
            const response = await getPokemonById(id)
            res.status(200).json(response)
        } catch (error) {
            res.status(404).send('El pokemon que estas buscando no existe o no se encuentra en nuestro rango de busqueda')
        }
} 

const postPokemonHandler = async (req, res) => {
    console.log("body", req.body);
    const {name, image, hp, attack, defense, types} = req.body
    let {speed, height, weight} = req.body
    const nameLowerCase = name.toLowerCase()
    if (speed === "") {
        speed = null
    }
    if (height === "") {
        height = null
    }
    if (weight === "") {
        weight = null
    }
    try {
        const response = await createPokemonDb(nameLowerCase, image, hp, attack, defense, speed, height, weight, types)
        res.status(201).json(response)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
}

module.exports = {
    getPokemonsHandler,
    getPokemonIdHandler,
    postPokemonHandler
}