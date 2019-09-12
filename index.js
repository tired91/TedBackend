//===MODULES====
const util = require('util');
const path = require('path');
const fs = require('fs');
const download = require('download-file');
const schedule = require('node-schedule');
const targz = require('targz');

//==Promises
const readDir = util.promisify(fs.readdir);
const scheduleJob = util.promisify(schedule.scheduleJob);
const decompress = util.promisify(targz.decompress);

// ===== searchpaths ======
//sökväg till xml_files (där uppackning ska ske)
const xmlFilesDirectoryPath = path.join(__dirname, 'XML_files');

//sökväg för tardownloads (där tarfilen ska laddas hem)
const tarDownloadsDirectoryPath = path.join(__dirname, 'tar_downloads');

//unpack tarfile
async function unpackTarFile(pathToCompressedFile, pathToExtract) {
  decompress({ src: pathToCompressedFile, dest: pathToExtract }, function(err) {
    if (err) {
      console.log(err);
    }
  });
}

/**
 * Download the tar-file from yesterday at a specific time.
 * @param  {} hh
 * @param  {} mm
 */
async function downloadYesterdaysTar(hh, mm) {
  let url = await getDownloadURL();
  console.log(url);

  let scheduleJob = schedule.scheduleJob({ hour: hh, minute: mm }, function() {
    let options = {
      directory: tarDownloadsDirectoryPath
    };
    download(url, options, function(err) {
      if (err) {
        console.log('Failed to download....' + err);
      } else {
        getFilenamesInDirectoryPromise(tarDownloadsDirectoryPath).then(
          filenames => {
            let tarFilename = filenames.pop();
            let tarFP = path.join(tarDownloadsDirectoryPath, tarFilename);
            unpackTarFile(tarFP, xmlFilesDirectoryPath);
          }
        );
      }
    });
  });
}

downloadYesterdaysTar(08, 07);

/**
 * Get all the filenames from a specific directory
 * @param  {string} filepath
 * @returns [] filenames
 */
async function getFilenamesInDirectoryPromise(fp) {
  try {
    let filenames;
    filenames = await readDir(fp);
    return filenames;
  } catch (err) {
    console.log('No such filename');
  }
}

function getYesterdaysDate() {
  let x = new Date();
  x.setDate(x.getDate() - 1);
  let y = x.getFullYear().toString();
  let m = (x.getMonth() + 1).toString();
  let d = x.getDate().toString();
  d.length == 1 && (d = '0' + d);
  m.length == 1 && (m = '0' + m);
  let formatedDateObject = {
    year: y,
    month: m,
    day: d
  };
  return formatedDateObject;
}

async function getDownloadURL() {
  let yesterdaysDateObject = getYesterdaysDate();
  let year = yesterdaysDateObject.year;
  let month = yesterdaysDateObject.month;
  let date = yesterdaysDateObject.day;

  //get the filename of the last folder in XML_downloads
  let filenames = await getFilenamesInDirectoryPromise(xmlFilesDirectoryPath);
  let filename = filenames.pop();
  //get the last part of the filename and convert it to a number
  filename = filename.split('_').pop();
  filename = parseInt(filename);
  //increase the number with 1 to --- [tydligare förklaring]
  filename++;

  //if year changes
  if (month === 1 && date === 1) {
    filename = 001;
  }

  //define url
  let url = `https://ted.europa.eu/xml-packages/daily-packages/${year}/${month}/${year}${month}${date}_${year}${filename}.tar.gz`;
  return url;
}
