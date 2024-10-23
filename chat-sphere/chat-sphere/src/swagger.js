const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'ChatSphere API',
      version: '1.1.0',
      description: 'Enhanced API for ChatSphere',
    },
    servers: [
      {
        url: 'https://virtserver.swaggerhub.com/YINKAWLB/chatterbox1/1.0.0',
      },
      {
        url: 'https://your-api-server.com/api',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to your API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

