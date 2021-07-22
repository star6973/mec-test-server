const express = require('express')
const yaml = require('yamljs')
const path = require('path')
const fs = require('fs')
const appRoot = path.join(__dirname, "./.")
const { base64encode, base64decode } = require('nodejs-base64')

const swaggerUI = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')
const { response } = require('express')
const swaggerSpec = swaggerJSDoc({
    swaggerDefinition: yaml.load(path.join(appRoot, 'routes/yaml/swagger_api.yaml')),
    apis: [
        path.join(appRoot, 'routes/yaml/register_api.yaml'),
        path.join(appRoot, 'routes/yaml/schedule_api.yaml')
    ]
})

const app = express()
const port = 5000

let robot_id = "SeRo01"
let terminal_id = "P03"
let zone_id = "1"
let service_mode = "2"

// middleware function
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

app.listen(port, () => {
    console.log("Start Rest Api Test Server Listening...")
})

app.post('/restapi/robot/v1/regiter', (req, res) => {
    let request_register_json = JSON.parse(JSON.stringify(req.body))

    robot_id = request_register_json.register.id
    terminal_id = request_register_json.register.terminal
    zone_id = request_register_json.register.zone
    service_mode = request_register_json.register.sort

    // 위의 URI로 데이터 보내주기
    let register_json = fs.readFileSync(path.join(appRoot, 'routes/json/register_success.json'))
    let register_data = base64encode(JSON.stringify(JSON.parse(register_json)))

    res.setHeader('Content-Type', 'application/json;charset=utf-8')
    res.send(register_data)
})

app.post('/restapi/robot/v1/schedule', (req, res) => {
    let today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1)

    let format_today = `${today.getFullYear().toString()}/${today.getMonth().toString().padStart(2, "0")}/${today.getDate().toString().padStart(2, "0")}`
    let format_tomorrow = tomorrow.getFullYear().toString() + "/" + tomorrow.getMonth().toString().padStart(2, "0") + "/" + tomorrow.getDate().toString().padStart(2, "0")

    let response_schedule_json = JSON.parse(fs.readFileSync(path.join(appRoot, 'routes/json/schedule_success.json')))
    response_schedule_json.cmd.forEach((item) => {
        [start_ymd, start_time] = item.starttime.split(" ")
        [start_y, start_m, start_d] = start_ymd.split("/")
        [end_ymd, end_time] = item.endtime.split(" ")

        // starttime 연도가 1900으로 설정되어 있다면, 오늘 날짜로 변경해주기
        if (start_y === "1900") {
            item.starttime = `${format_today} ${start_time}`
            item.endtime = `${format_today} ${end_timd}`

            // endtime이 starttime보다 작다면 endtime을 내일 날짜로 변경해주기
            // javascript에서는 두 날짜를 비교연산자를 통해 즉시 비교 가능함.
            if (start_time > end_time) {
                item.endtime = `${format_tomorrow} ${end_time}`
            }
        }

        item.mode = service_mode
    })

    response_schedule_json.id = robot_id
    response_schedule_json.time = `${today.getFullYear().toString()}/${today.getMonth().toString().padStart(2, "0")}/${today.getDate().toString().padStart(2, "0")} ${today.getHours().toString().padStart(2, "0")}:${today.getMinutes().toString().padStart(2, "0")}:${today.getSeconds().toString().padStart(2, "0")}`
    response_schedule_json = JSON.stringify(response_schedule_json)

    res.setHeader('Content-Type', 'application/json;charset=utf-8')
    res.send(response_schedule_json)
})

app.post()