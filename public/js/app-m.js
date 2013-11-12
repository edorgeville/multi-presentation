

var dev = false;
if($('html').hasClass('dev')){
    dev = true;
}
var log = $('.log');
var currentIndex = 0;

var socket = io.connect(window.location.hostname);
socket.on('connection', function (data) {
    console.log('Connected to ' + window.location.hostname);
    $('#dynamic').text('Connecté !');
    $('#dynamic').addClass('label-success');
    socket.emit('device', { type: 'mobile' });
    socket.on('disconnect', function () {
        $('#dynamic').text('Déconnecté :(');
        $('#dynamic').removeClass('label-success').addClass('label-important');
    });
    socket.on('slide',function(data){
       if(dev){
           log.append(data.index + ', ');
       }
        currentIndex = data.index;
        TweenLite.to($('.slides'), 0.5, { opacity:0, css:{ marginLeft:-((currentIndex-1)*$(document).width()) } } );
    });
});

$(document).ready(function(){
    $('.slides section').css('width', $(document).width());
    window.onresize = function(){
        $('.slides section').css('width', $(document).width());
        $('.slides').css('margin-left', -((currentIndex-1)*$(document).width()));
    }
});
