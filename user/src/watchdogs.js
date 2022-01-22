const db = require ('../../db')
const { Telegram } = require ('telegraf')
const config = require ('../../config.json')

const telegram = new Telegram(config.TOKEN)

async function checkSub(){
    const all = await db.user.find()
    for (let i=0; i<all.length; i++){
        for (let j=0; j<all[i].channels.length; j++){
            if((await telegram.getChatMember(all[i].channels[j], all[i].id)).status === 'left'){
                await db.user.updateOne({id: all[i].id},
                    {
                        $set: {
                            balance: all[i].balance - 1,
                            points: all[i].points - 1,
                            super: all[i].super - 1,
                            channels: []
                        }
                    })
                await telegram.sendMessage(all[i].id, `Вы оштрафованы за отписку от ${all[i].channels[j]}. \n💰Текущий баланс: ${(all[i].balance - 1).toFixed(2)} ₽\n💴 Доступно на вывод : ${(all[i].money).toFixed(2)} ₽`)
                console.log('Оштрафован '+ all[i].id)
            }
        }
    }
    console.log('Проверка подписок окончена')
}

async function giveBonus(){
    const best = await db.user.find().sort({points: -1}).limit(3)
    for (let i=0; i<best.length; i++){
        const user = await db.user.findOne({ id: best[i].id })
        await db.user.updateOne({id: best[i].id},
            {
                $set: {
                    money: user.money + 100,
                }
            })
        console.log('Выдан бонус')
    }
}

async function toZero(){
    await db.user.updateMany({},
        {
            videos: 0,
            super: 0,
            points: 0,
            bonusesToday: 4
        })
    console.log('Обнулены очки')
}

async function timerCallback(){
    await giveBonus()
    await toZero()
    setTimer()
}

function millsTillMidnight(){
    const now = new Date
    const millsTillMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0, 0).getTime() - now.getTime()
    if(millsTillMidnight>0){
        return(millsTillMidnight)
    }
    else{
        return(millsTillMidnight+86400000)
    } 
}

function setTimer(){  
    console.log('Установлен таймер суток на: ' + (millsTillMidnight()/3600000)  + ' ч')
    setTimeout(timerCallback, millsTillMidnight())
}

module.exports = {
    main: setTimer,
    checkSub: checkSub
}