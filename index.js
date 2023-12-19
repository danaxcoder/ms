const spawn = require('child_process').spawn;
const WebSocketServer = require('ws');

var spawns = {};
 
// Creating a new websocket server
const wss = new WebSocketServer.Server({ port: 8080 })
 
// Creating connection using websocket
wss.on("connection", (ws, req) => {
    console.log("new client connected");
    
    console.log("Parameters: "+req.url);
    
    var params = req.url.substring(2, req.url.length);
    var paramsSplit = params.split("&");
    var uid = "";
    for (var i=0; i<paramsSplit.length; i++) {
      var paramSplit = paramsSplit[i];
      var paramName = paramSplit.split("=")[0];
      var paramValue = paramSplit.split("=")[1];
      if (paramName == "uid") {
        uid = paramValue;
      }
    }
    console.log("Unique ID: "+uid);
    
    console.log("spawn is null? "+(spawns[uid]==null));
    
    if (spawns[uid] == null) {
      const child = spawn('msfconsole');
      child.stdout.on('data', (data) => {
        console.log(data.toString());
        var message = data.toString();
        if (message.includes("Meterpreter session") || message.startsWith("[*] Meterpreter session")) {
          console.log("Sending initdone...");
          ws.send('initdone');
        } else {
          console.log("Sending [msout] message...");
          ws.send('[msout] '+message);
        }
      });
      spawns[uid] = child;
    }
 
    //on message from client
    ws.on("message", data => {
        console.log(`Client has sent us: ${data}`);
        var uid = "";
        var action = "";
        var cmd = "";
        var dataSplit = data.toString().split("&");
        for (var i=0; i<dataSplit.length; i++) {
          var datumSplit = dataSplit[i];
          var paramName = datumSplit.split("=")[0];
          var paramValue = datumSplit.split("=")[1];
          if (paramName == "uid") {
            uid = paramValue;
          } else if (paramName == "action") {
            action = paramValue;
          } else if (paramName == "cmd") {
            cmd = paramValue;
          }
        }
        if (action == 'cmd') {
          var child = spawns[uid];
          child.stdin.write(cmd+"\n");
        }
    });
 
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("the client has disconnected");
    });
    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred")
    }
});
console.log("The WebSocket server is running on port 8080");