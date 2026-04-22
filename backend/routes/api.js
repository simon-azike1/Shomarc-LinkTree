const express = require('express');
const router = express.Router();
const {
  getUser,
  updateUser,
  createUser,
  addLink,
  updateLink,
  deleteLink,
  redirectLink,
  reorderLinks
} = require('../controllers/userController');
const User = require('../model/User');

router.get('/user/:username', getUser);
router.put('/user/:username', updateUser);
router.post('/user', createUser);

router.post('/links/:username', addLink);
router.put('/links/:id', updateLink);
router.delete('/links/:id', deleteLink);
router.put('/links/reorder/:username', reorderLinks);

router.get('/redirect/:linkId', redirectLink);

router.post('/seed-demo', async (req, res) => {
  try {
    const existingDemo = await User.findOne({ username: 'demo' });
    if (existingDemo) {
      return res.json(existingDemo);
    }
    const demoUser = new User({
      username: 'demo',
      displayName: 'Demo Profile',
      bio: 'This is a demo profile to showcase what your page could look like. Create your own!',
      avatarUrl: '',
      links: [
        { title: 'My Website', url: 'https://example.com', order: 0, clicks: 0 },
        { title: 'Instagram', url: 'https://instagram.com', order: 1, clicks: 0 },
        { title: 'Twitter', url: 'https://twitter.com', order: 2, clicks: 0 },
        { title: 'YouTube', url: 'https://youtube.com', order: 3, clicks: 0 }
      ]
    });
    await demoUser.save();
    res.status(201).json(demoUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;