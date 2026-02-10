const createCrudRouter = require('../crudRouter');
const usersController = require('../../controllers/Merchant/usersController');
const { uploadMemory } = require('../../utils/upload');

const router = createCrudRouter(usersController);
router.post('/:id/photo', uploadMemory.single('photo'), usersController.uploadPhoto);

module.exports = router;
