
const http = require('http');
const ports = process.env.PORT || 3000;

// ----------------------------------------------------------------------------

const Sdk = require("@dynatrace/oneagent-sdk");
const Api = Sdk.createInstance();
if (Api.getCurrentState() !== Sdk.SDKState.ACTIVE) {
    console.error("CustomRequestAttributesSample: SDK is not active!");
  }
  
  // install logging callbacks
  Api.setLoggingCallbacks({
    warning: (msg) => console.error("CustomRequestAttributesSample SDK warning: " + msg),
    error: (msg) => console.error("CustomRequestAttributesSample SDK error: " + msg)
  });


//-----------------------------------------------------------------------------
function listen(){
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  const msg = 'Hello Node!\n';
  console.log("info: Listen server message sent")
  Api.addCustomRequestAttribute("LISTENPORT", ports);
  res.end(msg);
});

server.listen(ports, () => {
  console.log(`Server running on http://localhost:${ports}/`);
});
}

//Api.addCustomRequestAttribute("OUTGOINGCALL", "httpbin.org");
listen();

