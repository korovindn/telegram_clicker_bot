const { Telegraf, Scenes: {WizardScene}, Markup } = require('telegraf')
const db = require('../db')
const {mainKeyboard} = require('../keyboards')

const providerHandler = Telegraf.on('text', async (ctx) => {
    try{
        ctx.scene.state.provider = ctx.message.text
        await ctx.reply(`Укажите номер кошелька:`, Markup.removeKeyboard())
        return ctx.wizard.next()
    }catch(e){
        console.log(e)
    }
})

const accountHandler = Telegraf.hears(/[0-9]/, async (ctx) => {
    try{
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
        await ctx.reply(`Установлен кошелек ${ctx.scene.state.provider.charAt(0).toUpperCase() + ctx.scene.state.provider.slice(1)}: ${account}`, Markup.keyboard(mainKeyboard).resize())
        return ctx.scene.leave()
    }catch(e){
        console.log(e)
    }
})


const editWithdrawScene = new WizardScene('editWithdrawScene', providerHandler, accountHandler)

editWithdrawScene.enter(async (ctx) => {
    try{
        await ctx.reply('🏦 Выберите платежную систему:',Markup.keyboard([
            ['qiwi'],
            ['yoomoney']
        ]).resize())
    } catch(e){
        console.log(e)
    }
})

module.exports = editWithdrawScene