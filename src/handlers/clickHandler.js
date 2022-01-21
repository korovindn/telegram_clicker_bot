const db = require('../db')

const clickHandler = async (ctx) => {
    try{
        if(ctx.session.clicked){
            await ctx.reply(`❗Функция доступна раз в 2 секунды. Не кликайте так часто`)
        } else {
            ctx.session.clicked = true
            setTimeout(
                ()=>{
                    ctx.session.clicked = false
                }, 
                2000
            )

            const user = await db.user.findOne({ id: ctx.from.id })

            await db.user.updateOne(
                {id: ctx.from.id},
                {
                    $set:{
                        balance: user.balance + 0.05,
                    }
                }
            )
    
            await ctx.replyWithMarkdown(`💸 Клик засчитан\nБаланс пополнен на *0.05 ₽*\n💰Текущий баланс: *${(user.balance+0.05).toFixed(2)} ₽*\n💴 Доступно на вывод: *${user.money.toFixed(2)} ₽*`)
        }
    } catch (e){
        console.log(e)
    }
}

module.exports = clickHandler