'use strict';

function CreatePost(content) {
  var post = PostType(content.type);
  content.pubdate = new Date();
  content.author = App.Agent.String;
  var postHash = commit(post.type, content);
  commit(post.link,{Links:[{Base: App.Agent.Hash,Link: postHash,Tag: post.type}]});
  return postHash;
}

function GetPost(hash) {
  var post = get(hash)
  return post;
}

function GetPosts(postType) {
  var links = getLinks(App.Agent.Hash, postType, { Load: true})
  var posts=[];
  links.forEach(function (element){
    var linksObject={};
    linksObject.hash=element.Hash;
    linksObject.title=element.Entry.title
    linksObject.content=element.Entry.content
    linksObject.author=element.Entry.author
    linksObject.timestamp=element.Entry.pubdate
    posts.push(linksObject);
  });

  return posts;
}

function DeletePost(oldHash) {
  var post = PostType(oldHash.type);
  remove(oldHash.hash, oldHash.message)
  commit(post.link,{
    Links: [
      {
        Base: App.Agent.Hash,
        Link: oldHash.hash,
        Tag: post.type,
        LinkAction: HC.LinkAction.Del
      }
    ]
  });
  return true
}

function EditPost(oldHash) {
  var post = PostType(oldHash.type);
  oldHash.pubdate = new Date();
  oldHash.author = App.Agent.String;
  oldHash.message = "Deleted by Edit"; //message can be improved?
  var hash = update(post.type, {title: oldHash.title, content: oldHash.content, pupdate: oldHash.pubdate, author: oldHash.author }, oldHash.hash)

  DeletePost(oldHash)

  commit(post.link, {
    Links: [
      {
        Base: App.Agent.Hash,
        Link: hash,
        Tag: post.type
      }
    ]
  });
  
  return hash
}

// -----------------------------------------------------------------
//  Helper Functions
// -----------------------------------------------------------------

/*
* Create constants for handling the links and commits
* @param {string} postType - the type of entry, needs to be sent via POST
* @return {object} that contains the information needed for links
*/

function PostType(postType){
  var post = {};
  switch (postType)
  {
    case "draft":
    post.type = "draft";
    post.link = "draft_link";
    break;
    case "publish":
    post.type = "publish";
    post.link = "publish_link";
    break;
  }
  return post;
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
    case "draft":
    case "publish":
    case "draft_link":
    case "publish_link":
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
    case "draft":
    case "publish":
    case "draft_link":
    case "publish_link":
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
    case "draft":
    case "publish":
    case "draft_link":
    case "publish_link":
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
    case "draft":
    case "publish":
    case "draft_link":
    case "publish_link":
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
    case "draft":
    case "publish":
    case "draft_link":
    case "publish_link":
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
