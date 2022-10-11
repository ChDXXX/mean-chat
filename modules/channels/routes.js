const express = require("express");
const {ChannelsController} = require("./channels.controller");
const {parseToken} = require("../../middlewares/permission.middleware");

const router = express.Router();

router.put('/:channel_id/upgrade', ChannelsController.upgradeUserToAssis);
router.get('/:channel_id/users', ChannelsController.getUsersOfChannel);
router.delete('/:channel_id/remove/:user_id', ChannelsController.removeUserFromChannel);
router.put('/:channel_id/invite', ChannelsController.inviteUserToChannel);
router.post('/:channel_id/create-user', parseToken, ChannelsController.createUserOfChannel);
router.post('', parseToken, ChannelsController.createChannel);
router.delete('/:channel_id', ChannelsController.removeChannel);


module.exports = router;