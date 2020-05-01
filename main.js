const express = require('express');
const Ant = require('ant-plus');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 1242;

const timeout = 7;
let devices = {};
let timeoutCount = timeout;
let stick = new Ant.GarminStick2;
let sensor = new Ant.HeartRateSensor(stick);

app.get('/', (req, res) => { res.sendFile(__dirname + '/index.html') });
http.listen(PORT, () => { console.log('server listening. Port:' + PORT) });

io.on('connection', (socket) => {
    socket.on('start', (id) => {
        // 
    });
});

sensor.on('hbData', data => {
    let did = 'id' + data.DeviceID;
    if (!devices[did]) devices[did] = data.BeatCount;
    else if (devices[did] != data.BeatCount) {
        devices[did] = data.BeatCount;
        io.emit('beats', data.DeviceID, data.ComputedHeartRate);
        //process.stdout.write(',' + data.ComputedHeartRate)
        //console.dir(data);
    }
    timeoutCount = timeout;
});

stick.on('startup', () => {
    console.log('Stick startup');
    sensor.attach(0, 0);
});

stick.on('shutdown', () => {
    console.log('Stick shutdown');
});

sensor.on('attached', () => {
    console.log('device1 / attached');
    timeoutCount = timeout;
});

sensor.on('detached', () => {
    console.log('device1 / detached');
    timeoutCount = timeout;
    
    try {
        sensor.attach(0, 0);
        
    } catch(e) {
        console.log(e);
        
    }
});

if(!stick.is_present()) console.log('Stick not found!');
if(!stick.open()) console.log('Stick open failed!');

let timeoutCheckLoop = setInterval(() => {
    console.clear();
    console.dir(devices);
    
    timeoutCount--;
    if (timeoutCount <= 0) {
        timeoutCount = timeout;
        console.log('timeout? re-attach...');
        
        try {
            sensor.detach();
            //sensor.attach(0, 0);
        } catch(e) {
            
        }
    }

}, 1000);