const {
 getPackageJson,
 savePackageJson
} = require("../utils")

module.exports = ()=>{
 console.log("Reseting....")
 const packageJson = getPackageJson()
 packageJson["minify-cli"] = null
 savePackageJson(packageJson)
 console.log("Reset success")
}
