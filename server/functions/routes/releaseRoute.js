const express = require('express')
const router = express.Router()

const controller = require('../controllers/releaseController')

router.get('/', controller.read)
router.get('/:releaseId', controller.readById)
router.get('/repo/:repo', controller.readByRepo)
router.get('/author/:author', controller.readByAuthor)
router.post('/', controller.post)

module.exports = router
