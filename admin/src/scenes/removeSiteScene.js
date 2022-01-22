const { Scenes: {BaseScene}, Markup } = require('telegraf')
const db = require('../../../db')

const siteScene = new BaseScene('removeSiteScene')
siteScene.enter(async (ctx) => {
    await ctx.reply(`Удаление сайта\nВведите URL:`, Markup.keyboard([['В начало']]).resize())
})

siteScene.hears('В начало', async (ctx) => {
    await ctx.reply(`Главное меню:`, Markup.keyboard([['Добавить сайт', 'Удалить сайт', 'Все сайты'],['Добавить канал', 'Удалить канал', 'Все каналы']]).resize())
    return ctx.scene.leave()
})

siteScene.hears(/((http|https)\:\/\/)?[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z0-9\&\.\/\?\:@\-_=#])*/, async (ctx) => {
    if(await db.site.findOne({ link: ctx.message.text })){
        await db.site.deleteOne({ link: ctx.message.text })
        await ctx.reply(`Сайт ${ctx.message.text} удален!`,Markup.keyboard([['Добавить сайт', 'Удалить сайт', 'Все сайты'],['Добавить канал', 'Удалить канал', 'Все каналы']]).resize())
        return ctx.scene.leave()
    } else {
    await ctx.reply(`Такого сайта нет в базе!`)
    }
})

siteScene.on('text', async (ctx) => {
    await ctx.reply(`Некорректный URL!`)
})

module.exports = siteScene