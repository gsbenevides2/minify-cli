const inquirer = require("inquirer")
const {
 showError,
 getPackageJson,
 savePackageJson
} = require("../utils")

function checkedChoise(file){
 return {
	name:file,
	checked:true
 }
}

module.exports = async ()=>{
 const packageJson = getPackageJson()
 const minifyCliData = packageJson["minify-cli"]
 if(!minifyCliData){
	showError("Oops setting not found, please use the command init")
	process.exit()
 }
 const {files} = minifyCliData
 const htmlChoices = files.html.map(checkedChoise)
 const cssChoices = files.css.map(checkedChoise)
 const jsChoices = files.js.map(checkedChoise)

 let html = []
 let css = []
 let js = []
 if(htmlChoices.length){
	html = (await inquirer
	 .prompt({
		type:"checkbox",
		message:"Deselect html files",
		choices:htmlChoices,
		name:"files"
	 })).files
 }
 if(jsChoices.length){
	js = (await inquirer
	 .prompt({
		type:"checkbox",
		message:"Deselect js files",
		choices:jsChoices,
		name:"files"
	 })).files
 }
 if(cssChoices.length){
	css = (await inquirer
	 .prompt({
		type:"checkbox",
		message:"Deselect css files",
		choices:cssChoices,
		name:"files"
	 })).files
 }
 packageJson["minify-cli"].files ={ html,css,js}
 savePackageJson(packageJson)
}
