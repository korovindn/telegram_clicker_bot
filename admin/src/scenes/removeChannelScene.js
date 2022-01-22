const { Scenes: {BaseScene}, Markup } = require('telegraf')
const db = require('../../../db')

const channelScene = new BaseScene('removeChannelScene')
channelScene.enter(async (ctx) => {
    ctx.reply(`Удаление канала\nВведите линк:`, Markup.keyboard([['В начало']]).resize())
})

channelScene.hears('В начало', async (ctx) => {
    ctx.reply(`Главное меню:`, Markup.keyboard([['Добавить сайт', 'Удалить сайт', 'Все сайты'],['Добавить канал', 'Удалить канал', 'Все каналы']]).resize())
    return ctx.scene.leave()
})

channelScene.hears(/@[A-Z0-9-]/i, async (ctx) => {
    if(await db.channel.findOne({ link: ctx.message.text })){
        await db.channel.deleteOne({ link: ctx.message.text })
        await ctx.reply(`Канал ${ctx.message.text} удален!`,Markup.keyboard([['Добавить сайт', 'Удалить сайт', 'Все сайты'],['Добавить канал', 'Удалить канал', 'Все каналы']]).resize())
        return ctx.scene.leave()
    } else {
    await ctx.reply(`Такого канала нет в базе!`)
    }
})

channelScene.on('text', async (ctx) => {
    ctx.reply(`Некорректный линк!`)
})

module.exports = channelScene