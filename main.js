const express = require('express');
const Ant = require('ant-plus');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, { origins: '*:*'});
const PORT = process.env.PORT || 1242;

const timeout = 10;
let deviceId = 40725;
let deviceCounts = {};
let deviceBeat = {};
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
    if (!deviceCounts[did]) deviceCounts[did] = data.BeatCount;
    else if (deviceCounts[did] != data.BeatCount) {
        deviceCounts[did] = data.BeatCount;
        io.emit('beats', data.DeviceID, data.ComputedHeartRate);
        deviceBeat[did] = data.ComputedHeartRate;
    }
    timeoutCount = timeout;
});


stick.on('startup', () => {
    console.log('Stick startup');
    sensor.attach(0, deviceId);
});

stick.on('shutdown', () => {
    console.log('Stick shutdown');
});

sensor.on('attached', () => {
    timeoutCount = timeout;
});

sensor.on('detached', () => {
    timeoutCount = timeout;
    
    try {
        sensor.attach(0, deviceId);
        
    } catch(e) {
        console.log(e);
        
    }
});

if(!stick.is_present()) console.log('Stick not found!');
if(!stick.open()) console.log('Stick open failed!');

let timeoutCheckLoop = setInterval(() => {
    console.clear();
    console.log('count:', JSON.stringify(deviceCounts));
    console.log('beat:', JSON.stringify(deviceBeat));
    console.log('timeout:', timeoutCount);
    
    timeoutCount--;
    if (timeoutCount <= 0) {
        process.exit();
    }

}, 1000);