const { Telegram, Scenes: {BaseScene}, Markup } = require('telegraf')
const db = require('../../../db')
const { mainKeyboard, withdrawKeyboard, backHomeKeyboard } = require('../keyboards')
const payment = require('../payment')
const config = require ('../../../config.json')

const telegram = new Telegram(config.TOKEN)
let paymentCounter = 1

const withdrawScene = new BaseScene('withdrawScene')
withdrawScene.enter(async (ctx) => {
    try {
        const user = await db.user.findOne({ id: ctx.from.id })
        if(user.money>=50){
            if(user.account){
                await ctx.replyWithMarkdown(`💴 Доступно к выводу: *${user.money} ₽*\nПриязан кошелек *${user.provider.charAt(0).toUpperCase() + user.provider.slice(1)}*: *${user.account}*\nДля вывода введите сумму`,Markup.keyboard(withdrawKeyboard).resize())
    
            } else {
                await ctx.replyWithMarkdown(`💴 Доступно к выводу: *${user.money} ₽*\n❗Укажите кошелек`,Markup.keyboard(backHomeKeyboard).resize())
                await ctx.scene.enter('editWithdrawScene')
            }
        } else {
            await ctx.replyWithMarkdown(`💴 Доступно к выводу: *${user.money} ₽*\n❗Вывод возможен от 50 ₽`, Markup.keyboard(mainKeyboard).resize())
            return ctx.scene.leave()
        }
    } catch (e){
        console.log(e)
    }
})

withdrawScene.hears(/[0-9]/, async (ctx) => {
    try{
        const sum = Number(ctx.message.text)
        const user = await db.user.findOne({ id: ctx.from.id })
        if (sum>=50){
            if (sum <= user.money && sum <= user.balance){
                let comment = `Вывод ${paymentCounter}`
                payment.send(user.provider, user.account, sum, comment).then(async res => {
                    if(res.transaction.state.code === 'Accepted'){
                        await ctx.replyWithMarkdown(`Запрос на вывод *${sum} ₽*\n🏦 Платежная система: *${user.provider.charAt(0).toUpperCase() + user.provider.slice(1)}*\n💳 Номер кошелька: *${user.account}*\n\n❗Ожидайте поступление в течение 24 часов❗`, Markup.keyboard(mainKeyboard).resize())
                        paymentCounter = paymentCounter + 1
                        await db.user.updateOne(
                            {id: ctx.from.id},
                            {
                                $set:{
                                    money: user.money - sum,
                                    balance: user.balance - sum
                                }
                            }
                        )
                        if(user.referral){
                            const referral = await db.user.findOne({ id: user.referral })
                            await db.user.updateOne(
                                {id: user.referral},
                                {
                                    $set:{
                                        money: referral.money + sum/10,
                                        fromReferrals: referral.fromReferrals + sum/10,
                                    }
                                }
                            )
                            await telegram.sendMessage(user.referral,`Получено ${sum/10} ₽ за вывод реферала ${user.name}\nБаланс на вывод: ${referral.money + sum/10} ₽`)
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
            ctx.replyWithMarkdown(`Вывод возможен от *50 ₽*`, Markup.keyboard(mainKeyboard).resize())
        }
        return ctx.scene.leave()
    }catch(e){
        console.log(e)
    }
})

withdrawScene.hears('В начало', async (ctx) => {
    try{
        ctx.reply(`Главное меню:`, Markup.keyboard(mainKeyboard).resize())
        return ctx.scene.leave()
    } catch(e){
        console.log(e)
    }
})

withdrawScene.hears('Изменить кошелек', async (ctx) => {
    await ctx.scene.enter('editWithdrawScene')
})

module.exports = withdrawScene