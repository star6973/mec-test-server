const express = require('express')
const yaml = require('yamljs')
const path = require('path')
const fs = require('fs')
const appRoot = path.join(__dirname, "./.")
const { base64encode, base64decode } = require('nodejs-base64')

const swaggerUI = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')
const { report } = require('process')
const swaggerSpec = swaggerJSDoc({
    swaggerDefinition: yaml.load(path.join(appRoot, 'routes/yaml/swagger.yaml')),
    apis: [
        path.join(appRoot, 'routes/yaml/register.yaml'),
        path.join(appRoot, 'routes/yaml/report.yaml')
    ]
})

const app = express()
const port = 5000

// middleware function
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

app.listen(port, () => {
    console.log("Start Rest Api Test Server Listening...")
})

app.post('/restapi/robot/v1/regiter', (req, res) => {
    // 위의 URI로 데이터 보내주기
    let register_json = fs.readFileSync(path.join(appRoot, 'routes/json/register_success.json'))
    let register_data = base64encode(JSON.stringify(JSON.parse(register_json)))

    res.setHeader('Content-Type', 'application/json;charset=utf-8')
    res.send(register_data)
})

app.post('/restapi/robot/v1/report', (req, res) => {
    let report_json = fs.readFileSync(path.join(appRoot, 'routes/json/report_success.json'))
    let report_data = base64encode(JSON.stringify(JSON.parse(report_json)))

    res.setHeader('Content-Type', 'application/json;charset=utf-8')
    res.send(report_data)
})