

var currentIndex;

/* SOCKET.IO */
var socket = io.connect(window.location.hostname);
socket.on('connection', function (data) {
    console.log('Connected to ' + window.location.hostname);
    socket.id = data.id;
    $('p#dynamic').text('Connecté !').fadeOut(1500);
    $('#ip').text('http://' + window.location.hostname);
    $('#qrcode').qrcode('http://' + window.location.hostname);
    socket.emit('device', { type: 'desktop' });
    socket.on('disconnect', function () {
        $('p#dynamic').fadeIn(0).text('Déconnecté :(');
        $('#qrcode').empty();
        $('#ip').empty();
    });

    /* Scroll */
    $("#content").scroll(function() {
        $('#content > div > section').reverse().each(function() {
            if( $("#content").offset().top + $(window).height()/2 > $(this).offset().top)  {
                if(this.id != currentIndex && !$('#content').is(':animated')){
                    currentIndex = this.id;
                    socket.emit('slide', { index: this.id, senderId: socket.id});
                }
                return false;
            }
        });

    });

});

jQuery.fn.reverse = [].reverse;



$(document).ready(function(){
    $('section').css('min-height', $(document).height());
    window.onresize = function(){
        $('section').css('min-height', $(document).height());
    }

    $('.table-of-content').append($('<ul></ul>'));
    $('section').each(function(){
       if($(this).find('h3')[0]!=null){
           $('.table-of-content ul').append('<li><a href="#' + $(this).attr('id') + '">' + $(this).find('h3').text() + '</a></li>')
       }
    });
});
