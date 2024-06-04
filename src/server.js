const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const userRoutes = require('./routes/userRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Handle 404 - Not Found
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'Resource not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
