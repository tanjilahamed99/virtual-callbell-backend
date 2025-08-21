const axios = require("axios");
const User = require("../../../models/User");

const getPageUrl = async (req, res, next) => {
  try {
    const { amount, userId } = req.body;

    const keys = {
      mid: "TARASONS",
      password: "6Qij^91KoLxt",
    };

    if (!keys) {
      return res.send({
        success: false,
        message: "Something is wrong",
      });
    }
    // Validate input
    if (!userId || !amount) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // Update user data in the database
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a unique receipt ID
    const receiptId = `REC-${Date.now()}-${Math.floor(
      Math.random() * 1000000
    )}`;

    const { data } = await axios.post(
      "https://server.paygic.in/api/v3/createMerchantToken",
      {
        mid: keys.mid,
        password: keys.password,
        expiry: false,
      }
    );

    const { data: response } = await axios.post(
      "https://server.paygic.in/api/v2/createPaymentPage",
      {
        mid: keys.mid, // Merchant ID
        merchantReferenceId: receiptId, // Unique reference ID
        amount: String(amount), // Amount
        customer_mobile: "4355435545",
        customer_name: user.name,
        customer_email: user.email,
        redirect_URL: `${process.env.FRONTEND_URL}/payment/success?refId=${receiptId}`,
        failed_URL: `${process.env.FRONTEND_URL}/payment/failed`,
      },
      {
        headers: {
          token: data.data.token,
        },
      }
    );
    if (response.status) {
      return res.send({
        success: true,
        payPageUrl: response.data.payPageUrl,
        message: response.msg,
      });
    } else {
      return res.send({
        success: false,
        message: "Same thing error here",
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = getPageUrl;
