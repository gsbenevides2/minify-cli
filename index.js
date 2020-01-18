#!/usr/bin/env node
const commander = require("commander")
const version = require("./package.json").version
commander.version(version)
const help = require("./help.json")
const commands = require("./commands")
 
Object.keys(commands).map(command=>{
 commander
	.command(command)
	.action(commands[command])
})

commander.parse(process.argv)
