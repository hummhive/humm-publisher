'use strict';
/* Define Constants */
var POSTS_TAG = "post";
var TAGS = "tags";
var POSTS_LINK = "post_link";
var TAGS_LINK = "tag_link";
/* Public Exposed Functions */
function CreatePost(content) {
    content.pubdate = new Date();
    content.author = App.Agent.String;
    content.tags = JSON.parse(JSON.stringify(content.tags).replace(/"\s+|\s+"/g, '"'));
    var postHash = commit(POSTS_TAG, content);
    CreatePostLinks(content, postHash);
    if ("tags" in content)
        CreateTags(content, postHash);
    return postHash;
}
function GetPublicPosts(query) {
    if (typeof query !== "undefined") {
        var links = getLinks(anchor("tags", query.tag), TAGS, { Load: true });
    }
    else {
        var links = getLinks(anchor("posts", "public"), POSTS_TAG, { Load: true });
    }
    var posts = [];
    links.forEach(function (element) {
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
function GetAgentInfo() {
    return { "name": App.Agent.String, "key": App.Key.Hash };
}
function GetPostsByStatus(status) {
    var getPostsbyAgent = getLinks(App.Agent.Hash, POSTS_TAG, { Load: true });
    var posts = [];
    getPostsbyAgent.forEach(function (element) {
        var postsObject = {};
        if (status === "any" || element.Entry.status === status) {
            postsObject.hash = element.Hash;
            postsObject.title = element.Entry.title;
            postsObject.content = element.Entry.content;
            postsObject.author = element.Entry.author;
            postsObject.status = element.Entry.status;
            postsObject.tags = element.Entry.tags;
            postsObject.pubdate = element.Entry.pubdate;
            posts.push(postsObject);
        }
    });
    return posts;
}
function DeletePost(post) {
    if (post.hash !== HC.HashNotFound) {
        if (post.prevState === "publish" || !("prevState" in post) && post.status === "publish")
            commit(POSTS_LINK, {
                Links: [
                    {
                        Base: anchor("posts", "public"),
                        Link: post.hash,
                        Tag: POSTS_TAG,
                        LinkAction: HC.LinkAction.Del
                    }
                ]
            });
        commit(POSTS_LINK, {
            Links: [
                {
                    Base: App.Agent.Hash,
                    Link: post.hash,
                    Tag: POSTS_TAG,
                    LinkAction: HC.LinkAction.Del
                }
            ]
        });
        UnlinkPostFromTags(post.hash);
        remove(post.hash, "post deleted by agent");
        return "Post Deleted";
    }
    else {
        return "Hash not found!";
    }
}
function EditPost(post) {
    if (post.hash !== HC.HashNotFound) {
        var prevState = get(post.hash);
        var newState = { title: post.title, content: post.content, author: post.author, tags: post.tags, status: post.status };
        post.prevState = prevState.status;
        try {
            var newPost = CreatePost(newState);
        }
        catch (exception) {
            debug("Error committing links " + exception);
            return post.hash;
        }
        DeletePost(post, prevState);
        return newPost;
    }
    else {
        return "The hash you have introduced is not a valid!";
    }
}
/* Helpers Functions / Private - Non Exposed */
function GetPost(hash) {
    var post = get(hash);
    return post;
}
function CreatePostLinks(content, postHash) {
    if (content.status === "publish")
        commit(POSTS_LINK, { Links: [{ Base: anchor("posts", "public"), Link: postHash, Tag: POSTS_TAG }] });
    commit(POSTS_LINK, { Links: [{ Base: App.Agent.Hash, Link: postHash, Tag: POSTS_TAG }] });
}
function UnlinkPostFromTags(postHash) {
    var post = GetPost(postHash);
    post.tags.forEach(function (element) {
        commit(TAGS_LINK, { Links: [{ Base: anchor("tags", element), Link: postHash, Tag: TAGS, LinkAction: HC.LinkAction.Del }] });
    });
}
function CreateTags(content, postHash) {
    content.tags.forEach(function (tag) {
        commit(TAGS_LINK, { Links: [{ Base: anchor("tags", tag), Link: postHash, Tag: TAGS }] });
    });
}
// -----------------------------------------------------------------
//  The Genesis Function https://developer.holochain.org/genesis
// -----------------------------------------------------------------
/**
* Called only when your source chain is generated
* @return {boolean} success
*/
function genesis() {
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
function validateCommit(entryName, entry, header, pkg, sources) {
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
function validatePut(entryName, entry, header, pkg, sources) {
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
function validateMod(entryName, entry, header, replaces, pkg, sources) {
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
function validateDel(entryName, hash, pkg, sources) {
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
function validateLink(entryName, baseHash, links, pkg, sources) {
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
function validatePutPkg(entryName) {
    return null;
}
/**
* Called to get the data needed to validate
* @param {string} entryName - the name of entry to validate
* @return {*} the data required for validation
*/
function validateModPkg(entryName) {
    return null;
}
/**
* Called to get the data needed to validate
* @param {string} entryName - the name of entry to validate
* @return {*} the data required for validation
*/
function validateDelPkg(entryName) {
    return null;
}
/**
* Called to get the data needed to validate
* @param {string} entryName - the name of entry to validate
* @return {*} the data required for validation
*/
function validateLinkPkg(entryName) {
    return null;
}
