import delay from "delay";
import { Client } from "discord.js-selfbot-v13";
import path from "path";
import fs from "fs";
const client = new Client(); // All partials are loaded automatically

client.on("ready", async () => {
  console.log(`${client.user?.username} is ready!`);
  let userSaveDataPaths = path.join(__dirname, "../", "data");
  if (!fs.existsSync(userSaveDataPaths)) {
    fs.mkdirSync(userSaveDataPaths);
  }
  let userSaveDataPath = path.join(
    userSaveDataPaths,
    `${client.user?.username || ""}-folder`
  );
  if (!fs.existsSync(userSaveDataPath)) {
    fs.mkdirSync(userSaveDataPath);
  }
  let pokemonCounts: {
    now: number;
    max: number;
  } = {
    now: 0,
    max: 0,
  };
  if (fs.existsSync(path.join(userSaveDataPath, "./pokemonCounts.json"))) {
    pokemonCounts = JSON.parse(
      fs.readFileSync(
        path.join(userSaveDataPath, "./pokemonCounts.json"),
        "utf8"
      )
    );
  }

  let AppInfo = {
    channel: "",
    prefix: ",",
  };
  if (fs.existsSync(path.join(userSaveDataPath, "./AppInfo.json"))) {
    AppInfo = JSON.parse(
      fs.readFileSync(path.join(userSaveDataPath, "./AppInfo.json"), "utf8")
    );
  }

  client.on("messageCreate", async (message) => {
    if (
      message.author.id == client.user?.id &&
      message.content.includes(AppInfo.prefix + "selectchannel ".trim())
    ) {
      AppInfo.channel = message.channel.id;
      fs.writeFileSync(
        path.join(userSaveDataPath, "./AppInfo.json"),
        JSON.stringify(AppInfo, null, 2),
        "utf8"
      );
      message.react("✅");
    }
    if (
      message.author.id == client.user?.id &&
      message.content.includes(AppInfo.prefix + "removeselectchannel ".trim())
    ) {
      AppInfo.channel = "";
      fs.writeFileSync(
        path.join(userSaveDataPath, "./AppInfo.json"),
        JSON.stringify(AppInfo, null, 2),
        "utf8"
      );
      message.react("✅");
    }
    if (
      message.author.id == client.user?.id &&
      message.content.includes(`${AppInfo.prefix}selectprefix `)
    ) {
      const args = message.content
        .replace(`${AppInfo.prefix}selectprefix `, "")
        .split(" ");
      const prefix = args[0];
      if (prefix.length > 1) {
        AppInfo.prefix = prefix;
        fs.writeFileSync(
          path.join(userSaveDataPath, "./AppInfo.json"),
          JSON.stringify(AppInfo, null, 2),
          "utf8"
        );
        message.channel.send("prefix đã được chọn");
      } else {
        message.channel.send("prefix phải có ít nhất 1 ký tự");
      }
    }
    if (
      message.author.id == client.user?.id &&
      message.content.includes(`${AppInfo.prefix}evolves `)
    ) {
      // message.channel.sendTyping();
      const args = message.content
        .replace(`${AppInfo.prefix}evolves `, "")
        .split(" ");
      if (!args[0]) {
        message.channel.send(
          "phải nhập số con cần evolve (con nào tiến hóa được thì sẽ tiến hóa)"
        );
        return;
      }
      const pokemonCount = parseInt(args[0]);
      pokemonCounts.max = pokemonCount;
      fs.writeFileSync(
        path.join(userSaveDataPath, "./pokemonCounts.json"),
        JSON.stringify(pokemonCounts, null, 2),
        "utf8"
      );
      // react tick
      message.react("✅");
    }
    if (
      message.author.id == client.user?.id &&
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
    if (
      message.author.id == client.user?.id &&
      message.content.includes(`${AppInfo.prefix}mr `)
    ) {
      const args = message.content
        .replace(`${AppInfo.prefix}mr `, "")
        .split(" ");
      if (args.length < 1) {
        message.channel.send(
          `${AppInfo.prefix}mr <số con cần mua> [poke2 prefix]`
        );
        return;
      }
      const count = parseInt(args[0]);
      let buyArray: string[] = [];
      await delay(2000);
      message.channel.send(`${AppInfo.prefix}m s --o price --n zubat `);
      const messages = await message.channel.awaitMessages({
        filter: (m) => m.author.id == "716390085896962058",
        max: 1,
        time: 10000,
      });
      for (let i = 0; i < count / 20; i++) {
        if (i != 0) {
          await delay(1000);
          messages
            .first()
            ?.clickButton(
              messages.first()?.components[0].components[1].customId || ""
            );
        }
        buyArray = [
          ...buyArray,
          ...(messages.first()?.embeds[0].description?.split("\n") || []),
        ];
      }

      for (let i = 0; i < count; i++) {
        const pokemonId = buyArray[i].split("　")[0].replace(/\`/g, "");
        message.channel.send(`${AppInfo.prefix}m b ${pokemonId}`);
        const messages = await message.channel.awaitMessages({
          filter: (m) => m.author.id == "716390085896962058",
          max: 1,
          time: 10000,
        });
        if (messages.first()?.components[0]) {
          if (messages.first()?.components[0].components[0].type == "BUTTON") {
            await delay(1000);
            messages
              .first()
              ?.clickButton(
                messages.first()?.components[0].components[0].customId || ""
              );
          }
        }
        const messsageses = await message.channel.awaitMessages({
          filter: (m) => m.author.id == "716390085896962058",
          max: 1,
          time: 10000,
        });
        if (messsageses.first()?.content.includes("You purchased a")) {
          await delay(1000);
          message.channel.send(`${AppInfo.prefix}r l`);
          const messages = await message.channel.awaitMessages({
            filter: (m) => m.author.id == "716390085896962058",
            max: 1,
            time: 10000,
          });
          if (messages.first()?.components[0]) {
            if (
              messages.first()?.components[0].components[0].type == "BUTTON"
            ) {
              await delay(1000);
              messages
                .first()
                ?.clickButton(
                  messages.first()?.components[0].components[0].customId || ""
                );
            }
          }
        }
        await delay(2000);
      }
    }
    if (message.author.id === client.user?.id) return;
    if (!message.guild) return;
    if (
      !(message.channel.id == AppInfo.channel && AppInfo.channel.length >= 1)
    ) {
      console.log("not in channel");
      return;
    }
    if (!(message.author.id == "716390085896962058")) return;
    if (message.author.id == "716390085896962058") {
      if (message.embeds[0]) {
        if (
          message.embeds[0].description?.includes(
            `${AppInfo.prefix}catch <pokémon>`
          )
        ) {
          // if server have user  with id is 696161886734909481
          console.log(message.embeds[0].description);
          console.log("catch");
          await delay(1000);
          message.channel.send(`${AppInfo.prefix}h`);
          const humanMessage = await message.channel.awaitMessages({
            filter: (m) => m.author.id == "716390085896962058",
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
              m.author.id == "716390085896962058" ||
              m.author.id == "696161886734909481",
          });

          collector.on("collect", async (m) => {
            if (m.embeds[0]) {
              if (m.embeds[0].description?.includes("Results from")) {
                let content = m.embeds[0].description
                  .replace(/\*/g, "")
                  .split("\n")
                  .slice(1);
                for (let i = 0; i < content.length; i++) {
                  if (content[i].includes("hunters")) {
                    const tagPokemon = content[i]
                      .replace(/(\- \(.* hunters\))/g, "")
                      .trim()
                      .toLowerCase();
                    message.channel.send(`${tagPokemon}`);
                    const messages = await message.channel.awaitMessages({
                      filter: (m) =>
                        m.author.id == "696161886734909481" &&
                        m.content.includes("Tags"),
                      max: 1,
                    });
                    const timeSecond = parseInt(
                      messages
                        .first()
                        ?.embeds[0].description?.match(/(\d+)( )?(seconds|s)/g)
                        ?.join("")
                        .split(" ")[0] || "0"
                    );
                    console.log(timeSecond);
                    await delay(timeSecond * 1000);
                  }
                  const pokemon = content[i]
                    .replace(/(\- \(0 users\))/g, "")
                    .replace(/(\- \(.* hunters\))/g, "")
                    .trim()
                    .toLowerCase();
                  await delay(5000 / content.length);
                  console.log(pokemon);
                  message.channel.send(`${AppInfo.prefix}c ` + pokemon);
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
                if (pokemonCounts.now < pokemonCounts.max) {
                  await delay(5000);
                  message.channel.send(`${AppInfo.prefix}evolve l`);
                  const messages = await message.channel.awaitMessages({
                    max: 1,
                    filter: (m) => m.author.id == "716390085896962058",
                  });
                  if (!messages.first()?.content.includes("can't be evolved")) {
                    pokemonCounts.now++;
                    console.log(pokemonCounts);
                  }
                } else {
                  pokemonCounts.now = 0;
                  pokemonCounts.max = 0;
                }
                fs.writeFileSync(
                  path.join(userSaveDataPath, "./pokemonCounts.json"),
                  JSON.stringify(pokemonCounts, null, 2),
                  "utf8"
                );
                collector.stop();
              }
            }
          });
        }
      }
    }
  });

  process.on("exit", function () {
    fs.writeFileSync(
      path.join(userSaveDataPath, "./pokemonCounts.json"),
      JSON.stringify(pokemonCounts, null, 2),
      "utf8"
    );
    fs.writeFileSync(
      path.join(userSaveDataPath, "./AppInfo.json"),
      JSON.stringify(AppInfo, null, 2),
      "utf8"
    );
  });
});

client.login(process.env.TOKEN);
