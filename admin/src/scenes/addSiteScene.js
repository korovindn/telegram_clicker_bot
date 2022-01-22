const { Scenes: {BaseScene}, Markup } = require('telegraf')
const db = require('../../../db')

const siteScene = new BaseScene('addSiteScene')
siteScene.enter(async (ctx) => {
    await ctx.reply(`Добавление сайта\nВведите URL:`, Markup.keyboard([['В начало']]).resize())
})

siteScene.hears('В начало', async (ctx) => {
    await ctx.reply(`Главное меню:`, Markup.keyboard([['Добавить сайт', 'Удалить сайт', 'Все сайты'],['Добавить канал', 'Удалить канал', 'Все каналы']]).resize())
    return ctx.scene.leave()
})

siteScene.hears(/((http|https)\:\/\/)?[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z0-9\&\.\/\?\:@\-_=#])*/g, async (ctx) => {
    if(!(await db.site.findOne({ link: ctx.message.text }))){
        const newSite = new db.site({
            link: ctx.message.text
        })
        newSite.save()
        ctx.reply(`Сайт ${ctx.message.text} добавлен!`, Markup.keyboard([['Добавить сайт', 'Удалить сайт', 'Все сайты'],['Добавить канал', 'Удалить канал', 'Все каналы']]).resize())
    return ctx.scene.leave()
    } else {
    await ctx.reply(`Такой сайт уже есть в базе!`)
    }
})

siteScene.on('text', async (ctx) => {
    await ctx.reply(`Некорректный URL!`)
})

module.exports = siteScene