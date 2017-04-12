const electron = require('electron')
const {app, BrowserWindow, Tray} = electron

const request = require('request');
const fs = require('fs');
var downloadsFolder = `file://${__dirname}/images`;
var cron = require('node-schedule');

function downloadFile(file_url , targetPath){
    // Save variable to know progress


    var req = request({
        method: 'GET',
        uri: file_url
    });

    var out = fs.createWriteStream(targetPath);
    req.pipe(out);


    req.on('end', function() {
        console.log("File succesfully downloaded");
    });
}



// import individual service



function checkInternet(cb) {
    require('dns').lookup('google.com',function(err) {
        if (err && err.code == "ENOTFOUND") {
            cb(false);
        } else {
            cb(true);
        }
    })
}

// example usage:


app.on('ready', () => {
  let win = new BrowserWindow({width:800, height:600, frame: false, fullscreen: true});
  checkInternet(function(isConnected) {
      if (isConnected) {
          // connected to the internet
          downloadFile("https://s3.ap-south-1.amazonaws.com/electron-test-havmor-test/screen1.jpg", 'images/default2.jpg');
          win.loadURL(`file://${__dirname}/images/default.jpg`);
      } else {
          // not connected to the internet
          console.log('App is offline!')
          win.loadURL(`file://${__dirname}/images/default2.jpg`);
      }
  });
  checkInternet(function(isConnected) {
      if (isConnected) {
          // connected to the internet
          var rule2 = new cron.RecurrenceRule();
rule2.dayOfWeek = [1,3,5,0];
rule2.hour = 11;
rule2.minute = 15;
cron.scheduleJob(rule2, function(){
    console.log('This runs at 11:15AM every Monday, Wednesday, Friday, Sunday.');
    downloadFile("https://s3.ap-south-1.amazonaws.com/electron-test-havmor-test/screen1.jpg", 'images/default2.jpg');
});

      }
  });

})
