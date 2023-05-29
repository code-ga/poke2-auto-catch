import delay from "delay";
import { Client } from "discord.js-selfbot-v13";
const { sentence } = require("txtgen/dist/cjs/txtgen.js")
import fs from "fs"
import path from "path";

const client = new Client()
const data = JSON.parse(fs.readFileSync(path.join(__dirname,"data.txt"),"utf8"))
client.on("ready", async(client)=>{
  const channel = await client.channels.fetch(data.spamChannel)
  if (!channel ) return 
  if (!channel.isText()) return
  while ( true ){
    await channel.send(sentence())
    await delay(1000)
  }
})

client.login(process.env.TOKEN)
