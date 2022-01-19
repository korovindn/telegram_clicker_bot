const { Scenes: {BaseScene}, Markup } = require('telegraf')
const db = require('../db')
const referralHandler = require('../handlers/referralHandler')
const { mainKeyboard, profileKeyboard } = require('../keyboards')

const profileScene = new BaseScene('profileScene')
profileScene.enter(async (ctx) => {
    const user = await db.user.findOne({ id: ctx.from.id })
    ctx.reply(`Ваш профиль:\n👤 ${user.name}\n 💰Текущий баланс: ${(user.balance).toFixed(2)} ₽\n💴 Доступно на вывод : ${user.money} ₽\nОчков за сегодня: ${user.points}\nПриязан кошелек ${user.provider}: ${user.account}`, Markup.keyboard(profileKeyboard).resize())
})

profileScene.hears('Реферальная программа', async (ctx) => referralHandler(ctx))

profileScene.hears('Изменить кошелек', async (ctx) => await ctx.scene.enter('editWithdrawScene'))

profileScene.hears('В начало', async (ctx) => {
    ctx.reply(`Главное меню:`, Markup.keyboard(mainKeyboard).resize())
    return ctx.scene.leave()
})

module.exports = profileScene