let getParam = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    let results = regex.exec(url);
    if(!results) return null;
    if(!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

let id = getParam('id') || 0;
let lastBeat = 0;
let wsUri = 'http://localhost:1242';
let socketio = io(wsUri);

socketio.on('beats', (DeviceID, ComputedHeartRate) => {
    console.log(DeviceID, ComputedHeartRate);
    if(id != 0 && id == DeviceID) lastBeat = ComputedHeartRate;
    else if(!id) lastBeat = ComputedHeartRate;
});

let checkBeat = (beat) => {
    if(0 <= beat && beat <= 99){
        $("#backgroundArea").animate({opacity: 0}, {duration: 2000, easing: 'swing'});
        
    } else if(100 <= beat && beat <= 104){
        $("#backgroundArea").animate({opacity: 0.15}, {duration: 2000, easing: 'swing'});
        
    } else if(105 <= beat && beat <= 109){
        $("#backgroundArea").animate({opacity: 0.25}, {duration: 2000, easing: 'swing'});
        
    } else if(110 <= beat && beat <= 119){
        $("#backgroundArea").animate({opacity: 0.35}, {duration: 2000, easing: 'swing'});
        
    } else if(120 <= beat && beat <= 129){
        $("#backgroundArea").animate({opacity: 0.45}, {duration: 2000, easing: 'swing'});
        
    } else if(130 <= beat && beat <= 139){
        $("#backgroundArea").animate({opacity: 0.50}, {duration: 2000, easing: 'swing'});
        
    } else if(140 <= beat){
        $("#backgroundArea").animate({opacity: 0.55}, {duration: 2000, easing: 'swing'});
    }
}

window.setInterval(() => {
    checkBeat(lastBeat);
    
}, 3000)