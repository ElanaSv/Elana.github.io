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
let toDos = ["task 1", "task 2", "task 3"];
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

// To Do List Code 
var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
}
