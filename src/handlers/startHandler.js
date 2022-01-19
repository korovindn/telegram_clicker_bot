const db = require('../db')
const { Markup } = require('telegraf')
const { mainKeyboard } = require('../keyboards')

const startHandler = async (ctx) => {
    try {
        if(!(await db.user.findOne({ id: ctx.from.id }))){
            if(ctx.message.text.split(' ')[1]){
                const newUser = new db.user({
                    id: ctx.from.id,
                    name: ctx.from.first_name,
                    balance: 0,
                    money: 0,
                    videos: 0,
                    super: 0,
                    points: 0,
                    channels: [ ],
                    lastBonus: 0,
                    bonusesToday: 4,
                    provider: '',
                    account: '',
                    referral: ctx.message.text.split(' ')[1]
                });
                newUser.save();
            } else {
                const newUser = new db.user({
                    id: ctx.from.id,
                    name: ctx.from.first_name,
                    balance: 0,
                    money: 0,
                    videos: 0,
                    super: 0,
                    points: 0,
                    channels: [ ],
                    lastBonus: 0,
                    bonusesToday: 4,
                    provider: '',
                    account: '',
                    referral: 0
                });
                newUser.save();
            }
        }

        await ctx.reply(`Привет, ${ctx.from.first_name}\nГлавное меню:`, Markup.keyboard(mainKeyboard).resize())
    } catch (e) {
        console.log(e)
    }
}

module.exports = startHandler