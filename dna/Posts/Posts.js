'use strict';

/* Define Constants */
var POST_TAG = "post";
var POST_LINK = "post_link";

/* Public Exposed Functions */

function CreatePost(content) {
  content.pubdate = new Date();
  content.author = App.Agent.String;
  var postHash = commit(POST_TAG, content);
  commit(POST_LINK,{Links:[{Base: App.Agent.Hash,Link: postHash,Tag: POST_TAG}]});
  if(content.status == "publish"){ //This should be a default until we get a licensing system
  commit(POST_LINK,{Links:[{Base: anchor("posts", "public"),Link: postHash,Tag: POST_TAG}]});
  }
  return postHash;
}

function GetPost(hash) {
  var post = get(hash)
  return post;
}

function GetPublicPosts(param) {

  var links = getLinks(anchor("posts", "public"), POST_TAG, { Load: true})

  var posts=[];

  links.forEach(function (element){
    var linksObject={};
    if(element.Entry.status == status){
      linksObject.hash = element.Hash;
      linksObject.title = element.Entry.title;
      linksObject.content = element.Entry.content;
      linksObject.author = element.Entry.author;
      linksObject.status = element.Entry.status;
      linksObject.timestamp = element.Entry.pubdate;
      posts.push(linksObject);
    }
  });

  return posts;
}

function GetPostsByStatus(status, condition) {

  var links = getLinks(App.Agent.Hash, POST_TAG, { Load: true})

  var posts=[];

  links.forEach(function (element){
    var linksObject={};
    if(element.Entry.status == status){
      linksObject.hash = element.Hash;
      linksObject.title = element.Entry.title;
      linksObject.content = element.Entry.content;
      linksObject.author = element.Entry.author;
      linksObject.status = element.Entry.status;
      linksObject.timestamp = element.Entry.pubdate;
      posts.push(linksObject);
    }
  });

  return posts;
}

function DeletePost(post) {
  if(post.status !== "trash"){
    var oldEntry = GetPost(post.hash);
    oldEntry.hash = post.hash;
    oldEntry.status = "trash";
    oldEntry.message = "Sent to the Trash";
    oldEntry.lastupdate = new Date();
    EditPost(oldEntry);
  }else{
    commit(POST_LINK,{
      Links: [
        {
          Base: App.Agent.Hash,
          Link: post.hash,
          Tag: POST_TAG,
          LinkAction: HC.LinkAction.Del
        }
      ]
    });
  }
  return post.hash;
}

function EditPost(post) {

  var oldEntry = GetPost(post.hash);

  /* Check if the hash-string is valid before processing */

  if (oldEntry !== HC.HashNotFound) {

    var hash = update(
      POST_TAG,
      {
        title: post.title,
        content: post.content,
        pupdate: oldEntry.pubdate,
        lastupdate: new Date(),
        status: post.status,
        author: oldEntry.author
      },
      post.hash
    );

    DeletePost(post);

    commit(POST_LINK, {
      Links: [
        {
          Base: App.Agent.Hash,
          Link: hash,
          Tag: POST_TAG
        }
      ]
    });

    if(post.status == "publish"){
      commit(POST_LINK,{Links:[{Base: anchor("posts", "public"),Link: hash,Tag: POST_TAG}]});
    }

    return "Post Edited!"
  }else{
    return "The hash you have introduced is not a valid!"
  }
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

function bridgeGenesis() {
  return true
}

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
    case POST_TAG:
    case POST_LINK:
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
    case POST_TAG:
    case POST_LINK:
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
    case POST_TAG:
    case POST_LINK:
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
    case POST_TAG:
    case POST_LINK:
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
    case POST_TAG:
    case POST_LINK:
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
