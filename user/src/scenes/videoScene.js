const { Scenes: {BaseScene}, Markup } = require('telegraf')
const db = require('../../../db')
const { mainKeyboard, videoKeyboard } = require('../keyboards')

const videoScene = new BaseScene('videoScene')
videoScene.enter(async (ctx) => {
    try{
        const sites = await db.site.find()
        let number = Math.round(Math.random()*(sites.length - 1))
        await ctx.reply(`Внимание❗\nУсловия выполнения задания :\n1. Перейти по ссылке\n2. Находится на сайте не меньше 30 секунд\n(Сайт отслеживает время вашего нахождения)\n\n❗В случае нарушения одного из пунктов, с баланса будут изъяты заработанные средства❗\n\n${sites[number].link}`, Markup.keyboard(videoKeyboard).resize())
        ctx.session.watching = true
        videoTimeout = setTimeout(
            ()=>{
                ctx.session.watching = false
            }, 
            30000
        )
    } catch (e){
        console.log(e)
    }
})

videoScene.hears('Выполнил', async (ctx) => {
    try{
        if(ctx.session.watching){
            clearTimeout(videoTimeout)
            videoTimeout = setTimeout(
                ()=>{
                    ctx.session.watching = false
                }, 
                30000
            )
            await ctx.reply(`Вы провели на сайте недостаточно времени❗ Возвращайтесь на сайт`)
        } else {
            const user = await db.user.findOne({ id: ctx.from.id })
    
            await db.user.updateOne(
                {id: ctx.from.id},
                {
                    $set:{
                        balance: user.balance + 0.5,
                        videos: user.videos + 1,
                        points: user.points + 1
                    }
                }
            )
    
            await ctx.replyWithMarkdown(`💸 Просмотр засчитан.\nБаланс пополнен на *0.5 ₽*.\n💰Текущий баланс: *${(user.balance+0.5).toFixed(2)} ₽*\n💴 Доступно на вывод: *${(user.money).toFixed(2)} ₽*`, Markup.keyboard(mainKeyboard).resize())
            return ctx.scene.leave()
        }
    } catch (e){
        console.log(e)
    }
})

videoScene.hears('В начало', async (ctx) => {
    try{
        ctx.reply(`Главное меню:`, Markup.keyboard(mainKeyboard).resize())
        return ctx.scene.leave()
    } catch(e){
        console.log(e)
    }
})

module.exports = videoScene