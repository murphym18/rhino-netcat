if (arguments.length < 2) {
   java.lang.System.exit(0);
}

var hostname = arguments[0];
var port = arguments[1];

var BUFFER_SIZE = 8092;

var socket = new java.net.Socket(hostname, port);

var sockIn = socket.getInputStream();
var out = new java.io.FileOutputStream(java.io.FileDescriptor.out);

var sockOut = socket.getOutputStream();
var input = new java.io.FileInputStream(java.io.FileDescriptor['in']);

var sockReadThread = java.lang.Thread(function () {
   var buf = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, BUFFER_SIZE);
   var open = !socket.isInputShutdown();
   while (open) {
      var n = sockIn.read(buf);
      open = n != -1;
      if (open){
         out.write(buf, 0, n);
      }
   }
});

var sockWriteThread = java.lang.Thread(function () {
   var buf = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, BUFFER_SIZE);
   var open = !socket.isOutputShutdown();
   while (open) {
      var n = input.read(buf);
      open = n != -1 && !socket.isOutputShutdown();
      if (open){
         sockOut.write(buf, 0, n);
      }
   }
});

sockReadThread.start();
sockWriteThread.start();




