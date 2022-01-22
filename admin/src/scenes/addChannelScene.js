const { Scenes: {BaseScene}, Markup } = require('telegraf')
const db = require('../../../db')

const channelScene = new BaseScene('addChannelScene')
channelScene.enter(async (ctx) => {
    await ctx.reply(`Добавление канала\nВведите линк:`, Markup.keyboard([['В начало']]).resize())
})

channelScene.hears('В начало', async (ctx) => {
    await ctx.reply(`Главное меню:`, Markup.keyboard([['Добавить сайт', 'Удалить сайт', 'Все сайты'],['Добавить канал', 'Удалить канал', 'Все каналы']]).resize())
    return ctx.scene.leave()
})

channelScene.hears(/@[A-Z0-9-]/i, async (ctx) => {
    if(!(await db.channel.findOne({ link: ctx.message.text }))){
        const newChannel = new db.channel({
            link: ctx.message.text
        })
        newChannel.save()
        await ctx.reply(`Канал ${ctx.message.text} добавлен!\n\nНе забудьте добавить основного бота в качесте администратора!`,Markup.keyboard([['Добавить сайт', 'Удалить сайт', 'Все сайты'],['Добавить канал', 'Удалить канал', 'Все каналы']]).resize())
        return ctx.scene.leave()
    } else {
    await ctx.reply(`Такой канал уже есть в базе!`)
    }
})

channelScene.on('text', async (ctx) => {
    await ctx.reply(`Некорректный линк!`)
})

module.exports = channelScene