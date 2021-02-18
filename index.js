const Discord = require("discord.js");
const client = new Discord.Client();
const axios = require('axios');

client.once('ready', () => {
    console.log('Ready!');
    setTimeout(function(){
        sendMessage();
        var dayMilliseconds = 1000 * 60 * 60 * 24;
        setInterval(function(){
            sendMessage();
        }, dayMilliseconds)
    }, leftToEight())
});

function leftToEight(){
    var d = new Date();
    return (-d + d.setHours(8,0,0,0));
}

async function sendMessage(){
    const url = "https://api.nasa.gov/planetary/apod?api_key=api_key";
    let image, response;

    try {
        response = await axios.get(url);
        image = response.data;

    } catch (e) {
        return console.log("Didn't work")
    }

    if(image.hdurl == undefined){
        const embed = new Discord.MessageEmbed()
        .setTitle(`Astronomy picture of the day :telescope: "${image.title}" - NASA`)
        .setColor(getRandomColor())
        .setImage("https://i.imgur.com/OX9pcOl.png")
        .setDescription(image.explanation)
        .setURL("https://apod.nasa.gov/apod/astropix.html")
        .setTimestamp()
        .addField('Click the title!', '\u200B')
        .setFooter('Server: Spacehub • Bot by: Myst#5877', 'https://i.imgur.com/OX9pcOl.png')

        var guild = client.guilds.cache.get('479405042059837470');
        if(guild && guild.channels.cache.get('493411773274390549')){
            guild.channels.cache.get('493411773274390549').send("<@&614875234272673817>", embed)
        }
    } else {
        const embed = new Discord.MessageEmbed()
        .setTitle(`Astronomy picture of the day :telescope: "${image.title}" - NASA`)
        .setColor(getRandomColor())
        .setImage(image.hdurl)
        .setDescription(image.explanation)
        .setURL(image.hdurl)
        .setTimestamp()
        .addField('Photo by: :camera:', image.copyright)
        .setFooter('Server: Spacehub • Bot by: Myst#5877', 'https://i.imgur.com/OX9pcOl.png')

        var guild = client.guilds.cache.get('479405042059837470');
        if(guild && guild.channels.cache.get('493411773274390549')){
            guild.channels.cache.get('493411773274390549').send("<@&614875234272673817", embed)
        }
    }


}

const prefix = 'a.'

function getRandomColor() {
    var letters = '0123456789abcdef';
    var color = '';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color; 
}

client.on("message", async message => {


    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    //command list
  
    if (message.content.startsWith(`${prefix}apod`)) {
      apod(message);
      return;
    } //else if (message.content.startsWith(`${prefix}skip`)) {
      //skip(message, serverQueue);
      //return;
   // } 
    else{
      const nocommandembed = new Discord.MessageEmbed()
        .setColor('FF0000')
        .setTitle('Error')
        .setTimestamp()
        .setDescription(`Please enter a valid command! \n Do a.help for a list of commands!`)
        .setFooter('Astrobot')
  
      message.channel.send({embed: nocommandembed});
    }
});

async function apod(message){
    const url = "https://api.nasa.gov/planetary/apod?api_key=api_key";
    let image, response;

    try {
        response = await axios.get(url);
        image = response.data;

    } catch (e) {
        return message.channel.send(`An error occured, please try again!`)
    }

    const embed = new Discord.MessageEmbed()
        .setTitle(`Astronomy picture of the day :telescope: "${image.title}" - NASA`)
        .setColor(getRandomColor())
        .setImage(image.hdurl)
        .setDescription(image.explanation)
        .setURL(image.hdurl)
        .setTimestamp()
        .addField('Photo by: :camera:', image.copyright)
        .setFooter(`requested by: ${message.author.tag}`, 'https://i.imgur.com/OX9pcOl.png')

    await message.channel.send(embed)
} 
  


client.login('discord_token')

