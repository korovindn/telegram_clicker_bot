const { Telegraf, Markup, session, Scenes: { Stage } } = require('telegraf')
const config = require('../config.json') 

const bonusHandler = require('./src/handlers/bonusHandler')
const clickHandler = require('./src/handlers/clickHandler')
const ratingHandler = require('./src/handlers/ratingHandler')
const startHandler = require('./src/handlers/startHandler')

const editWithdrawScene = require('./src/scenes/editWithdrawScene')
const videoScene = require('./src/scenes/videoScene')
const superScene = require('./src/scenes/superScene')
const withdrawScene = require('./src/scenes/withdrawScene')
const profileScene = require('./src/scenes/profileScene')

const { mainKeyboard } = require('./src/keyboards')

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

    bot.on('text', async ctx => await ctx.reply(`Я тебя не понимаю!`))

    bot.launch()
    console.log('Бот запущен')
}

module.exports.initialize = initialize