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

    bot.hears('FAQ', async ctx => await ctx.replyWithMarkdown(`❓ Как заработать?\nЗаработать можно выполняя задания:\n💰 *Клик* — просто нажать кнопку —* 0.05 ₽*\n💰 *Видео* — перейти на сайт и провести там 30 секунд, взаимодействуя с рекламой — *0.5 ₽*\n💰 *Суперзадание* — подписаться на предложенный канал — *1 ₽*\n\n❓ Как вывести?\n🏦 Вывод доступен на кошельки платежных систем *QIWI* и *ЮMoney*.\n💴 Вывести деньги можно при наличии, как минимум, *50 ₽* на балансе, доступных к выводу.\n🎁 Баланс на вывод можно получить из бонусов, кроме того, вы получаете на баланс для вывода 10% от суммы выводов приглашенных по реферальной ссылке пользователей.\n\n❓ Какие бонусы существуют?\nЕжедневно каждому пользователю доступно *5 бонусов*:\n🎁 *1 бонус* — за выполнение всех суперзаданий и *10* заданий из категории *Видео*.\n🎁 *4 бонуса*  — за выполнение *15* заданий из категории *Видео*.\n💴 Размер бонуса случайный от *1* до *100 ₽*.\n🎁 Кроме того, каждый день выдается бонус *100 ₽* трем самым активным пользователям.\nУзнать свою позицию можно в разделе *Рейтинг*.\n\n*❗Бот не требует пополнения баланса❗*`))

    bot.hears('Профиль', async ctx => await ctx.scene.enter('profileScene'))

    bot.hears('Рейтинг', async ctx => ratingHandler(ctx))

    bot.hears('В начало', async ctx => await ctx.reply(`Главное меню:`, Markup.keyboard(mainKeyboard).resize()))

    bot.start(async ctx => startHandler(ctx))

    bot.on('text', async ctx => await ctx.reply(`Я тебя не понимаю!`))

    bot.launch()
    console.log('Бот запущен')
}

module.exports.initialize = initialize