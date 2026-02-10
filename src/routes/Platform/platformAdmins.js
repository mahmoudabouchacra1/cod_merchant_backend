const createCrudRouter = require('../crudRouter');
const platformAdminsController = require('../../controllers/Platform/platformAdminsController');
const { uploadMemory } = require('../../utils/upload');

const router = createCrudRouter(platformAdminsController);
router.post('/:id/photo', uploadMemory.single('photo'), platformAdminsController.uploadPhoto);

module.exports = router;
