const swaggerAutogen = require('swagger-autogen')()


const doc = {
    info: {
      title: 'TDM project API',
      description: 'This api is developed for our mobile development project - Cars renting app -\nYou can test our api endpoints\nFor more information visite our github repository: https://github.com/imadbourouche/tdm_server',
      version: '2.0.0',
    },
    host: 'localhost:8082',
    schemes: ['http'],
    
  };

const outputFile = './swagger_output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles,doc)
.then(()=>{
    require('./index')
})
