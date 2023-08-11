const express = require("express");
const fs = require("fs");
const childProcess = require("child_process");
const app = express();

console.log("Wellcome to CASCADE !");
console.log("powered by express & nodejs. version 1.0.0.");
console.log("developed by Uryzen317.");

// managing the list of files
let filesList = process.argv.filter((arg, index) => {
  if (index > 1) {
    return arg;
  }
});

// file names are not provided
if (filesList.length == 0) {
  console.log("no file name is provided");

  let directory = fs.readdirSync("./");
  directory = directory.filter((dir) => {
    if (
      dir != "app.js" &&
      dir != "node_modules" &&
      dir != "package-lock.json" &&
      dir != "package.json"
    ) {
      return dir;
    }
  });

  filesList = directory;
}

console.log("final list of files detected/provided :");
console.log(filesList);

// main page
app.get("/", (req, res) => {
  console.log("reciever connnected by ip of :", req.ip);

  let result = "";
  filesList.forEach((file, index) => {
    // get file stats
    let fileStat = fs.statSync(file);
    result += `<a style='margin:40px; font-size:40px;' href='${file}'>${index} | ${file} | ${(
      fileStat.size / 1048576
    ).toFixed(2)} MB | ${fileStat.birthtime}</a> <br> <br>`;
  });

  res.send(result);
});

// files downloader
app.get("*", (req, res) => {
  let requestedFile = req.url.replace("/", "");
  if (filesList.find((fl) => fl === requestedFile)) {
    // file name is valid
    console.log("file found");

    // method one
    // // get file stats
    // fs.stat(requestedFile, function (error, stat) {
    //   if (error) {
    //     console.log("error getting file stats");
    //     res.redirect("/");
    //   }
    //   res.writeHead(200, {
    //     "Content-Length": stat.size,
    //   });
    //   // final data pipe
    //   fs.createReadStream(requestedFile).pipe(res);
    // });

    // method two
    // content-disposition & content-type are defined automatically
    res.download(requestedFile);
  } else
    [
      // file is not valid
      res.redirect("/"),
    ];
});

// getting the local network ip
childProcess.exec("ipconfig", (err, stdout, stderr) => {
  let ip = stdout.split("IPv4 Address")[1].split("\n")[0].split(":")[1].trim();
  let port = 80;

  try {
    app.listen(80);
    console.log("open up your reciever browser on: ", ip, ":", port);
  } catch (err) {
    console.log("selected port is reserved.picking another one ...");
    port = Math.random() * 50000;
    app.listen(port);
    console.log("open up your reciever browser on: ", ip, ":", port);
  }
});
