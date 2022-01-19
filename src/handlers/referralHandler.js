const db = require('../db')
const config = require('../../config.json')

const referralHandler = async (ctx) => {
    try{
        const referrals = await db.user.find({ referral: ctx.from.id })
        let reply = `Ваша реферальная ссылка https://t.me/${config.LINK}?start=${ctx.from.id}`
        if(referrals.length>0){
            reply = reply + `\nВы пригласили:`
        } else {
            reply = reply + `\nВы ещё никого не пригласили`
        }
        for(let i=0; i<referrals.length; i++){
            reply = reply + `\n${i+1}. ${referrals[i].name} (id: ${referrals[i].id})`
        }
        await ctx.reply(reply)
    } catch (e){
        console.log(e)
    }
}

module.exports = referralHandler