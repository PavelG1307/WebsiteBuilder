module.exports.getHashId = () => {
    return Math.random().toString(36).slice(2, 12)
}