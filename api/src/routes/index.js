const { Router } = require('express');
const pokemonRouter = require('./pokemonRoutes')
const typeRouter = require('./typeRoutes')

const router = Router();

router.use('/pokemons', pokemonRouter)
router.use('/types', typeRouter)


module.exports = router;
