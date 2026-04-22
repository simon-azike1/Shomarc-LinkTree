const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/shomarc';

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const linkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String, default: 'link' },
  message: { type: String, default: '' },
  order: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 }
});

const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Shomarc' },
  bio: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  links: [linkSchema]
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

app.get('/api/profile', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile({ name: 'Shomarc', links: [] });
      await profile.save();
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/profile', async (req, res) => {
  try {
    const { name, bio, avatarUrl } = req.body;
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile({ name: name || 'Shomarc', bio: bio || '', avatarUrl: avatarUrl || '', links: [] });
      await profile.save();
    } else {
      if (name !== undefined) profile.name = name;
      if (bio !== undefined) profile.bio = bio;
      if (avatarUrl !== undefined) profile.avatarUrl = avatarUrl;
      await profile.save();
    }
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/profile', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile(req.body);
    } else {
      const { name, bio, avatarUrl } = req.body;
      if (name !== undefined) profile.name = name;
      if (bio !== undefined) profile.bio = bio;
      if (avatarUrl !== undefined) profile.avatarUrl = avatarUrl;
    }
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/links', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile({ links: [] });
    }
    const maxOrder = profile.links.reduce((max, link) => Math.max(max, link.order), -1);
    const { title, url, icon, message } = req.body;
    const newLink = { 
      title, 
      url, 
      icon: icon || 'link',
      message: message || '',
      order: maxOrder + 1, 
      clicks: 0 
    };
    profile.links.push(newLink);
    await profile.save();
    res.status(201).json(profile.links[profile.links.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/links/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, icon, order, message } = req.body;
    let profile = await Profile.findOne({ 'links._id': id });
    if (!profile) {
      return res.status(404).json({ message: 'Link not found' });
    }
    const link = profile.links.id(id);
    if (title !== undefined) link.title = title;
    if (url !== undefined) link.url = url;
    if (icon !== undefined) link.icon = icon;
    if (order !== undefined) link.order = order;
    if (message !== undefined) link.message = message;
    await profile.save();
    res.json(link);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/links/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let profile = await Profile.findOne({ 'links._id': id });
    if (!profile) {
      return res.status(404).json({ message: 'Link not found' });
    }
    profile.links.pull(id);
    await profile.save();
    res.json({ message: 'Link deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/redirect/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let profile = await Profile.findOne({ 'links._id': id });
    if (!profile) {
      return res.status(404).json({ message: 'Link not found' });
    }
    const link = profile.links.id(id);
    link.clicks += 1;
    await profile.save();
    res.redirect(link.url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/links/reorder', async (req, res) => {
  try {
    const { links } = req.body;
    let profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    for (const linkUpdate of links) {
      const link = profile.links.id(linkUpdate._id);
      if (link) {
        link.order = linkUpdate.order;
      }
    }
    await profile.save();
    res.json(profile.links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});