const { Telegraf, Scenes: {WizardScene}, Markup } = require('telegraf')
const db = require('../db')
const {mainKeyboard} = require('../keyboards')

const providerHandler = Telegraf.on('text', async (ctx) => {
    ctx.scene.state.provider = ctx.message.text
    await ctx.reply(`Укажите номер кошелька:`, Markup.removeKeyboard())
    return ctx.wizard.next()
})

const accountHandler = Telegraf.hears(/[0-9]/, async (ctx) => {
    const account = Number(ctx.message.text)
    await db.user.updateOne(
        {id: ctx.from.id},
        {
            $set:{
                provider: ctx.scene.state.provider,
                account: account
            }
        }
    )
    await ctx.reply(`Установлен кошелек ${ctx.scene.state.provider}: ${account}`, Markup.keyboard(mainKeyboard).resize())
    return ctx.scene.leave()
})


const editWithdrawScene = new WizardScene('editWithdrawScene', providerHandler, accountHandler)

editWithdrawScene.enter(async (ctx) => {
    await ctx.reply('Выберите платежную систему:',Markup.keyboard([
        ['qiwi'],
        ['yoomoney']
    ]).resize())
})

module.exports = editWithdrawScene