const { Router } = require('express');
const {getPokemonsHandler, getPokemonIdHandler, postPokemonHandler} = require('../Handlers/pokemonHandlers')
const pokemonRouter = Router();

pokemonRouter.get('/', getPokemonsHandler)
pokemonRouter.get('/:id', getPokemonIdHandler)
pokemonRouter.post('/', postPokemonHandler)

module.exports = pokemonRouter
