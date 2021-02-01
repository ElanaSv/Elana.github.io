// mute/unmute camera
// mute/unmute mimcrophone
// hang up button 
// screenshare

// Final Deliverables --> build web app w unique use case 
// video chat feature
// login page
// submit final project URL and github repo link
// look at slides (2 before awards)
// hosted version of the url --> host code on github and copy and paste url --> they can access our project directly --> short presentation video
// run on chrome

let handleFail = function(err){
    console.log(err)
}
let appId = "2025521fc5d645f7b76a0402e2fd9cb7";
let globalStream;
let isAudioMuted = false;
let isVideoMuted = false;

let client = AgoraRTC.createClient({
    mode: "live", /* rtc is other option */
    codec: "h264"
})

client.init(appId,() => console.log("AgoraRTC Client Connected"),handleFail
)

function removeMyVideoStream() {
    globalStream.stop();
}
function removeVideoStream(evt) {
    let stream = evt.stream;
    stream.stop();
    let remDiv = document.getElementById(stream.getId());
    remDiv.parentNode.removeChild(remDiv);
}
function addVideoStream(streamId){
    let remoteContainer = document.getElementById("RemoteStream"); // remoteContainer
    let streamDiv = document.createElement("div"); // canvasContainer
    streamDiv.id = streamId;
    // streamDiv.style.transform = "rotateY(180deg)";
    streamDiv.style.display = "inline-block";
    streamDiv.style.height = "100px";
    streamDiv.style.width = "150px";
    streamDiv.style.margin = "auto 0px";
    streamDiv.style.textAlign = "left";
    remoteContainer.appendChild(streamDiv);
} 
document.getElementById("leave").onclick = function () {
    client.leave(function() {
        console.log("Left!")
     }, handleFail);
     removeMyVideoStream();
}
document.getElementById("join").onclick = function () {
    let channelName = document.getElementById("channelName").value;
    let Username = document.getElementById("username").value;
    let appId = "a328a68ba1c14bbea6f737dc228e8fa3";
    //initialize agora client
    client.join(
        null,
        channelName,
        Username,
        () =>{
            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
            })
            localStream.init(function(){
                // in here --> stream provides some functions to share screen ... // add a screen method ...
                localStream.play("SelfStream");
                console.log(`App id: ${appId}\nChannel id: ${channelName}`);
                client.publish(localStream, handleFail);
            })
            globalStream = localStream;
        }
    )
    client.on("stream-added", function(evt){
        console.log("Added Stream");
        client.subscribe(evt.stream,handleFail)
    })
    client.on("stream-subscribed", function(evt){
        console.log("Subscribed Stream");
        let stream = evt.stream;
        console.log("My stream id is: " + stream.getId())
        addVideoStream(stream.getId());  
        stream.play(stream.getId());
    })
    client.on("stream-removed", removeMyVideoStream)
    client.on("peer-leave", function(evt) {
        console.log("peer has left")
        removeVideoStream(evt)
    })
}
//  error here
document.getElementById("video-mute").onclick = function(evt) {
    let stream = evt.stream;
    if(!isVideoMuted){
        stream.muteVideo();
        isVideoMuted = true;
    } else {
        stream.unmuteVideo();
        isVideoMuted = false;
    }
}
document.getElementById("audio-mute").onclick = function(evt) {
    let stream = evt.stream;
    if(!isAudioMuted){
        stream.muteAudio();
        isVideoMuted = true;
    } else {
        stream.unmuteAudio();
        isVideoMuted = false;
    }
}

    //creating an even listener like onclick 
