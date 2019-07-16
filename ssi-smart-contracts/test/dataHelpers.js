module.exports = {
    bytes32toString: function (bytes32) {
        return Buffer.from(bytes32.slice(2), 'hex')
            .toString('utf8')
            .replace(/\0+$/, '')
    },
    stringToBytes32: function (str) {
        const buffstr =
            '0x' +
            Buffer.from(str)
            .slice(0, 32)
            .toString('hex')
        return buffstr + '0'.repeat(66 - buffstr.length)
    }
}