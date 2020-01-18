const inquirer = require("inquirer")
const {
 showError,
 getFilesList,
 getPackageJson,
 savePackageJson
} = require("../utils")
const packageJson = getPackageJson()

module.exports = async function(){
 console.log("Welcome to minify-cli 😀")
 if(packageJson["minify-cli"]){
	showError("minify-cli is already set up, check the add, remove and help commands.")
 }
 else{
	console.log("- Starting setup ")
	const {folder,dest,copyAll} = (await inquirer
	 .prompt([
		{
		 name:"folder",
		 message:"What is the folder in which the files will be mimicked?",
		 default:"src"
		},
		{
		 name:"dest",
		 message:"Which folder will the mimicked files go to?",
		 default:"public"
		},
		{
		 type:"confirm",
		 name:"copyAll",
		 message:"Do you want to copy all files from one folder to another? This includes images, jsons, etc.",
		 default:true
		}
	 ]))
	console.log("✔️","Folder selected:",folder)
	getFilesList(folder)
	 .then(async files=>{
		let [htmls,jss,csss] = [[],[],[]]
		if(files.html.length){
		 htmls = (await inquirer.prompt([{
			type:"checkbox",
			name:"html",
			message:"Select html files:",
			choices:files.html
		 }
		 ])).html
		}
		if(files.js.length){
		 jss = (await inquirer.prompt([{
			type:"checkbox",
			name:"js",
			message:"Select js files:",
			choices:files.js
		 }
		 ])).js

		}
		if(files.css.length){
		 csss = (await inquirer.prompt([{
			type:"checkbox",
			name:"css",
			message:"Select css files:",
			choices:files.css
		 }
		 ])).css
		}
		if(![...jss,...csss,...htmls].length){
		 showError("Please select at least one file !!!")
		}
		else{
		 packageJson["minify-cli"] ={
			src:folder,
			dest,
			copyAll,
			files:{
			 js:jss,
			 css:csss,
			 html:htmls
			}	
		 }
		 savePackageJson(packageJson)
		 console.log("Success")
		}
	 })
	 .catch(showError)
 }
}
