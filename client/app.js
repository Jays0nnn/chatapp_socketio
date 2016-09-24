    $(function() {

        var socket = io.connect('http://localhost:8000');

        var $messageForm = $('#messageForm');
        var $message = $('#message');
        var $chat = $('#chat');
        var $users = $('#users');
        var $messageArea = $('#messageArea');
        var $username = $('#username');
        var $userFormArea = $('#userFormArea');
        var $userForm = $('#userForm');

        console.log(socket);   


        $messageForm.submit(function(e) {

            e.preventDefault();

            socket.emit('send message', $message.val());
     
            $message.val('');

        });

        $userForm.submit(function(e) {

            e.preventDefault();
        
            socket.emit('new user', $username.val(), function(data) {

                if (data) {

                    console.log('thispart works!');
                    $userFormArea.hide();

                    $messageArea.show();

                }
            });

            $username.val('');
        //Then outside the if statement, clear the values within the variable
        });

        socket.on('new message', function(data) {

            $chat.append('<div class="well">' + data.msg + '</div>');

        });

        socket.on('get users', function(data) {
  

            var html = '';

            for (i = 0; i < data.length; i++) {


                html += '<li class="list-group-item">' + data[i] + '</li>';
            }

            $users.html(html);

        });

    });