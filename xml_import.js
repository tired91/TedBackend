const fs = require('fs');
const path = './XML_files/20190911_175/427095_2019.xml';
const DOMParser = require('xmldom').DOMParser;

let xml = fs.readFileSync(path, 'utf8');
let xml2 = xml.replace(
  'xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://publications.europa.eu/resource/schema/ted/R2.0.9/publication" xmlns:n2016="http://publications.europa.eu/resource/schema/ted/2016/nuts" xsi:schemaLocation="http://publications.europa.eu/resource/schema/ted/R2.0.9/publication TED_EXPORT.xsd"',
  ''
);

var xpath = require('xpath'),
  dom = require('xmldom').DOMParser;
var doc = new dom().parseFromString(xml2);

//get the main CPVCODE;

function getMainCPVCode(doc) {
  var cpvCodeValue;
  try {
    var cpvcode = xpath.select1(
      '/TED_EXPORT/CODED_DATA_SECTION/NOTICE_DATA/ORIGINAL_CPV/@CODE',
      doc
    ).value;
    cpvCodeValue = cpvcode;
  } catch (err) {}
  return cpvCodeValue;
}

//get the publication date
function getPublicationDate(doc) {
  try {
    var pubdate = xpath.select(
      '/TED_EXPORT/CODED_DATA_SECTION/REF_OJS/DATE_PUB',
      doc
    );
    var pubdateValue = pubdate[0].firstChild.data;
  } catch (err) {
    console.log('could find publicationdate with that xpath');
  }
  return pubdateValue;
}

//get the form type
function getFormType(doc) {
  try {
    var formType = xpath.select('/TED_EXPORT[1]/FORM_SECTION[1]', doc);
    var formTypeValue = formType[0].firstChild.localName;
  } catch (err) {
    console.log('Couldnt find formtype with that xpath');
  }
  return formTypeValue;
}

//get all cpv-codes
//fungerar på alla utom oth(?);
function getALLCPVCODES(doc) {
  let arrayOfCPVCODES = [];
  try {
    var allCPVCODES = xpath.select('//*[CPV_CODE]', doc);
    for (let a = 0; a < allCPVCODES.length; a++) {
      arrayOfCPVCODES.push(allCPVCODES[a].firstChild.attributes[0].nodeValue);
    }
    const uniqueValues = new Set(arrayOfCPVCODES);
    arrayOfCPVCODES = [...uniqueValues];
  } catch (err) {}
  return arrayOfCPVCODES;
}

//console.log('PUBLICATION_DATE: ' + getPublicationDate(doc));
//console.log('FORM_TYPE: ' + getFormType(doc));
//console.log('MAIN_CPV_CODE: ' + getMainCPVCode(doc));
console.log(getALLCPVCODES(doc));
