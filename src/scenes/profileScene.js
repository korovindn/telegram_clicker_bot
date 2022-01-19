const { Scenes: {BaseScene}, Markup } = require('telegraf')
const db = require('../db')
const referralHandler = require('../handlers/referralHandler')
const { mainKeyboard, profileKeyboard } = require('../keyboards')

const profileScene = new BaseScene('profileScene')
profileScene.enter(async (ctx) => {
    try {
        const user = await db.user.findOne({ id: ctx.from.id })
        let reply = `Ваш профиль:\n👤 ${user.name}\n 💰Текущий баланс: ${(user.balance).toFixed(2)} ₽\n💴 Доступно на вывод : ${user.money} ₽\nОчков за сегодня: ${user.points}`
        if(user.account){
            reply = reply + `\nПриязан кошелек ${user.provider}: ${user.account}`
        }
        ctx.reply(reply, Markup.keyboard(profileKeyboard).resize())
    } catch (e){
        console.log(e)
    }
})

profileScene.hears('Реферальная программа', async (ctx) => referralHandler(ctx))

profileScene.hears('Изменить кошелек', async (ctx) => await ctx.scene.enter('editWithdrawScene'))

profileScene.hears('В начало', async (ctx) => {
    try {
        ctx.reply(`Главное меню:`, Markup.keyboard(mainKeyboard).resize())
        return ctx.scene.leave()
    } catch (e) {
        console.log(e)
    }
})

module.exports = profileScene