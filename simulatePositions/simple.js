let {
    features
} = require('./curvaSobrePyxis')
const https = require('http')

let position = {
    "altitude_gps": 30,
    "location": {
        "type": "Point",
        "coordinates": [
            -56.1636114120483,
            -34.9068218410793
        ]
    },
    "time_sent": "2019-12-11T19:59:10.000Z",
    "gufi": "b92c7431-13c4-4c6c-9b4a-1c3c8eec8c63"
}

for (let index = 0; index < features.length; index++) {
    const element = features[index];
    position.location = element.geometry
    sendPostion(position)
}

let index = 0;
setInterval(function(){
    const element = features[index];
    position.location = element.geometry
    console.log(`Enviando ${index}:: ${JSON.stringify(position)}`)
    sendPostion(position)
    index = ( index + 1 ) % features.length
    
    }, 1000);

function sendPostion(position) {

    const data = JSON.stringify(position)

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/position',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

    const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', (d) => {
            process.stdout.write(d)
        })
    })

    req.on('error', (error) => {
        console.error(error)
    })

    req.write(data)
    req.end()

}