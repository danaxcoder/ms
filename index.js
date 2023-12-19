const spawn = require('child_process').spawn;
const WebSocketServer = require('ws');

const child = spawn('msfconsole');
    child.stdout.on('data', (data) => {
    });
    
    child.stdin.write("ls\n");
    child.stdin.end();
    return;

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
    
    const child = spawn('msfconsole');
    child.stdout.on('data', (data) => {
    });
    
    child.stdin.write("ls\n");
    child.stdin.end();
    
    spawns[uid] = spawn;
 
    // sending message to client
    ws.send('Welcome, you are connected!');
 
    //on message from client
    /*ws.on("message", data => {
        console.log(`Client has sent us: ${data}`)
    });*/
 
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("the client has connected");
    });
    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred")
    }
});
console.log("The WebSocket server is running on port 8080");