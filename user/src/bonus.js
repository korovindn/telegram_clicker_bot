const calc = () => {
    const randomPercent = Math.round(Math.random()*(100))

    if (randomPercent >= 0 && randomPercent < 1){
        return Math.round(Math.random()*(14-1)+1)
    }
    else if (randomPercent >= 1 && randomPercent < 98) {
        return Math.round(Math.random()*(24-15)+15)
    }
    else if (randomPercent >= 98){
        return Math.round(Math.random()*(100-25)+25)
    }
}

module.exports.calc = calc