const { Telegraf, Markup, session, Scenes: { Stage }  } = require('telegraf')
const config = require('../config.json')
const db = require('../db')

const addChannelScene = require('./src/scenes/addChannelScene')
const addSiteScene = require('./src/scenes/addSiteScene')
const removeChannelScene = require('./src/scenes/removeChannelScene')
const removeSiteScene = require('./src/scenes/removeSiteScene')

const bot = new Telegraf(config.TOKEN_ADMIN)

const stage = new Stage([addChannelScene, addSiteScene, removeSiteScene, removeChannelScene])

const initialize = () => {

    bot.use(session())
    bot.use(stage.middleware())

    bot.start(async ctx => {
        if (config.ADMIN_LIST.includes(ctx.from.username)){
            ctx.reply(`Привет!`, Markup.keyboard([['Добавить сайт', 'Удалить сайт', 'Все сайты'],['Добавить канал', 'Удалить канал', 'Все каналы']]).resize())
        } else {
            ctx.reply('Доступ запрещен!')
        }
    })

    bot.hears('Добавить сайт', async ctx => {
        if (config.ADMIN_LIST.includes(ctx.from.username)){
            await ctx.scene.enter('addSiteScene')
        } else {
            ctx.reply('Доступ запрещен!')
        }
    })
    bot.hears('Удалить сайт', async ctx => {
        if (config.ADMIN_LIST.includes(ctx.from.username)){
            await ctx.scene.enter('removeSiteScene')
        } else {
            ctx.reply('Доступ запрещен!')
        }
    })
    bot.hears('Все сайты', async ctx => {
        if (config.ADMIN_LIST.includes(ctx.from.username)){
            const sites = await db.site.find()
            let reply = `Сайты:\n`
            for(let i=0; i< sites.length; i++){
                reply = reply + `${i+1}. ${sites[i].link}\n`
            }
            ctx.reply(reply)
        } else {
            ctx.reply('Доступ запрещен!')
        }
    })

    bot.hears('Добавить канал', async ctx => {
        if (config.ADMIN_LIST.includes(ctx.from.username)){
            await ctx.scene.enter('addChannelScene')
        } else {
            ctx.reply('Доступ запрещен!')
        }
    })
    bot.hears('Удалить канал', async ctx => {
        if (config.ADMIN_LIST.includes(ctx.from.username)){
            await ctx.scene.enter('removeChannelScene')
        } else {
            ctx.reply('Доступ запрещен!')
        }
    })
    bot.hears('Все каналы', async ctx => {
        if (config.ADMIN_LIST.includes(ctx.from.username)){
            const channels = await db.channel.find()
            let reply = `Каналы:\n`
            for(let i=0; i< channels.length; i++){
                reply = reply + `${i+1}. ${channels[i].link}\n`
            }
            ctx.reply(reply)
        } else {
            ctx.reply('Доступ запрещен!')
        }
    })

    bot.hears('В начало', async (ctx) => ctx.reply(`Главное меню:`, Markup.keyboard([['Добавить сайт', 'Удалить сайт', 'Все сайты'],['Добавить канал', 'Удалить канал', 'Все каналы']]).resize()))


    bot.launch()
    console.log('Админский бот запущен')
}

module.exports = {initialize: initialize}