const path = require("path")
const fs = require("fs")
const chalk = require("chalk")

function verifyFolder(content,folder){
 return content.map(i=>{
	const v = path.join(folder,i)
	if(fs.lstatSync(v).isDirectory()){
	 return verifyFolder(fs.readdirSync(v),v)
	}
	else return v
 })
}


module.exports.getFilesList = function(folder){
 return new Promise((resolve,reject)=>{
	if(folder === "./") folder = process.cwd()
	else folder = path.join(process.cwd(),folder)
	if(!fs.existsSync(folder)) reject("The selected folder does not exist.")
	else{
	 fs.readdir(folder,(err,items)=>{
		//console.log(items,err)
		if(items.length===0) reject("Selected folder is empty ")
		else{
		 const files = []
		 function resolvePaths(paths){
			paths.map(p=>{
			 if(typeof p !== 'string'){
				resolvePaths(p)
			 }
			 else {
				const pos = folder.length +1
				files.push(p.slice(pos))
			 }
			})
		 }
		 resolvePaths(verifyFolder(items,folder))
		 const separedFiles = {
			js:[],
			css:[],
			html:[]
		 }
		 const testResult = files.map(file=>{
			const fileName = path.basename(file)
			if(fileName.slice(-3)===".js"){
			 separedFiles.js.push(file)
			 return true
			}
			else if(fileName.slice(-4) === ".css") {
			 separedFiles.css.push(file)
			 return true
			}
			else if(fileName.slice(-4) === ".htm" || fileName.slice(-5) ===".html"){
			 separedFiles.html.push(file)
			 return true
			}
			else return false
		 })
		 if(testResult.indexOf(true) !== -1){
			resolve(separedFiles)
		 }
		 else{
			reject("The selected folder does not contain JS, CSS, and HTML files.")
		 }
		}
	 })
	}
 })
}
module.exports.showError = (msg)=>{
 console.log(chalk.bgRed.black("Error"),msg)
}
module.exports.getPackageJson = ()=>{
 try{
	return require(path.join(process.cwd(),"package.json"))
 }
 catch(e){
	module.exports.showError("Could not find package.json for your project, please make sure you are calling me at its root.")
	throw e
	process.exit()
 }
}
module.exports.savePackageJson = (content)=>{
 fs.writeFileSync(
	path.join(process.cwd(),"package.json"),
	JSON.stringify(content,null,"\t")
 )
}/*
module.exports.showWaitingMsg=(msg)=>{
 var i = 0;  // dots counter
 process.stdout.clearLine();  // clear current text
 process.stdout.cursorTo(0);  // move cursor to beginning of line
 i = (i + 1) % 4;
 var dots = new Array(i + 1).join(".");
 process.stdout.write(msg + dots);  // write text

 return setInterval(function() {
	process.stdout.clearLine();  // clear current text
	process.stdout.cursorTo(0);  // move cursor to beginning of line
	i = (i + 1) % 4;
	var dots = new Array(i + 1).join(".");
	process.stdout.write(msg + dots);  // write text
 }, 3);

}*/
