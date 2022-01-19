const db = require('../db')

const ratingHandler = async (ctx) => {
    try{
        const user = await db.user.findOne({ id: ctx.from.id })
        const rating = await db.user.find().sort({points: -1}).limit(10)
        const all = await db.user.find().sort({points: -1})
        let position = 0
        for (let i=0; i<all.length; i++){
            if(all[i].id === user.id){
                position = i + 1
            }
        }
        let reply = `Топ-10 пользователей за сегодня:\n`
        for (let i=0; i<rating.length; i++){
            reply = reply + `\n${i+1}. ${rating[i].name} (id: ${rating[i].id}) — ${rating[i].points}`
        }
        reply = reply + `\n\nВаше место: ${position}`
        await ctx.reply(reply)
    } catch (e){
        console.log(e)
    }
}

module.exports = ratingHandler