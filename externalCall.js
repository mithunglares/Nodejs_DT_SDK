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
function doOutgoingRemoteCall() {
    const https = require('https')
            const options = {
            hostname: 'httpbin.org',
            port: 443,
            path: '/get',
            method: 'GET'
            }

            const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
            Api.addCustomRequestAttribute("OUTGOINGCALL", "httpbin.org");
            res.on('data', d => {
            process.stdout.write(d)
            return d;
            })
            })

            req.on('error', error => {
            console.error(error)
            })

            req.end()


    }
  

//----------------------
// Issue a traced outgoing remote call
async function tracedOutgoingRemoteCall(method, data) {
    const tracer = Api.traceOutgoingRemoteCall({
      serviceEndpoint: "ChildProcess",
      serviceMethod: method,  // the name of the remote method called
      serviceName: "StringManipulator",
      channelType: Sdk.ChannelType.NAMED_PIPE
    });
  
    try {
      // start tracer, get dynatrace tag and trigger sending via doOutgoingRemoteCall()
      return await tracer.start(function triggerTaggedRemoteCall() {
        // getting a tag from tracer needs to be done after start()
        const dtTag = tracer.getDynatraceStringTag();
        // now trigger the actual remote call
            return doOutgoingRemoteCall();
      });
    } catch (e) {
      tracer.error(e);
      throw e;
    } finally {
      tracer.end();
    }
  }

  tracedOutgoingRemoteCall("externalCallNow", "httpbin.org").then((res) => console.log("toUpper(StRiNg): " + res), (err) => console.log("toUpper(StRiNg) failed: " + err));
