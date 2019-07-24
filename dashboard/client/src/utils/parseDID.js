export function parseDID(did) {
  if (did === '') throw new Error('Missing DID')
  const sections = did.match(/^did:([a-zA-Z0-9_]+):([[a-zA-Z0-9_.-]+)(\/[^#]*)?(#.*)?$/)
  if (sections) {
      const parts = { did: sections[0], method: sections[1], id: sections[2] }
      if (sections[3]) parts.path = sections[3]
      if (sections[4]) parts.fragment = sections[4].slice(1)
      return parts
  }
  throw new Error(`Invalid DID ${did}`)
}

export function parseDIDDOcumentForDelegates(doc){
  let delegates = {
    authentication: [],
    statusRegMgmt: [],
    tcmMgmt: []
  }
  if(doc.authentication){
    doc.authentication.map(delegate => {
      var parsed = parseDID(delegate.publicKey)
      delegates.authentication.push(parsed.id.toLowerCase())
    })
  }
  if(doc.statusRegMgmt){
    doc.statusRegMgmt.map(delegate => {
      delegates.statusRegMgmt.push(delegate.ethereumAddress.toLowerCase())
    })
  }
  if(doc.tcmMgmt){
    doc.tcmMgmt.map(delegate => {
      delegates.tcmMgmt.push(delegate.ethereumAddress.toLowerCase())
    })
  }

  return delegates
}