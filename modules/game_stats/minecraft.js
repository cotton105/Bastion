/*
 * Copyright (C) 2017 Sankarsan Kampa
 *                    https://sankarsankampa.com/contact
 *
 * This file is a part of Bastion Discord BOT.
 *                        https://github.com/snkrsnkampa/Bastion
 *
 * This code is licensed under the SNKRSN Shared License. It is free to
 * download, copy, compile, use, study and refer under the terms of the
 * SNKRSN Shared License. You can modify the code only for personal or
 * internal use only. However, you can not redistribute the code without
 * explicitly getting permission fot it.
 *
 * Bastion BOT is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY. See the SNKRSN Shared License for
 * more details.
 *
 * You should have received a copy of the SNKRSN Shared License along
 * with this program. If not, see <https://github.com/snkrsnkampa/Bastion/LICENSE>.
 */

const MINECRAFT = require('gamequery');

exports.run = (Bastion, message, args) => {
  if (args.length < 1 || !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:0*(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))?$/.test(args = args[0])) {
    return message.channel.send({
      embed: {
        color: Bastion.colors.yellow,
        title: 'Usage',
        description: `\`${Bastion.config.prefix}${this.help.usage}\``
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }

  args = args.split(':');
  let host = args[0];
  let port;
  if (args[1]) {
    port = parseInt(args[1]);
  }
  else {
    port = 25565;
  }

  MINECRAFT.query({
    type: 'minecraft',
    host: host,
    port: port
  }).then(data => {
    message.channel.send({
      embed: {
        color: Bastion.colors.blue,
        title: data.name,
        description: '[Minecraft](https://minecraft.net/)',
        fields: [
          {
            name: 'Server IP',
            value: `${host}:${port}`,
            inline: true
          },
          {
            name: 'Private',
            value: data.password,
            inline: true
          },
          {
            name: 'Players',
            value: `${data.players.length}/${data.maxplayers}`,
            inline: true
          },
          {
            name: 'Map',
            value: data.raw.map,
            inline: true
          },
          {
            name: 'Gametype',
            value: data.raw.gametype,
            inline: true
          }
        ],
        footer: {
          text: `Version: ${data.raw.version}`
        }
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  }).catch(e => {
    Bastion.log.error(e);
    message.channel.send({
      embed: {
        color: Bastion.colors.red,
        description: 'Can\'t get stats from the specified server. Please check the IP address and PORT number and if the server is online before trying again.'
      }
    }).catch(e => {
      Bastion.log.error(e.stack);
    });
  });
};

exports.config = {
  aliases: [ 'mc' ],
  enabled: true
};

exports.help = {
  name: 'minecraft',
  description: 'Get status of any Minecraft game server by it\'s IP address and optional PORT number.',
  botPermission: '',
  userPermission: '',
  usage: 'minecraft <MC_SERVER_IP>[:PORT]',
  example: [ 'minecraft 139.59.31.129', 'minecraft 139.59.31.129:25565' ]
};