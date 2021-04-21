const fs = require("fs");
const { join } = require("path");
let find = require("find");

let dataObjects = [
    { id: 54551, name: "usr", type: "DIRECTORY" },
    {
        id: 54554,
        name: "applications",
        type: "DIRECTORY",
        parentId: 54553,
    },
    {
        id: 54555,
        name: "mimeinfo.cache",
        type: "FILE",
        parentId: 54554,
    },
    {
        id: 54553,
        name: "share",
        type: "DIRECTORY",
        parentId: 54552,
    },
    {
        id: 54552,
        name: "local",
        type: "DIRECTORY",
        parentId: 54551,
    },
];



// A function to create the directories and files gotten from the json input
function createDirAndFiles() {
    if (fs.existsSync("./structure")) {
        fs.rmdirSync("./structure", { recursive: true, force: true });
        fs.mkdirSync("structure");
	console.log("file tree data structure exists and has been updated succefully")
    } else {
        fs.mkdirSync("structure");
	console.log("file tree data structure has been created successfully")
    }

    dataObjects.forEach((data) => {
        if (data.type === "DIRECTORY") {
            if (fs.existsSync(join("./structure/", data.name))) {
                fs.rmdirSync(join("./structure/", data.name), {
                    recursive: true,
                    force: true,
                });
                fs.mkdirSync(join("./structure/", data.name));
            } else {
                fs.mkdirSync(join("./structure/", data.name));
            }
        } else if (data.type === "FILE") {
            if (fs.existsSync(join("./structure/", data.name))) {
                fs.unlinkSync(join("./structure/", data.name));
                fs.writeFileSync(join("./structure/", data.name), "");
            } else {
                fs.writeFileSync(join("./structure/", data.name), "");
            }
        }
    });
	
}



// A function to create the file tree data structure
function createFileStructure() {
    dataObjects.forEach((presentObject) => {
        dataObjects.forEach((object) => {
            find.dir(__dirname, function (dirs) {
                dirList = [...dirs];
                if (presentObject.id === object.parentId) {
                    for (let i = 0; i < dirList.length; i++) {
                        try {
                            if (dirList[i].includes(presentObject.name)) {
                                fs.renameSync(
                                    join("./structure/", object.name),
                                    join(dirList[i], `/${object.name}`),
                                );
                            }
                        } catch (err) {
                            if (err) {
                                find.dir(__dirname, function (updatedDirs) {
                                    let newDirList = [...updatedDirs];
                                    for (
                                        let i = 0;
                                        i < newDirList.length;
                                        i++
                                    ) {
                                        if (
                                            newDirList[i].includes(
                                                presentObject.name,
                                            )
                                        ) {
                                            fs.renameSync(
                                                join(
                                                    "./structure/",
                                                    object.name,
                                                ),
                                                join(
                                                    newDirList[i],
                                                    `/${object.name}`,
                                                ),
                                            );
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            });
        });
    });
}


//calling both functions to trigger the creation of the file data structure
createDirAndFiles();
createFileStructure();
