const { Router } = require('express');
const {getTypes} = require('../Handlers/typeHandlers')

const typeRouter = Router();

typeRouter.get('/', getTypes)

module.exports = typeRouter