'use strict';

/* Define Constants */

var POSTS_TAG = "post";
var TAGS = "tags"
var POSTS_LINK = "post_link";
var TAGS_LINK = "tag_link";

/* Public Exposed Functions */

function CreatePost(content) {
  content.pubdate = new Date();
  content.author = App.Agent.String;
  var postHash = commit(POSTS_TAG, content);
  CreatePostLinks(content, postHash)
  if ("tags" in content){
  content.tags = JSON.parse(JSON.stringify(content.tags).replace(/"\s+|\s+"/g,'"'))
  CreateTags(content, postHash)
  }
  return postHash;
}

function getAgentInfo(){
  return App.Agent.String;
}

function GetPublicPosts(query) {
  var links = getLinks(anchor("posts", "public"), POSTS_TAG, { Load: true})
  var posts=[];
  links.forEach(function (element){
    var postsObject = {};
    postsObject.hash = element.Hash;
    postsObject.title = element.Entry.title;
    postsObject.content = element.Entry.content;
    postsObject.author = element.Entry.author;
    postsObject.status = element.Entry.status;
    postsObject.tags = element.Entry.tags;
    postsObject.pubdate = element.Entry.pubdate;
    posts.push(postsObject);
  });
  return posts;
}

/* Helpers Functions / Private - Non Exposed */

function GetPost(hash) {
  var post = get(hash, { GetMask: HC.GetMask.All })
  return post;
}

function CreatePostLinks(content, postHash){
    commit(POSTS_LINK,{Links:[{Base: anchor("posts", "public"),Link: postHash,Tag: POSTS_TAG}]});
}

function UnlinkPostFromTags(postHash){
  var post = GetPost(postHash)
  post.tags.forEach(function (element){
  commit(TAGS_LINK,{Links:[{Base: anchor("tags", element),Link: postHash,Tag: TAGS,LinkAction: HC.LinkAction.Del}]});
  })
}

function CreateTags(content, postHash){
  content.tags.forEach(function (tag){
    commit(TAGS_LINK,{Links:[{Base: anchor("tags", tag),Link: postHash,Tag:TAGS}]});
  })
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
    case POSTS_TAG:
    case POSTS_LINK:
    case TAGS_LINK:
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
    case POSTS_TAG:
    case POSTS_LINK:
    case TAGS_LINK:
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
    case POSTS_TAG:
    case POSTS_LINK:
    case TAGS_LINK:
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
  switch (entryName) {
    case POSTS_TAG:
    case POSTS_LINK:
    case TAGS_LINK:
    // be sure to consider many edge cases for validating
    // do not just flip this to true without considering what that means
    // the action will ONLY be successfull if this returns true, so watch out!
    return false;
    default:
    // invalid entry name
    return false;
  }
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
    case POSTS_TAG:
    case POSTS_LINK:
    case TAGS_LINK:
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
