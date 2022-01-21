const { Scenes: {BaseScene}, Markup } = require('telegraf')
const db = require('../db')
const referralHandler = require('../handlers/referralHandler')
const { mainKeyboard, profileKeyboard } = require('../keyboards')

const profileScene = new BaseScene('profileScene')
profileScene.enter(async (ctx) => {
    try {
        const user = await db.user.findOne({ id: ctx.from.id })
        let reply = `Ваш профиль: \n\n👤 ${user.name} \n💰Текущий баланс: <b>${(user.balance).toFixed(2)} ₽</b> \n💴 Доступно на вывод: <b>${user.money} ₽</b> \n💯 Очков рейтинга: <b>${user.points}</b>`
        if(user.account){
            reply = reply + `\n💳 Приязанный кошелек <b>${user.provider.charAt(0).toUpperCase() + user.provider.slice(1)}</b>: <b>${user.account}</b>`
        }
        const referrals = await db.user.find({ referral: ctx.from.id })
        if(referrals.length){
            reply = reply + `\n\n👨‍👨‍👦 Приглашенных пользователей: <b>${referrals.length}</b>\n💵 Заработано с рефералов: <b>${user.fromReferrals}</b> `
        }
        ctx.replyWithHTML(reply, Markup.keyboard(profileKeyboard).resize())
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