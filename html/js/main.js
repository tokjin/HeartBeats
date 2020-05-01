wsUri = 'http://localhost:1242';
socketio = io(wsUri);
socketio.on('beats', (DeviceID, ComputedHeartRate) => {
    console.log(DeviceID, ComputedHeartRate);
    if(id == DeviceID) updateGraph(ComputedHeartRate);
    else if(!id) updateGraph(ComputedHeartRate);
});

let updateGraph = (beat) => {
    console.log(data.length);
    if(data.length > 500) {
        data = data.slice(data.length - 100, data.length);
        chart.updateSeries([{data: data}])
    }
    
    data.push({
        x: new Date().getTime(),
        y: beat
    })
    
    lastBeat = beat;
    document.querySelector('#text').textContent = beat;
    if(beat >= 100) $('#text').css('color','#FF3333');
    else $('#text').css('color','#FFFFFF');
    
    if(!noChartMode) chart.updateSeries([{data: data}])
}

let getParam = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    let results = regex.exec(url);
    if(!results) return null;
    if(!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

let beatMotion = (beat) => {
    if(!beat) beat = 60;
    let loopTime = (60/beat)*1000;
    
    $('#heartImage').animate({opacity: 0.5}, 100, 'swing', function(){
        $('#heartImage').animate({opacity: 0.9}, 100, 'swing');
    });
    
    beatMotionLoop = setInterval(function(){
        $('#heartImage').animate({opacity: 0.5}, 100, 'swing', function(){
            $('#heartImage').animate({opacity: 0.9}, 100, 'swing');
        });
        //$('#heartImage').fadeOut(50,function(){ $(this).fadeIn(50) });
    }, loopTime);
}

// Main
let lastDate = 0;
let data = []
let chart, beatMotionLoop, lastBeat, noChartMode, noHeartImgMode;
let chartColor = getParam('chartColor') || 'ff3100';
let id = getParam('id') || 0;
if(getParam('noChart') != null) noChartMode = true;
if(getParam('noHeart') != null) noHeartImgMode = true;

let options = {
    series: [{data: data.slice()}],
    chart: {
        id: 'realtime',
        height: 270,
        type: 'line', // line or area
        animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: { speed: 800 }
        },
        toolbar: { show: false },
        zoom: { enabled: false }
    },
    colors:['#'+chartColor],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    title: {
        //text: 'Dynamic Updating Chart',
        align: 'left'
    },
    markers: { size: 0 },
    xaxis: {
        type: 'datetime',
        range: 1000*30, // 15sec
    },
//    yaxis: { max: 230 },
    legend: { show: false },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        width: 10,
        dashArray: 0,      
    }
}

if(!noChartMode){
    chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
}

window.setInterval(() => {
//    updateGraph(Math.floor( Math.random() * 150 ))
//    chart.updateSeries([{data: data}])
    clearInterval(beatMotionLoop);
    if(!noHeartImgMode) beatMotion(lastBeat);
}, 3000)

