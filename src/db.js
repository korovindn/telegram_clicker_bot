const mongoose = require("mongoose")
const config = require("../config.json")

async function initialize(){
    await mongoose.connect(config.MONGO, {useNewUrlParser: true, useUnifiedTopology: true})
    console.log('База данных подключена')
}

const user = mongoose.model('user', { 
    id: Number,
    name: String,
    balance: Number,
    money: Number,
    videos: Number,
    super: Number,
    points: Number,
    channels: [ String ],
    lastBonus: Number,
    bonusesToday: Number,
    provider: String,
    account: String,
    referral: Number,
    fromReferrals: Number
})

const channel = mongoose.model('chanel', { 
    link: String
})

const site = mongoose.model('site', { 
    id: Number,
    link: String
})

module.exports = {
    mongoose: mongoose,
    initialize: initialize,
    user: user,
    channel: channel,
    site: site
}