const bot = require('./user/bot')
const db = require('./db')
const watchdogs = require('./user/src/watchdogs')
const botAdmin = require('./admin/bot')

db.initialize()
bot.initialize()
botAdmin.initialize()
watchdogs.main()

Interv = setInterval(watchdogs.checkSub, 60000)
console.log('Запущена проверка отписок')