import delay from "delay";
import { Client } from "discord.js-selfbot-v13";
const client = new Client(); // All partials are loaded automatically

client.on("ready", async (client) => {
  console.log(`${client.user.username} is ready!`);

  client.on("messageCreate", async (message) => {
    const AppInfo = {
      prefix: `<@${client.user.id}>`
    }
    if (
      message.author.id == client.user.id &&
      message.content.includes(`${AppInfo.prefix}repeat `)
    ) {
      // message.channel.sendTyping();
      const args = message.content
        .replace(`${AppInfo.prefix}repeat `, "")
        .split(" ");
      if (args.length < 2) {
        message.channel.send(
          `${AppInfo.prefix}repeat <số lần cần lặp> <tin cần lập>`
        );
        return;
      }
      const number = parseInt(args[0]);
      const content = args.slice(1).join(" ");
      for (let i = 0; i < number; i++) {
        await delay(2000);
        message.channel.send(content);
      }
      // react tick
      message.react("✅");
    }
    if (message.author.id === client.user?.id) return;
    if (!message.guild) return;
    // check in channel
    if (!(message.author.id == "716390085896962058")) return;
    const poke2User = client.users.cache.get("716390085896962058") || message.author; // =))
    if (message.author.id == poke2User.id) {
      if (message.embeds[0]) {
        if (
          message.embeds[0].description?.includes(
            `@Pokétwo#8236 catch <pokémon>`
          )
        ) {
          // if server have user  with id is 696161886734909481
          console.log(message.embeds[0].description);
          console.log("catch");
          await delay(1000);
          message.channel.send(`<@${poke2User.id}>hint`);
          const humanMessage = await message.channel.awaitMessages({
            filter: (m) => m.author.id == poke2User.id,
            max: 1,
            time: 10000,
          });
          if (
            humanMessage
              .first()
              ?.content.includes("Whoa there. Please tell us you're human!")
          ) {
            return;
          }
          const collector = message.channel.createMessageCollector({
            filter: (m) =>
              m.author.id == poke2User.id ||
              m.author.id == "874910942490677270", // poke-name id
          });

          collector.on("collect", async (m) => {
            if (m.embeds[0]) {
              if (m.embeds[0].title?.includes("Name of the Pokemon")) {
                if (!m.embeds[0].description) {
                  console.log("don't know that pokemon")
                  return
                }
                let content = m.embeds[0].description
                  .replace(/\*/g, "")
                  .split("\n");
                m.components.forEach(item => {
                  if (item.type == "ACTION_ROW") {
                    item.components.forEach(item => {
                      if (item.type == "BUTTON") {
                        item.click(m)
                      }
                    })
                  }
                })

                for (let i = 0; i < content.length; i++) {
                  const pokemon = content[i]
                    .replace(/(\d.\s?)/g, "")
                    .replace(/\(\)/g, "")
                    .trim()
                    .toLowerCase();
                  await delay(5000 / content.length);
                  console.log(`catch pokemon ${pokemon}`);
                  message.channel.send(`<@${poke2User.id}>catch ` + pokemon);
                  const CaughtMessages = await message.channel.awaitMessages({
                    max: 1,
                    filter: (m) => m.author.id == "716390085896962058",
                  });
                  if (
                    CaughtMessages.first()?.content.includes("Congratulations")
                  ) {
                    break;
                  }
                }
                collector.stop();
              }
            }
          });
        }
      }
    }
  });
});

client.login(process.env.TOKEN);
