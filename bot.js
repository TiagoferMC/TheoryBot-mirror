import config from "./config.js";
import * as music from './music.js' ;
import { Client, MessageEmbed } from "discord.js";

let messageColor = config.messageColor;
let prefix = config.cmdPrefix;

const client = new Client();


client.once("ready", () => {
    console.log("Discord Bot Ready!");
});

client.on("message", (message) => {

    function sendMessage(content) {
        const embeddedMessage = new MessageEmbed()
            .setColor(messageColor)
            .addField("TheoryBot", content);
        message.channel.send(embeddedMessage);
    }

    function sendEmbeddedMessage(embeddedContent) {
        message.channel.send(embeddedContent);
    }

    function sendImage(arg, title, description, usage, aliases, img) {
        if (arg == "help") {
            const imgHelpMessage = new MessageEmbed()
                .setColor(messageColor)
                .setTitle(`TheoryBot - ${title}`)
                .setDescription(`Shows a quick and handy ${description}`)
                .addField("Usage", `${prefix}${usage}`)
                .setFooter(`Aliases: ${aliases}`);

            sendEmbeddedMessage(imeHelpMessage);
        } else {
            const imgMessage = new MessageEmbed()
                .setColor(messageColor)
                .setTitle(`TheoryBot - ${title}`)
                .attachFiles([`${config.imgFolder}/${img}`])
                .setImage(`attachment://${img}`);

            sendEmbeddedMessage(imgMessage);
        }
    }    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const noPermissionMessage = "Only Administrators can use that command.";
    const args = message.content.slice(prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();

    try {
        switch (command) {
            case "help":
                const helpMessage = new MessageEmbed()
                    .setColor(messageColor)
                    .setTitle("TheoryBot")
                    .setURL("")
                    .setAuthor("Tiagofer")
                    .setDescription("A Discord bot that helps you learn music theory.")
                    .setThumbnail("")
                    .addFields(
                {   name: "Basic Music Theory",
                    value: "intervals\ncircle-fifths",
                    inline: true
                },
                {   name: "String Instruments",
                    value: "guitar\nmandolin\nbanjo",
                    inline: true
                },
                {   name: "Miscelaneous",
                    value: "prefix \u{2699}\nhelp",
                    inline: true
                },
                {   name: "\u200B",
                    value: "You can type 'help' after any command to see a short description of what it does.",
                    inline: false
                })
                    .setFooter("Made by Tiagofer for Lis_13");

                sendEmbeddedMessage(helpMessage);

                break;
            case "prefix":
                if (args[0] && args[0] != "help") {
                    if (message.member.hasPermission("ADMINISTRATOR", { checkAdmin: true, checkOwner: true })) {
                        prefix = args[0];
                        sendMessage(`Prefix changed to ${prefix}`);
                    } else
                        sendMessage(noPermissionMessage);
                } else {
                    const prefixMessage = new MessageEmbed()
                                                .setColor(messageColor)
                                                .setTitle("TheoryBot - Prefix")
                                                .setDescription("Allows an admin to change the bot's prefix.")
                                                .addField("Usage", `${prefix}prefix <new prefix>`)
                                                .addField("Example", `${prefix}prefix ?`)
                                                .setFooter("Aliases: prefix");
                    sendEmbeddedMessage(prefixMessage);
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

                        if (intervalBetween != -1)
                            sendMessage(`${note1} and ${note2} are a ${intervalBetween} apart.`);
                        else
                            sendMessage(`Interval Unsupported`);
                    }
                    break;
                } else {
                    const intervalMessage = new MessageEmbed()
                                                .setColor(messageColor)
                                                .setTitle("TheoryBot - Interval")
                                                .setDescription("Outputs the interval between two given notes.\nDouble Sharp and Double Diminished notes are not supported at the present time")
                                                .addField("Usage", `${prefix}interval <note> <note>`).addField("Example", `${prefix}interval E Gb`)
                                                .setFooter("Aliases: interval, intervals");
                    sendEmbeddedMessage(intervalMessage);
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
                    case "":
                    case "help":
                        const guitarMessage = new MessageEmbed()
                                                .setColor(messageColor)
                                                .setTitle("TheoryBot - Guitar")
                                                .setDescription("Guitar Related Commands")
                                                .addField("Available Commands", `chords\nscales`)
                                                .setFooter("Aliases: guitar, guitars");
                        sendEmbeddedMessage(guitarMessage);
                        break;
                    case "chords":
                    case "chord":
                        sendImage(args[0], "Guitar Chord Chart", "Chord Chart for a 6-String Guitar in Standard Tuning", "guitar chord", "guitar chord, guitar chords, guitars chord, guitars chords", config.guitarChordChart);
                        break;
                    case "scales":
                    case "scale":
                        sendImage(args[0], "Guitar Scales Chart", "Scales Chart for a 6-String Guitar in Standard Tuning", "guitar scales", "guitar scales, guitar scale, guitars scales, guitars scale", config.guitarScalesChart);
                        break;
                    default:
                        sendMessage(`${command} ${args[0]} is not a valid TheoryBot command.\n\nSee ${prefix}${command} help for available commands.`);
                        break;
                }
                break;
            case "mandolin":
            case "mando":
                switch (args[0]) {
                    case "":
                    case "help":
                        const mandoMessage = new MessageEmbed()
                                                .setColor(messageColor)
                                                .setTitle("TheoryBot - Mandolin")
                                                .setDescription("Mandolin Related Commands")
                                                .addField("Available Commands", `chords\nscales`)
                                                .setFooter("Aliases: mandolin, mandolins, mando, mandos");
                        sendEmbeddedMessage(mandoMessage);
                        break;
                    case "chords":
                    case "chord":
                        sendImage(args[0], "Mandolin Chord Chart", "Chord Chart for a Mandolin in Standard Tuning", "mando chords", "mandolin chords, mandolin chord, mando chords, mando chord", config.mandolinChordChart);
                        break;
                    case "scales":
                    case "scale":
                        sendImage(args[0], "Mandolin Scales Chart", "Scales Chart for a Mandolin in Standard Tuning", "mando scales", "mandolin scales, mando scales, mandolin scale, mando scale", config.mandolinScalesChart);
                        break;
                    default:
                        sendMessage(`${command} ${args[0]} is not a valid TheoryBot command.\n\nSee ${prefix}${command} help for available commands.`);
                        break;
                }
                break;
             case "banjo":
             case "banjos":
                switch (args[0]) {
                    case "":
                    case "help":
                        const banjoMessage = new MessageEmbed()
                                                .setColor(messageColor)
                                                .setTitle("TheoryBot - Banjo")
                                                .setDescription("Banjo Related Commands")
                                                .addField("Available Commands", `chords\n~~scales~~ TBA`)
                                                .setFooter("Aliases: banjo, banjos");
                        sendEmbeddedMessage(banjoMessage);
                        break;
                    case "chords":
                    case "chord":
                        sendImage(args[0], "Banjo Chord Chart", "Chord Chart for a Banjo in Open G Tuning", "banjo chords", "banjo chords, banjo chord, banjos chords, banjos chord", config.banjoChordChart);
                        break;
                    case "scales":
                    case "scale":
                        sendMessage(`Banjo Scales are coming soon!`);
                        // TODO
                        break;
                    default:
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
