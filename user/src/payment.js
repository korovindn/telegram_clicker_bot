const { Personal, Currency } = require("qiwi-sdk")
const config = require("../../config.json")

const qiwi = new Personal(config.QIWI)

async function sendPayment(method, account, amount, commentText) {
    let provider = 0
    if (method === 'qiwi'){
        provider = 99
        console.log('qiwi')
    }
    else if (method === 'yoomoney'){
        provider = 26476
    }
    else{
        return('incorrect method')
    }
    const commission = await qiwi.getCommission(provider, account, amount)
    
    return await qiwi.pay2({
        amount: amount - commission,
        account,
        provider,
        currency: Currency.RUB,
        comment: commentText
    })
}

module.exports = {
    send: sendPayment,
}