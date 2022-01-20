const { Telegraf, Markup, session, Scenes: { Stage } } = require('telegraf')
const config = require('../config.json') 

const bonusHandler = require('./handlers/bonusHandler')
const clickHandler = require('./handlers/clickHandler')
const ratingHandler = require('./handlers/ratingHandler')
const startHandler = require('./handlers/startHandler')

const editWithdrawScene = require('./scenes/editWithdrawScene')
const videoScene = require('./scenes/videoScene')
const superScene = require('./scenes/superScene')
const withdrawScene = require('./scenes/withdrawScene')
const profileScene = require('./scenes/profileScene')

const { mainKeyboard } = require('./keyboards')

const bot = new Telegraf(config.TOKEN)

const stage = new Stage([videoScene, superScene, withdrawScene, profileScene, editWithdrawScene])

const initialize = () => {

    bot.use(session())
    bot.use(stage.middleware())

    bot.hears('Клик', async ctx => clickHandler(ctx))

    bot.hears('Видео', async ctx => await ctx.scene.enter('videoScene'))

    bot.hears('Суперзадание', async ctx => await ctx.scene.enter('superScene'))

    bot.hears('Вывод', async ctx => await ctx.scene.enter('withdrawScene'))

    bot.hears('Бонус', async ctx => bonusHandler(ctx))

    bot.hears('FAQ', async ctx => await ctx.reply(`Здесь что-то будет`))

    bot.hears('Профиль', async ctx => await ctx.scene.enter('profileScene'))

    bot.hears('Рейтинг', async ctx => ratingHandler(ctx))

    bot.hears('В начало', async ctx => await ctx.reply(`Главное меню:`, Markup.keyboard(mainKeyboard).resize()))

    bot.start(async ctx => startHandler(ctx))

    bot.launch()
    console.log('Бот запущен')
}

module.exports.initialize = initialize