const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // Assuming you've generated swagger.json

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api', require('./routes'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
