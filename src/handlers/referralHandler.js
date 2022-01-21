const db = require('../db')
const config = require('../../config.json')

const referralHandler = async (ctx) => {
    try{
        const referrals = await db.user.find({ referral: ctx.from.id })
        let reply = `🏦 Ваша реферальная ссылка https://t.me/${config.LINK}?start=${ctx.from.id}\n\n👨‍👨‍👦 Приглашенные пользователи:\n\n`
        for(let i=0; i<referrals.length; i++){
            reply = reply + `<b>${i+1}. ${referrals[i].name}</b> (id: ${referrals[i].id})\n`
        }
        await ctx.replyWithHTML(reply)
    } catch (e){
        console.log(e)
    }
}

module.exports = referralHandler