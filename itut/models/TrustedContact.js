function TrustedContact(src, did, entity) {
    this.src = src || null;
    this.did  = did  || null;
    this.entity  = did  || null;
}

function TrustedContact(obj) {
    this.src = obj.src || null;
    this.did  = obj.did  || null;
    this.entity  = obj.did  || null;
}

TrustedContact.prototype.getSrc = function() {
    return this.src;
}

TrustedContact.prototype.setSrc = function(src) {
    this.src = src;
}

TrustedContact.prototype.getDid = function() {
    return this.did;
}

TrustedContact.prototype.setDid = function(did) {
    this.did = did;
}

TrustedContact.prototype.getEntity = function() {
    return this.entity;
}

TrustedContact.prototype.setEntity = function(did) {
    this.entity = entity;
}

TrustedContact.prototype.equals = function(otherTrustedContact) {
    return otherTrustedContact.getDid() == this.getDid()
        && otherTrustedContact.getSrc() == this.getSrc()
        && otherTrustedContact.getEntity() == this.getEntity();
}

;
