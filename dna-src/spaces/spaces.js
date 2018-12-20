/* Define Constants */

const SPACE = 'space';
const SPACE_LINKS = 'space_links';

function newSpace(space) {
      const spaceHash = commit(SPACE, space);
      space.uuid = generateUUIDv4();
      //Create Space UUID (to identify space among others)
      commit(SPACE_LINKS, {Links: [{Base: anchor(SPACE, space.uuid), Link: spaceHash, Tag: SPACE}]});
      //Create Space and Link to User (for indexing)
      commit(SPACE_LINKS, {Links: [{Base: App.Agent.Hash, Link: spaceHash, Tag: SPACE}]});
      setRoomAdmin(space);
      call("membership","addMember",{"uuid":space.uuid,"agent_hash":App.Agent.Hash,"agent_key":App.Key.Hash});
      return space.uuid;
}

// Get Created Spaces
function getMySpaces() {
    const getSpacesbyAgent = getLinks(App.Agent.Hash, SPACE, {Load: true});
    const spaces = [];
    getSpacesbyAgent.forEach(element => {
      const spacesObject = {};
        spacesObject.hash = element.Hash;
        spacesObject.name = element.Entry.name;
        spaces.push(spacesObject);
    });
    return spaces;
}

function setRoomAdmin(space){
  commit("admin_link",{Links:[{Base:anchor(SPACE, space.uuid) ,Link:App.Agent.Hash, Tag:"admin"}]})
}

// UUIDv4 credit: https://gist.github.com/LeverOne/1308368
function generateUUIDv4(a, b) {
for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');
return b;
}

// -----------------------------------------------------------------
//  The Genesis Function https://developer.holochain.org/genesis
// -----------------------------------------------------------------

/**
* Called only when your source chain is generated
* @return {boolean} success
*/
function genesis () {
  return true;
}

// -----------------------------------------------------------------
//  Mixins
// -----------------------------------------------------------------

function anchor(anchorType, anchorText) {
  return call('anchors', 'anchor', {
    anchorType: anchorType,
    anchorText: anchorText
  }).replace(/"/g, '');
}

function anchorExists(anchorType, anchorText) {
  return call('anchors', 'exists', {
    anchorType: anchorType,
    anchorText: anchorText
  });
}

// -----------------------------------------------------------------
//  Validation functions for every change to the local chain or DHT
// -----------------------------------------------------------------

/**
* Called to validate any changes to the local chain or DHT
* @param {string} entryName - the type of entry
* @param {*} entry - the entry data to be set
* @param {object} header - header for the entry containing properties EntryLink, Time, and Type
* @param {*} pkg - the extra data provided by the validate[X]Pkg methods
* @param {object} sources - an array of strings containing the keys of any authors of this entry
* @return {boolean} is valid?
*/
function validateCommit (entryName, entry, header, pkg, sources) {
  switch (entryName) {
    case SPACE:
    case SPACE_LINKS:
    case 'admin_link':
    // be sure to consider many edge cases for validating
    // do not just flip this to true without considering what that means
    // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    default:
    // invalid entry name
      return false;
  }
}

/**
* Called to validate any changes to the local chain or DHT
* @param {string} entryName - the type of entry
* @param {*} entry - the entry data to be set
* @param {object} header - header for the entry containing properties EntryLink, Time, and Type
* @param {*} pkg - the extra data provided by the validate[X]Pkg methods
* @param {object} sources - an array of strings containing the keys of any authors of this entry
* @return {boolean} is valid?
*/
function validatePut (entryName, entry, header, pkg, sources) {
  switch (entryName) {
    case SPACE:
    case SPACE_LINKS:
    case 'admin_link':
    // be sure to consider many edge cases for validating
    // do not just flip this to true without considering what that means
    // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    default:
    // invalid entry name
      return false;
  }
}

/**
* Called to validate any changes to the local chain or DHT
* @param {string} entryName - the type of entry
* @param {*} entry - the entry data to be set
* @param {object} header - header for the entry containing properties EntryLink, Time, and Type
* @param {string} replaces - the hash for the entry being updated
* @param {*} pkg - the extra data provided by the validate[X]Pkg methods
* @param {object} sources - an array of strings containing the keys of any authors of this entry
* @return {boolean} is valid?
*/
function validateMod (entryName, entry, header, replaces, pkg, sources) {
  switch (entryName) {
    case SPACE:
    case SPACE_LINKS:
    case 'admin_link':
    // be sure to consider many edge cases for validating
    // do not just flip this to true without considering what that means
    // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    default:
    // invalid entry name
      return false;
  }
}

/**
* Called to validate any changes to the local chain or DHT
* @param {string} entryName - the type of entry
* @param {string} hash - the hash of the entry to remove
* @param {*} pkg - the extra data provided by the validate[X]Pkg methods
* @param {object} sources - an array of strings containing the keys of any authors of this entry
* @return {boolean} is valid?
*/
function validateDel (entryName, hash, pkg, sources) {
  return null;
}

/**
* Called to validate any changes to the local chain or DHT
* @param {string} entryName - the type of entry
* @param {string} baseHash - the hash of the base entry being linked
* @param {?} links - ?
* @param {*} pkg - the extra data provided by the validate[X]Pkg methods
* @param {object} sources - an array of strings containing the keys of any authors of this entry
* @return {boolean} is valid?
*/
function validateLink (entryName, baseHash, links, pkg, sources) {
  switch (entryName) {
    case SPACE:
    case SPACE_LINKS:
    case 'admin_link':
    // be sure to consider many edge cases for validating
    // do not just flip this to true without considering what that means
    // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    default:
    // invalid entry name
      return false;
  }
}

/**
* Called to get the data needed to validate
* @param {string} entryName - the name of entry to validate
* @return {*} the data required for validation
*/
function validatePutPkg (entryName) {
  return null;
}

/**
* Called to get the data needed to validate
* @param {string} entryName - the name of entry to validate
* @return {*} the data required for validation
*/
function validateModPkg (entryName) {
  return null;
}

/**
* Called to get the data needed to validate
* @param {string} entryName - the name of entry to validate
* @return {*} the data required for validation
*/
function validateDelPkg (entryName) {
  return null;
}

/**
* Called to get the data needed to validate
* @param {string} entryName - the name of entry to validate
* @return {*} the data required for validation
*/
function validateLinkPkg (entryName) {
  return null;
}
