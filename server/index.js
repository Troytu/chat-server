
var app = require('express')();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

app.get('/', function(req, res){
	res.send('<h1>Welcome Realtime Server</h1>');
});


var onlineUsers = {};

var onlineCount = 0;

io.on('connection', function(socket){
	console.log('a user connected');
	
	
	socket.on('login', function(obj){
		
		socket.name = obj.userid;
		
		
		if(!onlineUsers.hasOwnProperty(obj.userid)) {
			onlineUsers[obj.userid] = obj;
			
			onlineCount++;
		}
		
	
		io.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj,login:true});
		console.log(obj.username+'加入了聊天室');
	});
	

	socket.on('disconnect', function(){
	
		if(onlineUsers.hasOwnProperty(socket.name)) {
			
			var obj = {userid:socket.name, username:onlineUsers[socket.name]};
			
			
			delete onlineUsers[socket.name];
		
			onlineCount--;
			
			
			io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj,logout:true});
			console.log(obj.username+'退出了聊天室');
		}
	});
	

	socket.on('changeInfo', function(obj){
	
		io.emit('changeInfo', obj);
		console.log(obj.username+'更改了信息');
	});
	
	socket.on('message', function(obj){
		
		io.emit('message', obj);
		console.log(obj.username+'说：'+obj.msg);
	});
  
});

http.listen(process.env.PORT||3000, function(){
	console.log('listening on *:3000');
});
