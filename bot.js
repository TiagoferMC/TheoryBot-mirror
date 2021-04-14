import config from "./config.js";
import * as music from "./music.js";
import low from "lowdb";
import FileAsync from "lowdb/adapters/FileAsync.js";
import { Client, MessageEmbed } from "discord.js";
import colorVal from "validate-color";
const { validateHTMLColorHex } = colorVal;

const colors = [
    "DEFAULT",
    "WHITE",
    "AQUA",
    "GREEN",
    "BLUE",
    "YELLOW",
    "PURPLE",
    "LUMINOUS_VIVID_PINK",
    "GOLD",
    "ORANGE",
    "RED",
    "GREY",
    "DARKER_GREY",
    "NAVY",
    "DARK_AQUA",
    "DARK_GREEN",
    "DARK_BLUE",
    "DARK_PURPLE",
    "DARK_VIVID_PINK",
    "DARK_GOLD",
    "DARK_ORANGE",
    "DARK_RED",
    "DARK_GREY",
    "LIGHT_GREY",
    "DARK_NAVY",
    "BLURPLE",
    "GREYPLE",
    "DARK_BUT_NOT_BLACK",
    "NOT_QUITE_BLACK",
    "RANDOM"
];

const adapter = new FileAsync(config.dbFile);
(async () => {
    const db = await low(adapter);
    db.defaults({ guilds: [] }).write();

    const client = new Client();

    async function dbGuildDefaults(id) {
        const guildInfo = {
            guildID: id,
            prefix: config.defaultPrefix,
            color: config.defaultAccentColor
        };

        await db.get("guilds")
            .push(guildInfo)
            .write();
    }

    async function deleteDBGuild(id) {
        await db.get("guilds")
            .remove({guildID: id})
            .write();
    }

    client.on("guildCreate", async guild => {
        console.log("Joined a new guild: " + guild.name);
        await dbGuildDefaults(guild.id);
    });


    client.on("guildDelete", async guild => {
        console.log("Left a guild: " + guild.name);
        await deleteDBGuild(guild.id);

    });

    client.once("ready", async () => {
        console.log("Discord Bot Ready!");
        await db.get("guilds").forEach(async dbGuild => {
                console.log(client.guilds.cache.filter(guild => id == dbGuild.id));
                //if (client.guilds.cache.filter(guild => id == dbGuild.id))
                //await deleteDBGuild(dbGuild.id);
        });

        client.guilds.cache.forEach(async guild => {
            if (await db.get("guilds").find({guildID: guild.id}).valueOf() == undefined)
                await dbGuildDefaults(guild.id);
        });
    });

    client.on("message", async message => {
        let prefix = await db.get("guilds").find({guildID: message.guild.id}).valueOf().prefix;
        let accentColor = await db.get("guilds").find({guildID: message.guild.id}).valueOf().color;

        function sendMessage(content) {
            message.channel.send(new MessageEmbed()
                .setColor(accentColor)
                .addField("TheoryBot", content));
        }

        function sendEmbeddedMessage(embeddedContent) {
            message.channel.send(embeddedContent);
        }

        function sendImage(arg, title, description, usage, aliases, img) {
            if (arg == "help")
                sendEmbeddedMessage(new MessageEmbed()
                    .setColor(accentColor)
                    .setTitle(`TheoryBot - ${title}`)
                    .setDescription(`Shows a quick and handy ${description}`)
                    .addField("Usage", `${prefix}${usage}`)
                    .setFooter(`Aliases: ${aliases}`));
            else
                sendEmbeddedMessage(new MessageEmbed()
                    .setColor(accentColor)
                    .setTitle(`TheoryBot - ${title}`)
                    .attachFiles([`${config.imgFolder}/${img}`])
                    .setImage(`attachment://${img}`));
        }

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const noPermissionMessage = "Only Administrators can use that command.";
        const args = message.content.slice(prefix.length).trim().split(" ");
        const command = args.shift().toLowerCase();

        try {
            switch (command) {
                case "help":
                    sendEmbeddedMessage(new MessageEmbed()
                        .setColor(accentColor)
                        .setTitle("TheoryBot")
                        .setURL("")
                        .setAuthor("Tiagofer")
                        .setDescription("A Discord bot that helps you learn music theory.")
                        .setThumbnail("")
                        .addField("Basic Music Theory", "intervals\n \
                            circle-fifths", true)
                        .addField("String Instruments", "guitar\n \
                            mandolin\n \
                            banjo", true)
                        .addField("Miscelaneous", "help\n \
                            prefix :gear:\n \
                            color :gear:", true)
                        .addField("\u200b", "You can type 'help' after any command to see a short description of what it does.\n\n \
                            Commands with a :gear: icon next to them can only be used by Administrators.", false)
                        .setFooter("Made by Tiagofer for Lis_13"));
                    break;
                case "prefix":
                    if (args[0] && args[0] != "help") {
                        if (message.member.hasPermission("ADMINISTRATOR", { checkAdmin: true, checkOwner: true })) {
                            await db.get("guilds")
                                .find({guildID: message.guild.id})
                                .assign({prefix: args[0]})
                                .write();
                            sendMessage(`Prefix changed to ${args[0]}`);
                        } else
                            sendMessage(noPermissionMessage);
                    } else {
                        sendEmbeddedMessage(new MessageEmbed()
                            .setColor(accentColor)
                            .setTitle("TheoryBot - Prefix")
                            .setDescription("Allows an admin to change the bot's prefix.")
                            .addField("Usage", `${prefix}prefix <new prefix>`)
                            .addField("Example", `${prefix}prefix ${prefix == '?' ? '!' : '?'}`)
                            .setFooter("Aliases: prefix"));
                    }
                    break;
                case "accent-color":
                case "color":
                    if (args[0] == "list") {
                        sendEmbeddedMessage(new MessageEmbed()
                            .setColor(accentColor)
                            .setTitle("TheoryBot - Named Color List")
                            .setDescription("Named Colors Discord Supports")
                            .addField("\u200b", "DEFAULT\nWHITE\nAQUA\nGREEN\nBLUE\nYELLOW\nPURPLE\nLUMINOUS_VIVID_PINK\nGOLD\nORANGE", true)
                            .addField("\u200b", "RED\nGREY\nDARKER_GREY\nNAVY\nDARK_AQUA\nDARK_GREEN\nDARK_BLUE\nDARK_PURPLE\nDARK_VIVID_PINK\nDARK_GOLD", true)
                            .addField("\u200b", "DARK_ORANGE\nDARK_RED\nDARK_GREY\nLIGHT_GREY\nDARK_NAVY\nBLURPLE\nGREYPLE\nDARK_BUT_NOT_BLACK\nNOT_QUITE_BLACK\nRANDOM", true)
                            .setFooter("Aliases: color, accent-color"));
                    } else if (args[0] && args[0] != "help") {
                        if (message.member.hasPermission("ADMINISTRATOR", { checkAdmin: true, checkOwner: true })) {
                            if (validateHTMLColorHex(args[0]) || colors.includes(args[0].toUpperCase())) {
                                await db.get("guilds")
                                    .find({guildID: message.guild.id })
                                    .assign({color: args[0].toUpperCase()})
                                    .write();
                                accentColor = args[0].toUpperCase();
                                sendMessage(`Accent color changed to ${args[0]}`);

                            } else
                                sendMessage(`${args[0]} is not a valid color.`);
                        } else
                            sendMessage(noPermissionMessage);
                    } else {
                        sendEmbeddedMessaga(new MessageEmbed()
                            .setColor(accentColor)
                            .setTitle("TheoryBot - Color")
                            .setDescription(`Allows an admin to change the bot's accent color.\n\n \
                                The color can be any HEX code or one of the color names supported by Discord.\n \
                                Run '${prefix}color list' for a full list of supported color names.`)
                            .addField("Usage", `${prefix}color <new color>`)
                            .addField("Examples", `${prefix}color #0099FF\n${prefix}color Dark_Cyan`)
                            .setFooter("Aliases: color, accent-color"));
                    }
                    break;
                case "interval":
                case "intervals":
                    if ( (args[0] && args[1]) && !args[3]) {
                        if (!music.validateNote(args[0]))
                            sendMessage(`${args[0]} is not a valid note name.`);
                        else if (!music.validateNote(args[1]))
                            sendMessage(`${args[1]} is not a valid note name.`);
                        else {
                            const note1 = `${args[0].charAt(0).toUpperCase()}${args[0].charAt(1)}`;
                            const note2 = `${args[1].charAt(0).toUpperCase()}${args[1].charAt(1)}`;
                            const intervalBetween = music.interval(note1, note2);

                            if (intervalBetween == -1)
                                sendMessage(`Interval Unsupported`);
                            else
                                sendMessage(`${note1} and ${note2} are a ${intervalBetween} apart.`);
                        }
                        break;
                    } else {
                        sendEmbeddedMessage(new MessageEmbed()
                            .setColor(accentColor)
                            .setTitle("TheoryBot - Interval")
                            .setDescription("Outputs the interval between two given notes.\n \
                                Double Sharp and Double Diminished notes are not supported at the present time")
                            .addField("Usage", `${prefix}interval <note> <note>`).addField("Example", `${prefix}interval E Gb`)
                            .setFooter("Aliases: interval, intervals"));
                    }
                    break;
                case "circle":
                case "circles":
                case "fifths":
                case "circle-of-fifths":
                case "circle-fifths":
                    sendImage(args[0], "Circle of Fifths", "Circle of Fifths", "circle-of-fifths", "circle, circles, fifths, circle-of-fifths, circle-fifths", config.circleOfFifths);
                    break;
                case "guitar":
                case "guitars":
                    switch (args[0]) {
                        case undefined:
                        case "help":
                            sendEmbeddedMessage(new MessageEmbed()
                                .setColor(accentColor)
                                .setTitle("TheoryBot - Guitar")
                                .setDescription("Guitar Related Commands")
                                .addField("Available Commands", `chords\n \
                                    scales\n \
                                    tunings`)
                                .setFooter("Aliases: guitar, guitars"));
                            break;
                        case "chords":
                        case "chord":
                            sendImage(args[1], "Guitar Chord Chart", "Chord Chart for a 6-String Guitar in Standard Tuning", "guitar chord", "guitar chords, guitar chord, guitars chords, guitars chord", config.guitarChordChart);
                            break;
                        case "scales":
                        case "scale":
                            sendImage(args[1], "Guitar Scales Chart", "Scales Chart for a 6-String Guitar in Standard Tuning", "guitar scales", "guitar scales, guitar scale, guitars scales, guitars scale", config.guitarScalesChart);
                            break;
                        case "tunings":
                        case "tuning":
                        case "tune":
                            if (args[1] == "help")
                                sendEmbeddedMessage(new MessageEmbed()
                                    .setColor(accentColor)
                                    .setTitle("TheoryBot - Guitar Tunings")
                                    .setDescription("Shows a list of common Guitar Tunings")
                                    .addField("Usage", `${prefix}guitar tunings`)
                                    .setFooter("Aliases: guitar tunings, guitar tuning, guitar tune, guitars tunings, guitars tuning, guitars tune"));
                            else
                                sendEmbeddedMessage(new MessageEmbed()
                                    .setColor(accentColor)
                                    .setTitle("Common Guitar Tunings")
                                    .addField("Standard Tuning", "E-A-d-g-b-e'", true)
                                    .addField("New Standard Tuning (NST)", "C-G-d-a-e'-g'", true)
                                    .addField("Eb Standard (Hendrix) Tuning", "Eb-Ab-db-gb-bb-eb'", true)
                                    .addField("Open G", "D-G-d-g-b-d'\n \
                                        G-B-d-g-b-d' (Dobro)", true)
                                    .addField("Open E", "E-B-e-g#-b-e'", true)
                                    .addField("Open C", "C-G-c-g-c'-e'", true)
                                    .addField("Drop D", "D-A-d-b-b-e", true)
                                    .addField("Double Drop D", "D-A-d-g-b-d'", true)
                                    .addField("Drop C", "C-G-c-f-a-d'", true));
                            break;
                        default:
                            sendMessage(`${command} ${args[0]} is not a valid TheoryBot command.\n\nSee ${prefix}${command} help for available commands.`);
                            break;
                    }
                    break;
                case "mandolin":
                case "mando":
                    switch (args[0]) {
                        case undefined:
                        case "help":
                            sendEmbeddedMessage(new MessageEmbed()
                                .setColor(accentColor)
                                .setTitle("TheoryBot - Mandolin")
                                .setDescription("Mandolin Related Commands")
                                .addField("Available Commands", `chords\n \
                                    scales \
                                    tunings`)
                                .setFooter("Aliases: mandolin, mandolins, mando, mandos"));
                            break;
                        case "chords":
                        case "chord":
                            sendImage(args[1], "Mandolin Chord Chart", "Chord Chart for a Mandolin in Standard Tuning", "mando chords", "mandolin chords, mandolin chord, mandolins chords, mandolins chord, mando chords, mando chord, mandos chords, mando chord", config.mandolinChordChart);
                            break;
                        case "scales":
                        case "scale":
                            sendImage(args[1], "Mandolin Scales Chart", "Scales Chart for a Mandolin in Standard Tuning", "mando scales", "mandolin scales, mandolin scale, mandolins scales, mandolins scale, mando scales, mando scale, mandos scales, mandos scale", config.mandolinScalesChart);
                            break;
                        case "tunings":
                        case "tuning":
                        case "tune":
                            if (args[1] == "help")
                                sendEmbeddedMessage(new MessageEmbed()
                                    .setColor(accentColor)
                                    .setTitle("TheoryBot - Mandolin Tunings")
                                    .setDescription("Shows a list of common Mandolin Tunings")
                                    .addField("Usage", `${prefix}mando tunings`)
                                    .setFooter("Aliases: mandolin tunings, mandolin tuning, mandolin tune, mandolins tunings, mandolins tuning, mandolins tune, mando tunings, mando tuning, mandolin tune, mandos tunes, mandos tune, mandos tune"));
                            else
                                sendEmbeddedMessage(new MessageEmbed()
                                    .setColor(accentColor)
                                    .setTitle("Common Mandolin Tunings")
                                    .addField("Mandolin Standard Tuning", "g-d'-a'-e''", true)
                                    .addField("G-Dad", "g-d'-a'-d''", true)
                                    .addField("Cross A", "a-e'-a'-e''", true)
                                    .addField("Cross G", "g-d'-g'-d''", true)
                                    .addField("Open G", "g-d'-g'-b'", true));
                            break;
                        default:
                            sendMessage(`${command} ${args[0]} is not a valid TheoryBot command.\n\nSee ${prefix}${command} help for available commands.`);
                            break;
                    }
                    break;
                 case "banjo":
                 case "banjos":
                    switch (args[0]) {
                        case undefined:
                        case "help":
                            sendEmbeddedMessage(new MessageEmbed()
                                .setColor(accentColor)
                                .setTitle("TheoryBot - Banjo")
                                .setDescription("Banjo Related Commands")
                                .addField("Available Commands", `chords\n \
                                    ~~scales~~ WIP \
                                    tunings`)
                                .setFooter("Aliases: banjo, banjos"));
                            break;
                        case "chords":
                        case "chord":
                            sendImage(args[1], "Banjo Chord Chart", "Chord Chart for a Banjo in Open G Tuning", "banjo chords", "banjo chords, banjo chord, banjos chords, banjos chord", config.banjoChordChart);
                            break;
                        case "scales":
                        case "scale":
                            sendMessage(`Banjo Scales are coming soon!`);
                            // TODO
                            break;
                        case "tunings":
                        case "tuning":
                        case "tune":
                            if (args[1] == "help")
                                sendEmbeddedMessage(new MessageEmbed()
                                    .setColor(accentColor)
                                    .setTitle("TheoryBot - Banjo Tunings")
                                    .setDescription("Shows a list of common Banjo Tunings")
                                    .addField("Usage", `${prefix}banjo tunings`)
                                    .setFooter("Aliases: banjo tunings, banjo tuning, banjo tune, banjos tunings, banjos tuning, banjos tune"));
                            else
                                sendEmbeddedMessage(new MessageEmbed()
                                    .setColor(accentColor)
                                    .setTitle("Common Banjo Tunings")
                                    .addField("Banjo Standard (Open G)", "g'-d-g-b-d'", true)
                                    .addField("Banjo Old-time D", "a'-d-a-d'-e'", true)
                                    .addField("Classic Banjo", "g'-c-g-b-d'", true)
                                    .addField("Double C", "g'-c-g-c'-d'", true)
                                    .addField("Sawmill", "g'-d-g-c'-d'", true)
                                    .addField("4-string Standard", "c-g-b-d'", true)
                                    .addField("Chicago Tuning", "d-g-b-e'", true)
                                    .addField("Tenor Banjo", "c-g-d'-a'", true));
                            break; default:
                            sendMessage(`${command} ${args[0]} is not a valid TheoryBot command.\n\nSee ${prefix}${command} help for available commands.`);
                            break;
                    }
                    break;












                default:
                    sendMessage(`${command} is not a valid TheoryBot command.\n\nSee ${prefix}help for available commands.`);
                    break;
            }
        } catch (e) {
            console.log(e);
            sendMessage("An Unknown Error Has Occurred");
        }
    });

    client.login(config.botToken);
})();
