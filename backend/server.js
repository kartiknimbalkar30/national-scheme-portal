
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const schemeRoutes = require('./routes/schemes');
const savedRoutes = require('./routes/saved');
const adminRoutes = require('./routes/admin');
const feedbackRoutes = require('./routes/feedback');
const notificationRoutes = require('./routes/notifications');
const recentlyViewedRoutes = require('./routes/recentlyViewed');
const ratingsRoutes = require('./routes/ratings');
const assistantRoutes = require('./routes/assistant');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/recently-viewed', recentlyViewedRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/assistant', assistantRoutes);

// Test Route
app.get('/', (req, res) => {
    res.json({ message: 'Government Scheme Portal API Running!' });
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
