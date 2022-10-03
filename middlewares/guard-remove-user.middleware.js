const channelService = require("../modules/channels/channels.service");
const guardRemoveUserMiddleware = async (req, res, next) => {
  const user = req.user;
  const deleted_user_id = req.params.user_id;


  // check if current user is deleted user's creator
  if (
    user.id.toString() === user_instance.creator.toString()
  ) {
    return next();
  }

  // check if current user is the admin of deleted user's channel
  const channels = await channelService.findChannelsByUser()
}
module.exports = {
  guardRemoveUserMiddleware
}