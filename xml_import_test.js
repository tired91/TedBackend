const fs = require('fs');
const path = './XML_files/20190911_175/425466_2019.xml';

const pathToXMLDir = 'XML_files/20190910_174';

var xpath = require('xpath'),
  dom = require('xmldom').DOMParser;

function readAllFiles() {
  let fileNames = getAllFilenamesInDir(pathToXMLDir);

  for (let a = 0; a < fileNames.length; a++) {
    let pathToCurrentXMLFILE = `${pathToXMLDir}/${fileNames[a]}`;
    let xml = fs.readFileSync(pathToCurrentXMLFILE, 'utf8');
    xml2 = xml.replace(/xmlns=\"(.*?)\"/g, '');
    var doc = new dom().parseFromString(xml2);

    let languages = getLanguages(doc);
    let allCpvCodes = getALLCPVCODES(doc);
    let IsDocumentBelongingToCategory = false;
    for (let a = 0; a < allCpvCodes.length; a++) {
      if (
        (allCpvCodes[a] > 48000000 && allCpvCodes[a] < 48999999) ||
        (allCpvCodes[a] > 72000000 && allCpvCodes[a] < 72999999)
      ) {
        IsDocumentBelongingToCategory = true;
      }
    }

    if (languages.includes('EN') && IsDocumentBelongingToCategory) {
      console.log('Document_ID: ' + getDocID(doc));
      console.log('\tNuts_CODES: ' + getNutsCode(doc));
      console.log('\tCountry: ' + getCountry(doc));
      console.log('\tPUBLICATION_DATE: ' + getPublicationDate(doc));
      console.log('\tFORM_TYPE: ' + getFormType(doc));
      console.log('\tMAIN_CPV_CODE: ' + getMainCPVCode(doc));
      console.log('\tALL_CPV_CODES; ' + getALLCPVCODES(doc));
      console.log('\tLanguage: ' + getLanguages(doc));
      console.log('\tTitle: ' + getTitle(doc));
      console.log('\tShort_DESC: ' + getShortDescription(doc));
      console.log('');
    } else {
    }
  }
}

readAllFiles();

function getAllFilenamesInDir(fp) {
  let filenames = fs.readdirSync(fp);
  return filenames;
}

//===== FUNCTIONS TO GET DATA ======

//get the main CPVCODE;
function getMainCPVCode(doc) {
  let cpvCodeValue;
  try {
    let cpvcode = xpath.select1(
      '/TED_EXPORT/CODED_DATA_SECTION/NOTICE_DATA/ORIGINAL_CPV/@CODE',
      doc
    ).value;
    cpvCodeValue = cpvcode;
  } catch (err) {}
  return cpvCodeValue;
}

//get Languages
function getLanguages(doc) {
  let avalibleLanguagesValue = ' ';
  try {
    let result = xpath.select(
      '/TED_EXPORT/TECHNICAL_SECTION/FORM_LG_LIST',
      doc
    );
    avalibleLanguagesValue = result[0].firstChild.data;
  } catch (err) {
    console.log('could find avalible languages with that xpath' + err);
  }
  return avalibleLanguagesValue;
}

//get the publication date
function getPublicationDate(doc) {
  let pubdateValue = '';

  try {
    let pubdate = xpath.select(
      '/TED_EXPORT/CODED_DATA_SECTION/REF_OJS/DATE_PUB',
      doc
    );
    pubdateValue = pubdate[0].firstChild.data;
  } catch (err) {
    console.log('could find publicationdate with that xpath');
  }
  return pubdateValue;
}

//get the form type
function getFormType(doc) {
  let formtypeValue1 = '';
  try {
    let formtype1 = xpath.select('//FORM_SECTION//*[@CATEGORY]', doc);
    formtypeValue1 = formtype1[0].localName;
  } catch (err) {
    console.log('Couldnt find formtype with that xpath');
  }
  return formtypeValue1;
}

//get all cpv-codes
//fungerar på alla utom oth(?);
function getALLCPVCODES(doc) {
  let arrayOfCPVCODES = [];
  try {
    let allCPVCODES = xpath.select('//*[CPV_CODE]', doc);
    for (let a = 0; a < allCPVCODES.length; a++) {
      arrayOfCPVCODES.push(allCPVCODES[a].firstChild.attributes[0].nodeValue);
    }
    const uniqueValues = new Set(arrayOfCPVCODES);
    arrayOfCPVCODES = [...uniqueValues];
  } catch (err) {}
  return arrayOfCPVCODES;
}

function getCountry(doc) {
  let countryToReturn;
  try {
    let country = xpath.select(
      '/TED_EXPORT[1]/CODED_DATA_SECTION[1]/NOTICE_DATA[1]/ISO_COUNTRY[1]',
      doc
    );

    countryToReturn = country[0].attributes[0].nodeValue;
  } catch (err) {}
  return countryToReturn;
}

function getTitle(doc) {
  let title = '';
  let formType = getFormType(doc);
  if (formType === 'OTH_NOT') {
    try {
      let result = xpath.select(
        '//FORM_SECTION//*[@CATEGORY and contains(@LG ,"EN")]//TI_DOC/P',
        doc
      );
      title = result[0].firstChild;
    } catch (err) {}
  } else {
    //FORM_SECTION//*[contains(@LG, 'EN')]//OBJECT_CONTRACT/TITLE/P
    try {
      let result = xpath.select(
        '//FORM_SECTION//*[contains(@LG, "EN")]//OBJECT_CONTRACT/TITLE/P',
        doc
      );
      title = result[0].firstChild;
    } catch (err) {}
  }
  return title;
}

function getShortDescription(doc) {
  let shortDescription = '';
  let formType = getFormType(doc);
  if (formType === 'OTH_NOT') {
  } else {
    try {
      let result = xpath.select(
        '//FORM_SECTION//*[contains(@LG, "EN")]//OBJECT_CONTRACT/SHORT_DESCR',
        doc
      );
      let childnodes = result[0].childNodes;

      for (let a = 0; a < childnodes.length; a++) {
        shortDescription = shortDescription + ' ' + childnodes[a].firstChild;
      }
    } catch (err) {}
    return shortDescription;
  }
}
function getNutsCode(doc) {
  let arrayOfNuts = [];
  try {
    let allNutsCode = xpath.select(
      "//NOTICE_DATA//*[contains(local-name(), 'NUTS')]",
      doc
    );

    for (let a = 0; a < allNutsCode.length; a++) {
      arrayOfNuts.push(allNutsCode[a].attributes[0].nodeValue);
    }

    const uniqueValues = new Set(arrayOfNuts);
    arrayOfNuts = [...uniqueValues];
  } catch (err) {
    console.log('fel' + err);
  }

  return arrayOfNuts;
}

function getDocID(doc) {
  let docID;
  try {
    docID = xpath.select1('/TED_EXPORT[1]/@DOC_ID', doc).value;
  } catch (err) {}
  return docID;
}
