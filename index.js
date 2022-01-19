const bot = require('./src/bot')
const db = require('./src/db')
const watchdogs = require('./src/watchdogs')

db.initialize()
bot.initialize()
watchdogs.main()

Interv = setInterval(watchdogs.checkSub, 60000)
console.log('Запущена проверка отписок')