const express = require('express')
const router = require('express').Router()
const yaml = require('yamljs')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const appRoot = path.join(__dirname, "./.")
const { base64encode, base64decode } = require('nodejs-base64')

const swaggerUI = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerSpec = swaggerJSDoc({
    swaggerDefinition: yaml.load(path.join(appRoot, './routes/yaml/swagger.yaml')),
    apis: [
        path.join(appRoot, './routes/yaml/register.yaml'),
        path.join(appRoot, './routes/yaml/report.yaml')
    ]
})

const app = express()
const port = 8080

// middleware function
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

app.listen(port, () => {
    console.log("Start Rest Api Test Server Listening...")
})