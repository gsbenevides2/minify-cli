const path = require("path")
const compressor = require('node-minify');
const ncp = require("ncp")
const {
 showError,
 getPackageJson
} = require("../utils")
const packageJson = getPackageJson()
const minifyCliData = packageJson["minify-cli"]

const compressorsType = {
 html:"html-minifier",
 css:"clean-css",
 js:"uglify-es"
}
const compressorOptions={
 html: minifyCliData && minifyCliData.compressorOptions ? minfifyCliData.compressorOptions.html : null,
 css: minifyCliData && minifyCliData.compressorOptions ? minfifyCliData.compressorOptions.css : null,
 js: minifyCliData && minifyCliData.compressorOptions ? minfifyCliData.compressorOptions.js : null
}
function copyFolder(src,dest){
 return new Promise(resolve=>{
	ncp(
	 path.join(process.cwd(),src),
	 path.join(process.cwd(),dest),
	 err=>{
		if(err){
		 showError("Error copying folder")
		 throw err
		}
		else resolve()
	 }
	)

 })
}
function minifyFile(input,output,fileType){
 return new Promise(resolve=>{
	compressor.minify({
	 compressor:compressorsType[fileType],
	 options:compressorOptions[fileType],
	 input,output,
	})
	 .then(resolve)
 })
	.catch(err=>{
	 showError("An error occured while mimicking.")
	 throw err
	})
}
module.exports = async ()=>{
 if(!minifyCliData){
	showError("Oops setting not found, please use the command init")
 }
 else{
	const {src,dest,files} = minifyCliData
	if(minifyCliData.copyAll){
	 console.log("Copying folder...")
	 await copyFolder(src,dest)
	 console.log("✔️ Folder copied with success")
	}
	console.log("Mimicking files...")
	const promises = []
	for(fileIndex in files.html){
	 const file = files.html[fileIndex]
	 promises.push(minifyFile(
		path.join(src,file),
		path.join(dest,file),
		"html"
	 ))
	}
	for(fileIndex in files.css){
	 const file = files.css[fileIndex]
	 promises.push(minifyFile(
		path.join(src,file),
		path.join(dest,file),
		"css"
	 ))
	}
	for(fileIndex in files.js){
	 const file = files.js[fileIndex]
	 promises.push(minifyFile(
		path.join(src,file),
		path.join(dest,file),
		"js"
	 ))
	}
	Promise.all(promises).then(()=>{
	 console.log("✔️ Successfully matched")
	})
 }
}

