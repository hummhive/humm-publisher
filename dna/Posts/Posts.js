'use strict';

function CreatePost(content) {
  var post = GetPostType(content.type);
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

function GetPostsByTag(tag) {
  var links = getLinks(App.Agent.Hash, tag, { Load: true })
  var posts=[];
  links.forEach(function (element){
    var linksObject={};
    linksObject.hash = element.Hash;
    linksObject.title = element.Entry.title;
    linksObject.content = element.Entry.content;
    linksObject.author = element.Entry.author;
    linksObject.timestamp = element.Entry.pubdate;
    posts.push(linksObject);
  });

  return posts;
}

function DeletePost(post) {
  var postType = GetPostType(post.type);

  remove(post.hash, post.message)

  commit(postType.link,{
    Links: [
      {
        Base: App.Agent.Hash,
        Link: post.hash,
        Tag: postType.type,
        LinkAction: HC.LinkAction.Del
      }
    ]
  });
  return post.hash;
}

function EditPost(post) {

  var postType = GetPostType(post.type); //the type who actioned the function
  var oldEntry = GetPost(post.hash);

  /* Check if the hash-string is valid before processing */
  /* TODO: Check if the hash-string contains a proper entry type */

  if (oldEntry !== HC.HashNotFound) {

    post.pubdate = new Date();
    post.author = App.Agent.String;

    var hash = update(
      oldEntry.type, //The original type assigned to the entry
      {
        title: post.title,
        content: post.content,
        pupdate: post.pubdate,
        type: post.type,
        author: post.author
      },
      post.hash
    );

    oldEntry.hash = post.hash;
    oldEntry.message = "Deleted"; //TODO: Better Reasons if Transition or Update

    DeletePost(oldEntry);

    commit(postType.link, {
      Links: [
        {
          Base: App.Agent.Hash,
          Link: hash,
          Tag: postType.type //new entry or same entry
        }
      ]
    });
    return "Post Edited!"
  }else{
    return "The hash you have introduced is not a valid!"
  }
}

// -----------------------------------------------------------------
//  Helper Functions
// -----------------------------------------------------------------

/*
* Create constants for handling the links and commits
* @param {string} postType - the type of entry, needs to be sent via POST
* @return {object} that contains the information needed for links
*/

function GetPostType(postType){
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
