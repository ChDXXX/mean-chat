
const GET_CHANNEL_GROUPS_PIPELINE = (user_id) => {
  return [
    {
      $match: {
        _id: user_id
      }
    },
    {
      $unwind: {
        path: '$roles'
      }
    },
    {
      $replaceRoot: {
        newRoot: '$roles'
      }
    },
    {
      $match: {
        $or: [
          {
            role: 20
          },
          {
            role: 10
          }
        ]
      }
    },
    {
      $lookup: {
        from: 'channels',
        localField: 'channel',
        foreignField: '_id',
        as: 'channel'
      }
    },
    {
      $unwind: {
        path: '$channel'
      }
    },
    {
      $replaceRoot: {
        newRoot: '$channel'
      }
    },
    {
      $lookup: {
        from: 'groups',
        localField: 'group',
        foreignField: '_id',
        as: 'group'
      }
    },
    {
      $unwind: {
        path: '$group'
      }
    },
    {
      $replaceRoot: {
        newRoot: '$group'
      }
    },
    {
      $lookup: {
        from: 'channels',
        localField: 'channels',
        foreignField: '_id',
        as: 'channels'
      }
    }
  ]
}

module.exports = {
  GET_CHANNEL_GROUPS_PIPELINE
}