const { AccessToken } = require("livekit-server-sdk");

const getLiveKit = async (req, res, next) => {
  try {
    const { roomName, username } = req.query;

    // Create token
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { identity: username }
    );

    // Add permissions
    at.addGrant({ roomJoin: true, room: roomName });

    // Wait for the token string
    const token = await at.toJwt();

    res.json({ token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = getLiveKit;
