const { Scenes: {BaseScene}, Markup, Telegram } = require('telegraf')
const db = require('../db')
const { mainKeyboard, superKeyboard } = require('../keyboards')
const config = require('../../config.json')

const telegram = new Telegram(config.TOKEN)

const superScene = new BaseScene('superScene')
superScene.enter(async (ctx) => {
    try{
        const user = await db.user.findOne({ id: ctx.from.id })
        const channels = await db.channel.find() 
        let notFound = true
        for (let i=0; i<channels.length; i++){
            console.log(await telegram.getChatMember(channels[i].link, ctx.from.id))
            const member = await telegram.getChatMember(channels[i].link, ctx.from.id)
            if(!(user.channels.includes(channels[i].link)) && (member.status === 'left')){
                await ctx.reply(`Внимание❗\nНельзя отписываться от телеграмм каналов.\nВ случае нарушения, с баланса пользователя будут сняты средства!`, Markup.keyboard(superKeyboard).resize())
                await ctx.reply(`Подпишитесь на канал ${channels[i].link}`)
                ctx.session.channel = channels[i].link
                notFound = false
                break
            }
        }
        if(notFound){
            await ctx.reply(`Нет доступных суперзаданий❗`, Markup.keyboard(mainKeyboard).resize())
            return ctx.scene.leave()
        }
    } catch (e){
        console.log(e)
    }
})

superScene.hears('Проверить', async (ctx) => {
    try{
        const user = await db.user.findOne({ id: ctx.from.id })
        console.log(ctx.session.channel)
        const member = await telegram.getChatMember(ctx.session.channel, ctx.from.id)
        if(member.status === 'member'){
            user.channels.push(ctx.session.channel)
            console.log(user.channels)
            await db.user.updateOne(
                {id: ctx.from.id},
                {
                    $set:{
                        balance: user.balance + 1,
                        super: user.super + 1,
                        channels: user.channels,
                        points: user.points + 1
                    }
                }
            )
            await ctx.reply(`💸 Суперзадание засчитано.\nБаланс пополнен на 1 ₽.\n💰Текущий баланс: ${(user.balance+1).toFixed(2)} ₽\n💴 Доступно на вывод : ${(user.money).toFixed(2)} ₽`, Markup.keyboard(mainKeyboard).resize())
            return ctx.scene.leave()
        } else {
            ctx.reply(`Задание не выполнено❗ Подпишитесь на канал`)
        }        
    } catch (e) {
        console.log(e)
    }
})

superScene.hears('В начало', async (ctx) => {
    try{
        ctx.reply(`Главное меню:`, Markup.keyboard(mainKeyboard).resize())
        return ctx.scene.leave()
    } catch (e){
        console.log(e)
    }
})

module.exports = superScene