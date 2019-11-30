import fs from 'fs'
/**
 * This will help to get the files and the data inside the file.
 * @param pathToDir {string} 
 * 
 * Features:
 * ---Have---
 * - Capability of loop in the dir having js and json file.
 */

/* TODO - 
    *  - Recursive file and folder
    *  - Filter the file
    */
export default (options) => {
    const dirPath = options.dirPath
    const fileNameMap = options.fileNameMap || ((data) => (data))
    const resolveFileData = options.resolveFileData || ((data) => (data))
    const modules = {}
    //Read the files from dir path 
    const files = fs.readdirSync(dirPath)

    //Loop through the files and get the data from the list
    files.forEach((fileName) => {
        //Add the file name and data to the Object
        modules[fileNameMap(fileName)] = resolveFileData(require(dirPath + "/" + fileName))
    })
    return modules
}