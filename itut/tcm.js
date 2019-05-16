var tcl;

module.exports = {
  setTcl: function(tclObj){
    tcl = tclObj;
  },
  searchEntity: function(did) {
    if ('@context' in tcl && tcl['@context'] == 'itut-tcm/v1') {
      let arr = tcl['tcl'];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].src != 'this') {
          //// TODO: go look at the remote source
        } else {
          if (arr[i].did == did) {
            return arr[i].ent
          }
        }
      }
    } else {
      console.log('version of tcm not recognized')
      return null
    }
    return null
  }
}
