#!/usr/bin/env node

var express    = require('express');
var chalk	   = require('chalk');
var bodyParser = require('body-parser');
var spawn      = require('child_process').exec;
var app		   = express();
var port       = 3000;

app.use(express.static(__dirname+'/static'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/git/:command',function(req,res){

	var flag = req.query.flag?req.query.flag:'';
	var command = 'git ' + req.params.command +' '+flag;
	console.info(chalk.blue('\n'+command+"\tCommand is going to run"));
	handler(command,req,res);

});

app.post('/git',function(req,res){
	handler(req.body.command,req,res);
});

function handler(command,req,res){

	var gitcommand = spawn(command,{
		cwd:process.pwd,
		env:process.env
	});

	res.setHeader("Content-Type", "text/html");

	gitcommand.stdout.on('data',function(data){
		res.write(data);
	});

	gitcommand.stderr.on('data',function(data){
		res.write(data);
	});

	gitcommand.on('close',function(code){
		res.end('');
		console.log(chalk.green('\n'+command+"\tCommand execution ended with the following code "+code));
	});

	res.on('close',function(){
		gitcommand.kill('SIGHUP');
	});
}

process.argv.forEach(function(value){
	if(value.indexOf('--port=')!==-1){
		port = value.split('=')[1] || port;
	}
});

app.listen(port,function(){
	console.info(chalk.green("\n server listening on port "+port+" for git commands"));
	console.info(chalk.yellow('\n-------------------------------------------------\n'));
	console.info(chalk.underline.red('command')+' \t '+chalk.underline.cyan('Status'));
});