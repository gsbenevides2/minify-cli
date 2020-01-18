const inquirer = require("inquirer")
const fs = require("fs")
const {
 showError,
 getFilesList,
 getPackageJson,
 savePackageJson
} = require("../utils")
module.exports = async ()=>{
 const packageJson = getPackageJson()
 const minifyCliData = packageJson["minify-cli"]
 if(!minifyCliData){
	showError("Oops setting not found, please use the command init")
	process.exit()
 }
 getFilesList(minifyCliData.src)
	.then(async files=>{
	 const html = files
		.html
		.filter(file=>!minifyCliData.files.html.includes(file))
	 const css = files
		.css
		.filter(file=>!minifyCliData.files.css.includes(file))
	 const js = files
		.js
		.filter(file=>!minifyCliData.files.js.includes(file))
	 if(js.length+html.length+css.length===0){
		showError("Oops I didn't find any files that are not already mapped in package.json")
		process.exit()
	 }
	 let htmls = []
	 let csss = []
	 let jss = []
	 if(html.length){
		htmls = (await inquirer.prompt([{
		 type:"checkbox",
		 name:"html",
		 message:"Select html files:",
		 choices:html
		}
		])).html
	 }
	 if(js.length){
		jss = (await inquirer.prompt([{
		 type:"checkbox",
		 name:"js",
		 message:"Select js files:",
		 choices:js
		}
		])).js

	 }
	 if(css.length){
		csss = (await inquirer.prompt([{
		 type:"checkbox",
		 name:"css",
		 message:"Select css files:",
		 choices:css
		}
		])).css
	 }
	 if(![...jss,...csss,...htmls].length){
		showError("Please select at least one file !!!")
		process.exit()
	 }
	 packageJson["minify-cli"]
		.files
		.html
		.push.apply(packageJson["minify-cli"].files.html,htmls)
	 packageJson["minify-cli"]
		.files
		.css
		.push.apply(packageJson["minify-cli"].files.css,csss)
	 packageJson["minify-cli"]
		.files
		.js
		.push.apply(packageJson["minify-cli"].files.js,jss)
	 savePackageJson(packageJson)
	 console.log("Success")

	})
	.catch(showError)

}
