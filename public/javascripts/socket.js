script(src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.2/socket.io.js")
    script.
      var socket = io.connect('http://localhost:3001');

      socket.on('rm', function(data) {
        $('.favoris').remove();
        socket.close();
      });
      $('.favoris').click(function() {
        socket.emit('favoris', '#{video.IdVideo}');
        $('span.red').text('[-] ' + skips + ' ');
      });
// pour a.btn.btn-primary.favoris(role='button')
