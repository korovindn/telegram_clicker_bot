const { Telegram, Markup } = require('telegraf')
const db = require('../../../db')
const config = require('../../../config.json')
const bonus = require('../bonus')

const telegram = new Telegram(config.TOKEN)

const bonusHandler = async (ctx) => {
    try{
        const today = new Date().getDate()
        const user = await db.user.findOne({ id: ctx.from.id })

        if (user.lastBonus != today){
            let superTotal = 0
            const channels = await db.channel.find()
            for (let i=0; i<channels.length; i++){
                const member = await telegram.getChatMember(channels[i].link, ctx.from.id)
                if(!(user.channels.includes(channels[i].link)) && (member.status === 'left')){
                    superTotal = superTotal + 1
                }
            }
            if(user.videos>=10 && user.super>=superTotal){
                const bonusValue = bonus.calc() 
                await db.user.updateOne(
                    {id: ctx.from.id},
                    {
                        $set:{
                            money: user.money + bonusValue,
                            videos: 0,
                            super: 0,
                            lastBonus: today
                        }
                    }
                )
                await ctx.replyWithMarkdown(`💸 Бонус начислен.\nБаланс на вывод пополнен на *${bonusValue} ₽*.\n💰Текущий баланс: *${user.balance.toFixed(2)} ₽*\n💴 Доступно на вывод : *${(user.money+bonusValue).toFixed(2)} ₽*`)
            } else {
                const options = []
                if(10 - user.videos > 0){
                    options.push([Markup.button.callback(`Осталось видео: ${10 - user.videos}`, '0')])
                }
                if(superTotal - user.super > 0){
                    options.push([Markup.button.callback(`Осталось суперзаданий: ${superTotal - user.super}`, '1')])
                }
                ctx.reply('❗Чтобы получить "Бонус" нужно выполнить "Видео" минимум 10 раз и все ежедневные "Суперзадания"❗', Markup.inlineKeyboard(options))
            }

        } else if(user.bonusesToday > 0) {
            if (user.videos>=15){
                const bonusValue = bonus.calc() 
                await db.user.updateOne(
                    {id: ctx.from.id},
                    {
                        $set: {
                            money: user.money + bonusValue,
                            videos: 0,
                            bonusesToday: user.bonusesToday - 1
                        }
                    }
                )
                ctx.replyWithMarkdown(`💸 Бонус начислен.\nБаланс на вывод пополнен на *${bonusValue} ₽*.\n💰Текущий баланс: *${user.balance.toFixed(2)} ₽*\n💴 Доступно на вывод : *${(user.money+bonusValue).toFixed(2)} ₽*\nОсталось бонусов сегодня: *${user.bonusesToday - 1}*`)
            } else {
                ctx.reply(`До получения следующего бонуса осталось:`, Markup.inlineKeyboard([
                    Markup.button.callback(`${15-user.videos} видео`, '0')
                ]))
            }
        } else {
            ctx.reply(`Сегодня вы уже получили все бонусы❗ Возвращайтесь завтра`)
        }
    } catch (e){
        console.log(e)
    }
}

module.exports = bonusHandler