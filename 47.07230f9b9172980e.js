(()=>{"use strict";var r=(()=>{return(e=r||(r={})).start="start",e.shutdown="shutdown",r;var e})(),n=(()=>{return(e=n||(n={})).debugMessage="debug",e.fakeConsoleResponse="console",n;var e})();addEventListener("message",function t(e){const a=e.data;switch(a.command){case r.start:!function c(){postMessage({command:n.debugMessage,payload:"WebWorker acknowledges receiving a Start command"}),s=setInterval(()=>{o++,postMessage({command:n.fakeConsoleResponse,payload:`Fake console message ${o}`})},3e3)}();break;case r.shutdown:!function l(){postMessage({command:n.debugMessage,payload:"WebWorker acknowledges receiving a Shutdown command"}),s&&clearInterval(s),removeEventListener("message",t)}();break;default:console.error("Unexpected command to web worker: ",a.command)}});let s=null,o=0;addEventListener("error",e=>{console.log("background worker error event listener received: ",e)}),addEventListener("messageerror",e=>{console.log("background worker messageerror event listener received: ",e)}),addEventListener("rejectionhandled",e=>{console.log("background worker rejectionhandled event listener received: ",e)}),addEventListener("unhandledrejection",e=>{console.log("background worker unhandledrejection event listener received: ",e)})})();