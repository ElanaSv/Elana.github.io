
let handleFail = function(err){
    console.log(err)
}

function addVideoStream(streamId){
    let remoteContainer = document.getElementById("RemoteStream"); // remoteContainer
    let streamDiv = document.createElement("div"); // canvasContainer
    streamDiv.id = streamId;
    // streamDiv.style.transform = "rotateY(180deg)";
    streamDiv.style.height = "200px";
    streamDiv.style.width = "300px";
    remoteContainer.appendChild(streamDiv);
} 

document.getElementById("join").onclick = function () {
    let channelName = document.getElementById("channelName").value;
    let Username = document.getElementById("username").value;
    let appId = "2025521fc5d645f7b76a0402e2fd9cb7";
    //initialize agora client
    let client = AgoraRTC.createClient({
        mode: "live", /* rtc is other option */
        codec: "h264"
    })

    client.init(appId,() => console.log("AgoraRTC Client Connected"),handleFail)
    
    client.join(
        null,
        channelName,
        Username,
        () =>{
            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
                screen: false,
            })
            localStream.init(function(){
                localStream.play("SelfStream");
                console.log(`App id: ${appId}\nChannel id: ${channelName}`);
                client.publish(localStream, handleFail);
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
            })
        }
    )
    }
    //creating an even listener like onclick 