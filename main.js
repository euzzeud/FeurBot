/**
 * 2021 - By Euzzeud#6040 on Discord.
 */

const { Client } = require("discord.js")
const { compareTwoStrings } = require("string-similarity")
const bot = new Client();
const config = require("./config.json")

/**
 * Initialisation de la base de données
 */

 const low = require('lowdb');
 const FileSync = require('lowdb/adapters/FileSync');
 const adapter = new FileSync("database.json");
 const db = low(adapter);

db.defaults(config.database).write()

/**
 * Evénements Discord
 */

 bot.on("error", (error) => {
    return console.log(error)
});

bot.on("ready", () => {
    //bot.user.setActivity(`répondre "feur" x)`, {type: "PLAYING"})
    return console.log("I'm ready!")
})

bot.on("guildCreate", guild => {
    if (!guild) return;

    var owner = bot.users.cache.find(o => o.id === config.owner)
    if (!owner) return;

    return guild.owner.send(``, {
        embed: {
            author:{name: "Merci de m'avoir ajouté !", iconURL: bot.user.displayAvatarURL()},
            description: `Vous pouvez m'activer avec la commande \`${config.prefix}on\` et me désactiver avec la commande \`${config.prefix}off\`.\n\n**[Lien d'invitation](https://discord.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=${config.permissions})**`,
            color:"RANDOM",
            footer: {text:`Créé par ${owner.tag}... en 5 minutes !`, iconURL: owner.displayAvatarURL()},
            timestamp:Date.now()
        }
    })
})

bot.on("guildDelete", guild => {
    if (!guild) return;

    if (db.get("active").filter({guild: guild.id}).find("guild").value()){
        db.get("active").remove({guild: guild.id}).write()
    }
})

bot.on("message",  message => {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    var owner = bot.users.cache.find(o => o.id === config.owner)
    if (!owner) return;

    if (message.author.bot || message.author.system) return;
    if (message.channel.type == "dm") return;

    if (db.get("active").filter({guild: message.guild.id}).find("guild").value()){
    
    var detectQuoi = compareTwoStrings(message.content.replace(/[\s-]+$/, '').split(/[\s-]/).pop(), "quoi")

    if (detectQuoi > 0){
        console.log(`The word "quoi" was detected : ${detectQuoi} !`)
        return message.channel.send("feur")
    }

}

    if (command === "help"){
        return message.channel.send(``, {
            embed:{
                author:{name: `Menu d'aide de ${bot.user.username}`, iconURL:bot.user.displayAvatarURL()},
                color:"RANDOM",
                description:`Mon préfix est \`${config.prefix}\`.`,
                fields:[
                    {name: `${config.emotes.troll} Commandes`, value:`\`help\` : Affiche le menu d'aide.\n\`on\` : Activer la réponse.\n\`off\` : Désactiver la réponse.\n\n**[Lien d'invitation](https://discord.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=${config.permissions})**`}
                ],
                footer: {text:`Créé par ${owner.tag}... en 5 minutes !`, iconURL: owner.displayAvatarURL()},
                timestamp:Date.now()

            }
        })
    }

    if (command === "on"){
        if (!db.get("active").find({guild: message.guild.id}).value()){
            db.get("active").push({guild: message.guild.id}).write()
            return message.channel.send(`**${config.emotes.check} Réponse activée !**`)

            } else {
                return message.channel.send(`**${config.emotes.error} Réponse déjà activée !**`)
            }
    }

    if (command === "off"){
        if (db.get("active").find({guild: message.guild.id}).value()){
            db.get("active").remove({guild: message.guild.id}).write()
            return message.channel.send(`**${config.emotes.check} Réponse désactivée !**`)

            } else {
                return message.channel.send(`**${config.emotes.error} Réponse déjà désactivée !**`)
            }
    }
    
})

bot.login(config.token)