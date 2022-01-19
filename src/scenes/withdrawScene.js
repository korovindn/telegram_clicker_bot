const { Telegram, Scenes: {BaseScene}, Markup } = require('telegraf')
const db = require('../db')
const { mainKeyboard, withdrawKeyboard, backHomeKeyboard } = require('../keyboards')
const payment = require('../payment')
const config = require ('../../config.json')

const telegram = new Telegram(config.TOKEN)

const withdrawScene = new BaseScene('withdrawScene')
withdrawScene.enter(async (ctx) => {
    const user = await db.user.findOne({ id: ctx.from.id })
    if(user.money>=50){
        if(user.account){
            await ctx.reply(`Доступно к выводу: ${user.money} ₽\nПриязан кошелек ${user.provider}: ${user.account}\nДля вывода введите сумму`,Markup.keyboard(withdrawKeyboard).resize())

        } else {
            await ctx.reply(`Доступно к выводу: ${user.money} ₽\nУкажите кошелек`,Markup.keyboard(backHomeKeyboard).resize())
            await ctx.scene.enter('editWithdrawScene')
        }
    } else {
        await ctx.reply(`Доступно к выводу: ${user.money} ₽\nВывод возможен от 50 ₽`, Markup.keyboard(mainKeyboard).resize())
        return ctx.scene.leave()
    }
})

withdrawScene.hears(/[0-9]/, async (ctx) => {
    const sum = Number(ctx.message.text)
    const user = await db.user.findOne({ id: ctx.from.id })
    if (sum>=50){
        if (sum <= user.money && sum <= user.balance){
        
            payment.send(user.provider, user.account, sum).then(async res => {
                if(res.transaction.state.code === 'Accepted'){
                    await ctx.reply(`Запрос на вывод ${sum} ₽ в направлении ${user.provider} (кошелек: ${user.account}) поступил в обработку\nОжидайте поступление в течение 24 часов.`, Markup.keyboard(mainKeyboard).resize())
                    await db.user.updateOne(
                        {id: ctx.from.id},
                        {
                            $set:{
                                money: user.money - sum,
                                balance: user.balance - sum
                            }
                        }
                    )
                    if(user.refferal){
                        const refferal = await db.user.findOne({ id: user.refferal })
                        await db.user.updateOne(
                            {id: user.refferal},
                            {
                                $set:{
                                    money: refferal.money + sum/10,
                                }
                            }
                        )
                        await telegram.sendMessage(user.refferal,`Получено ${sum/10} ₽ за вывод реферала ${user.name}\nБаланс на вывод: ${refferal.money + sum/10} ₽`)
                    }
                } else {
                    await ctx.reply(`Ошибка! Статус: ${res.transaction.state.code}\nЭто неопознанная ошибка. Обратитесь в техподдержку`, Markup.keyboard(mainKeyboard).resize())
                }
            }, async err => {
                await ctx.reply(`Ошибка! Ответ оператора: ${err.data.message}`, Markup.keyboard(mainKeyboard).resize())
            })
        } else {
            await ctx.reply(`На балансе недостаточно средств`, Markup.keyboard(mainKeyboard).resize())
        }
    } else {
        ctx.reply(`Вывод возможен от 50 ₽`, Markup.keyboard(mainKeyboard).resize())
    }
    return ctx.scene.leave()
})

withdrawScene.hears('В начало', async (ctx) => {
    ctx.reply(`Главное меню:`, Markup.keyboard(mainKeyboard).resize())
    return ctx.scene.leave()
})

withdrawScene.hears('Изменить кошелек', async (ctx) => {
    await ctx.scene.enter('editWithdrawScene')
})

module.exports = withdrawScene