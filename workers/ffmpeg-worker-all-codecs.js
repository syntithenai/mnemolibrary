//importScripts('ffmpeg-all-codecs.js');
importScripts('?worker=all-codecs');

var now = Date.now;

function print(text) {
  postMessage({
    'type' : 'stdout',
    'data' : text
  });
}
function printErr(text) {
  postMessage({
    'type' : 'stderr',
    'data' : text
  });
}
onmessage = function(event) {

//console.log(event,event.data)
  var message = event.data;
  
  if (message.type === "run") {
    console.log(message);
    var Module = {
      print: print,
      printErr: printErr,
      files: message.MEMFS || [],
      arguments: message.arguments || [],
      TOTAL_MEMORY: 268435456,
      extraTestField:[]
      // Can play around with this option - must be a power of 2
      // TOTAL_MEMORY: 268435456
    };

    postMessage({
      'type' : 'start',
      'data' : Module.arguments.join(" ")
    });

    postMessage({
      'type' : 'stdout',
      'data' : 'Received command: ' +
                Module.arguments.join(" ") +
                ((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")
    });

    var time = now();
    var result = ffmpeg_run(Module);

    var totalTime = now() - time;
    postMessage({
      'type' : 'stdout',
      'data' : 'Finished processing (took ' + totalTime + 'ms)'
    });
    postMessage({
      'type' : 'done',
      'data' : {'MEMFS':[{name:result[0].name,data:new Uint8Array(result[0].data)}]},
      'time' : totalTime,
    });
  }
};

postMessage({
  'type' : 'ready'
});
