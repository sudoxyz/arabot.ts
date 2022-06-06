module default {
  abstract type Base {
    annotation title := 'Base Discord Object';
    annotation description := 'Represents a data model that is identifiable by a Snowflake (i.e. Discord API data models). https://discord.js.org/#/docs/discord.js/13.7.0/class/Base';

    required property snowflake extending snowflake -> int64 {
      constraint exclusive;
    };
  }

  abstract type Created {
    annotation title := 'Created Discord Object';
    annotation description := 'Represents a data model that was created by a discord user';

    property createdAt -> datetime {
      readonly := true;
    }
    property createdTimestamp := to_duration(.createdAt);
  }

  abstract type Emoji extending Base, Created {
    property animated -> bool;
    property createdAt -> datetime;
    property createdTimestamp := to_duration(.createdAt);
    property identifier -> str;
    required property name -> str;
  }

  type Guild extending Base, Created {
    # link afkChannel -> channel::VoiceChannel;
    multi link channels := Guild.<guild[IS channel::GuildChannel];
    multi link members := Guild.<guild[IS member::GuildMember];
  }

  abstract property snowflake {
    annotation title := 'Discord Snowflake';
    annotation description := 'A Twitter snowflake, except the epoch is 2015-01-01T00:00:00.000Z. https://discord.js.org/#/docs/discord.js/13.7.0/typedef/Snowflake';
    readonly := true;
  }

  type User extending Base, Created {
    annotation title := 'Discord User';
    annotation description := 'Represents a user on Discord. https://discord.js.org/#/docs/discord.js/13.7.0/class/User';

    property accentColor -> int64;
    property avatar -> str;
    property banner -> str;
    property bot -> bool;
    property defaultAvatarURL -> str;
    property discriminator -> str;
    # link dmChannel -> channel::DMChannel;
    link flags -> UserFlags;
    property hexAccentColor -> str;
    property tag -> str;
    property username -> str;
  }

  type UserFlags {
    property bitfield -> int64;
    property flags -> json;
  }
}

module channel {
  type CategoryChannel extending GuildChannel {
    multi link children := CategoryChannel.<parent[IS GuildChannel];
  }

  abstract type Channel extending default::Base, default::Created {
    required link channel_type -> ChannelType;
  }

  scalar type ChannelType extending enum<GUILD_TEXT, DM, GUILD_VOICE, GROUP_DM, GUILD_CATEGORY, GUILD_NEWS, GUILD_NEWS_THREAD, GUILD_PUBLIC_THREAD, GUILD_PRIVATE_THREAD, GUILD_STAGE_VOICE, GUILD_DIRECTORY, UNKNOWN>;

  abstract type GuildChannel extending Channel {
    annotation title := 'Discord Guild Channel';
    annotation description := 'Represents a guild channel from any of the following: TextChannel, VoiceChannel, CategoryChannel, NewsChannel, StoreChannel, StageChannel. https://discord.js.org/#/docs/discord.js/13.7.0/class/GuildChannel';

    required link guild -> default::Guild;
    required property guildId -> int64;
    property name -> str;
    link parent -> CategoryChannel;
    property parentId -> int64;
    multi link permissionOverwrites := GuildChannel.<channel[IS PermissionOverwrites];
  }

  scalar type OverwriteType extending enum<role, member>;

  type Permissions {
    property bitfield -> bigint;
    property allPermissions -> bigint;
    property defaultPermissions -> bigint;
    property flags -> array<str>;
    property stageModerator -> bigint;
  }

  type PermissionOverwrites {
    link allowPermissions -> Permissions;
    link channel -> GuildChannel;
    link denyPermissions -> Permissions;
    property targetId -> int64;
    property overwriteType -> OverwriteType;
  }

  abstract type TextBasedChannel {
    # link lastMessage -> default::Message;
    property lastMessageId -> int64;
    property lastPinAt -> datetime;
    property lastPinTimestamp := to_duration(.lastPinAt);
    property rateLimitPerPerson -> int64;
  }

  type TextChannel extending GuildChannel, TextBasedChannel {
    property nsfw -> bool;
    multi link threads := TextChannel.<parent[IS ThreadChannel];
  }

  type ThreadChannel extending Channel, TextBasedChannel {
    property archived -> bool;
    property archivedAt -> datetime;
    property archiveTimestamp := to_duration(.archivedAt);
    property autoArchiveDuration -> int64;
    link guild -> default::Guild;
    property guildId -> int64;
    multi link guildMembers -> member::GuildMember;
    property locked -> bool;
    property memberCount -> int64;
    multi link members := ThreadChannel.<thread[IS member::ThreadMember];
    property messageCount -> int64;
    # multi link messages -> Message;
    property name -> str;
    required property ownerId -> int64;
    required link parent -> TextChannel;
    required property parentId -> int64;
  }
}

module member {
  scalar type BannedStatus extending enum<Unbanned, TempBanned, PermaBanned>;

  type GuildMember extending default::Base {
    required link guild -> default::Guild;
    property banned_status -> BannedStatus;
    multi link alts -> GuildMember;
  }

  alias Alt := GuildMember {
    alt_of := GuildMember.<alts[IS GuildMember]
  };

  type ThreadMember extending default::Base {
    link guildMember -> GuildMember;
    property joinedAt -> datetime;
    property joinedTimestamp := to_duration(.joinedAt);
    link thread -> channel::ThreadChannel;
    link user -> default::User;
  }
}
