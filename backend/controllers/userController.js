const User = require('../model/User');

const getUser = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username } = req.params;
    const { displayName, bio, avatarUrl } = req.body;
    
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (displayName !== undefined) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, displayName, bio, avatarUrl } = req.body;
    
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    const user = new User({
      username: username.toLowerCase(),
      displayName: displayName || '',
      bio: bio || '',
      avatarUrl: avatarUrl || '',
      links: []
    });
    
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addLink = async (req, res) => {
  try {
    const { username } = req.params;
    const { title, url, icon, message } = req.body;
    
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const maxOrder = user.links.reduce((max, link) => Math.max(max, link.order), -1);
    
    const newLink = {
      title,
      url,
      icon: icon || 'link',
      message: message || '',
      order: maxOrder + 1,
      clicks: 0
    };
    
    user.links.push(newLink);
    await user.save();
    
    res.status(201).json(user.links[user.links.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, icon, order, message } = req.body;
    
    const user = await User.findOne({ 'links._id': id });
    
    if (!user) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    const link = user.links.id(id);
    
    if (title !== undefined) link.title = title;
    if (url !== undefined) link.url = url;
    if (icon !== undefined) link.icon = icon;
    if (order !== undefined) link.order = order;
    if (message !== undefined) link.message = message;
    
    await user.save();
    res.json(link);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLink = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findOne({ 'links._id': id });
    
    if (!user) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    user.links.pull(id);
    await user.save();
    
    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const redirectLink = async (req, res) => {
  try {
    const { linkId } = req.params;
    
    const user = await User.findOne({ 'links._id': linkId });
    
    if (!user) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    const link = user.links.id(linkId);
    link.clicks += 1;
    await user.save();
    
    res.redirect(link.url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reorderLinks = async (req, res) => {
  try {
    const { username } = req.params;
    const { links } = req.body;
    
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    for (const linkUpdate of links) {
      const link = user.links.id(linkUpdate._id);
      if (link) {
        link.order = linkUpdate.order;
      }
    }
    
    await user.save();
    res.json(user.links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUser,
  updateUser,
  createUser,
  addLink,
  updateLink,
  deleteLink,
  redirectLink,
  reorderLinks
};