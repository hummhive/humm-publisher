// Authorize a new agent_id to participate in this holochain
// agent_id must match the string they use to "hc init" their holochain, and is currently their email by convention
//@param : {room_name:"",agent_hash:"",agent_key:""}

function addMember(space) {
    key = commit("membership_link", {Links:[{Base:anchor('space', space.uuid), Link: space.agent_hash, Tag: "members"}]});
    send(space.agent_key, {"type":"add_space","uuid": space.uuid});
    return key;
}

function receive(from, msg) {
  if (msg.type=="add_space") {
    return addRoomToMembersLocalChain(msg.uuid);
  }
  return "unknown type"
}

// TODO: Needs validation - Check if uses is a member of the room
//@param : room_name:"
function addRoomToMembersLocalChain(uuid){
  debug("Adding Space to Local Chain: " + uuid)
  key=commit("local_space", uuid);
  commit("local_membership_link",{Links:[{Base:App.Agent.Hash, Link:key,Tag:"my_local_spaces"}]});
  return key;
}


//@param : {room_name:""}
function getMembers(uuid){
  if(anchorExists('space', uuid) === "true"){
    members = getLinks(anchor('space', uuid), "members",{Load:true});
    var return_members;
    var i_Am_A_Member=false;
      members.forEach(function (element){
        if(element.Hash==App.Agent.Hash)
          i_Am_A_Member=true;
        return_members=element.Hash;
      });
      if(i_Am_A_Member){
          return return_members;
      }else{
        return "ERROR: You are not a Member of this space";
      }
  }else{
    return "ERROR: Space Not Found";
  }
}


/*----------  Anchor API  ----------*/

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

/*----------Validation Functions-----------*/

function isRegisteredAdmin(entry_type,entry,header,sources){

  admins=getLinks(entry.Links[0].Base,"admin",{Load:true});
  for(i=0;i<admins.length;i++){
    debug(sources+" == "+admins[i].Source)
    if(sources==admins[i].Source){
      debug("Valid Registered User : "+admins[i].Source);
      return true
    }
  }
  return false;
}

function isValidRoom(hash) {
  debug("Checking if " +hash+ " is a valid...")
  var spaceuuid = get(hash).anchorText;
  var space = getLinks(anchor('space', spaceuuid), "space",{Load:true});
  debug("Space: " + JSON.stringify(space))
  if( space instanceof Error ){
      return false
  } else {
      if(typeof space[0].Entry.name !== 'undefined'){
      debug("Space "+spaceuuid+" is Valid . . ")
      return true
    }
    return false
  }
  return true;
}
// Initialize by adding agent to holochain
function genesis() {
    return true;
}

function validatePut(entry_type,entry,header,pkg,sources) {
    return validate(entry_type,entry,header,sources);
}
function validateCommit(entry_type,entry,header,pkg,sources) {
    return validate(entry_type,entry,header,sources);
}
// Local validate an entry before committing ???
function validate(entry_type,entry,header,sources) {
  debug("entry_type:"+entry_type+"entry"+JSON.stringify(entry)+"header"+header+"sources"+sources);
  if(entry_type=="membership_link"){
    return isRegisteredAdmin(entry_type,entry,header,sources);
  }
  if(entry_type=="local_space"){
      return true;
  }
  return true;
}

function validateLink(linkingEntryType,baseHash,linkHash,tag,pkg,sources){
  debug("LinkingEntry_type:"+linkingEntryType+" baseHash:"+baseHash+" linkHash:"+JSON.stringify(linkHash)+" tag:"+tag+" pkg:"+pkg+" sources:"+sources);
  if(linkingEntryType=="membership_link")
    return isValidRoom(baseHash);
  if(linkingEntryType=="local_membership_link")
    return true;
    
  return false;
}
function validateMod(entry_type,hash,newHash,pkg,sources) {return true;}
function validateDel(entry_type,hash,pkg,sources) {return true;}
function validatePutPkg(entry_type) {return null}
function validateModPkg(entry_type) { return null}
function validateDelPkg(entry_type) { return null}
function validateLinkPkg(entry_type) { return null}
