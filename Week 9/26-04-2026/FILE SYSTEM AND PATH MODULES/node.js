//Essential Modules in Node.js

//1. File System Module (fs)
const fs = require('fs');
//Reading a file
fs.readFile('example.txt', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading file: ", err);
    } else {
        console.log("File content: ", data);
    }
});
//Writing to a file
const content = "Hello, this is a sample text.";
fs.writeFile('output.txt', content, (err) => {
    if (err) {
        console.error("Error writing to file: ", err);
    } else {
        console.log("File written successfully.");
    }
});

//2. Path Module (path)
const path = require('path');
const filePath = path.join(__dirname, 'example.txt');
console.log("File path: ", filePath);
const fileName = path.basename(filePath);
console.log("File name: ", fileName);
const dirName = path.dirname(filePath);
console.log("Directory name: ", dirName);
const fileExt = path.extname(filePath);
console.log("File extension: ", fileExt);

//coppying a file using fs and path modules
const sourcePath = path.join(__dirname, 'example.txt');
const destPath = path.join(__dirname, 'example_copy.txt');
fs.copyFile(sourcePath, destPath, (err) => {
    if (err) {
        console.error("Error copying file: ", err);
    } else {
        console.log("File copied successfully.");
    }
}); 

//renaming a file using fs and path modules
const oldPath = path.join(__dirname, 'example_copy.txt');
const newPath = path.join(__dirname, 'renamed_example.txt');   
fs.rename(oldPath, newPath, (err) => {
    if (err) {
        console.error("Error renaming file: ", err);
    } else {        console.log("File renamed successfully.");
    } });

//Deleting a file using fs and path modules
const deletePath = path.join(__dirname, 'renamed_example.txt');
fs.unlink(deletePath, (err) => {
    if (err) {
        console.error("Error deleting file: ", err);
    } else {
        console.log("File deleted successfully.");
    }
}); 

//getting file stats using fs and path modules
const statsPath = path.join(__dirname, 'example.txt');
fs.stat(statsPath, (err, stats) => {
    if (err) {
        console.error("Error getting file stats: ", err);
    } else {
        console.log("File stats: ", stats);
    }
});

//Directory operations using fs and path modules
const dirPath = path.join(__dirname, 'sample_dir');
fs.mkdir(dirPath, (err) => {
    if (err) {
        console.error("Error creating directory: ", err);
    } else {
        console.log("Directory created successfully.");
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                console.error("Error reading directory: ", err);
            } else {                console.log("Directory contents: ", files);
                fs.rmdir(dirPath, (err) => {
                    if (err) {
                        console.error("Error removing directory: ", err);
                    } else {
                        console.log("Directory removed successfully.");
                    }
                });
            }
        });
    }
});

//Creating directories recursively using fs and path modules
const nestedDirPath = path.join(__dirname, 'parent_dir', 'child_dir');  
fs.mkdir(nestedDirPath, { recursive: true }, (err) => {
    if (err) {
        console.error("Error creating nested directories: ", err);
    } else {
        console.log("Nested directories created successfully.");
    }
});

//reading directory contents using fs and path modules
const readDirPath = path.join(__dirname, 'parent_dir');
fs.readdir(readDirPath, (err, files) => {
    if (err) {
        console.error("Error reading directory: ", err);
    } else {
        console.log("Directory contents: ", files);
    }
});

//finding files with specific extension using fs and path modules
const findExtPath = path.join(__dirname, 'parent_dir');
fs.readdir(findExtPath, (err, files) => {
    if (err) {
        console.error("Error reading directory: ", err);
    } else {        const txtFiles = files.filter(file => path.extname(file) === '.txt');
        console.log("Text files in directory: ", txtFiles);
    }
});

//Directory tree structure using fs and path modules
function readDirectoryTree(dirPath, indent = '') {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error("Error reading directory: ", err);
        } else {            files.forEach(file => {
                const filePath = path.join(dirPath, file);
                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        console.error("Error getting file stats: ", err);
                    } else {                        if (stats.isDirectory()) {
                            console.log(indent + '📁 ' + file);
                            readDirectoryTree(filePath, indent + '  ');
                        } else {
                            console.log(indent + '📄 ' + file);
                        }
                    }
                });            });
        }
    });}

const rootDirPath = path.join(__dirname, 'parent_dir');
readDirectoryTree(rootDirPath);
const rootDirPath2 = path.join(__dirname, 'sample_dir');
readDirectoryTree(rootDirPath2);
console.log("Directory tree structure displayed successfully.");
console.log("All operations completed successfully.");
