
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/transferDetail", async (req, res) => {
  try {
    const users = await User.find({ "pendingTransfer.status": "Pending" });
    const pendingTransfers = users.map((user) => ({
       id:user._id,
      userId: user.userId,
      userName: user.name,
      pendingTransfer: user.pendingTransfer,
    }));
    res.json(pendingTransfers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to request for fund transfer
router.post("/transfer/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const transferAmount = req.body.amount;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // console.log(user.name, user.userId);

    // console.log("*===============*");
    // console.log("User Income Balance before transfer:", user.balance);
    // console.log("Transfer Amount:", transferAmount);
    // console.log("*===============*");
    if (!user.is_active) {
      return res.status(403).json({ error: "User is not active" });
    }
    // Check if there is a user with the same SponsorId and is_active
    const sponsorIdMatches = await User.countDocuments({ sponsorId: user.userId, is_active: true });
    if (sponsorIdMatches < 1) {
      return res.status(400).json({ error: "Minimum One active users  required for fund transfer" });
    }

    if(transferAmount <= 850 ){
      res.json({error:'Minimum/Low  Balance'})
    }
    // if (transferAmount <= user.balance) {
    //   const deduction = transferAmount * 0.05; // 10% deduction
    //   const transferAfterDeduction = transferAmount - deduction;

    //   user.balance -= transferAmount;
    //   user.pendingTransfer = {
    //     amount: transferAfterDeduction,
    //     deduction: deduction,
    //     status: "Pending",
    //   };

    //   await user.save();

    //   // console.log("User Income Balance after transfer:", user.balance);

    //   res.json({
    //     message: "Transfer requested and pending approval.",
    //     balance: user.balance,
    //   });
    // }
    if (transferAmount <= user.balance) {
      const deduction = transferAmount * 0.05; // 5% deduction
      const transferAfterDeduction = transferAmount - deduction;

      user.balance -= transferAmount;
      user.pendingTransfer.push({
        amount: transferAfterDeduction,
        deduction: deduction,
        status: "Pending",
      });

      await user.save();

      res.json({
        message: "Transfer requested and pending approval.",
        balance: user.balance,
      });
    } 
     else {
      console.log("Insufficient funds in the income wallet.");
      res.status(400).json({
        error: "Insufficient funds in the income wallet.",
        balance: user.balance,
      });
    }
  } catch (error) {
    // console.error("Error during transfer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.post("/transfer/approve/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const pendingTransfer = user.pendingTransfer.find(transfer => transfer.status === "Pending");
    if (!pendingTransfer) {
      return res.status(400).json({ error: "No pending transfer to approve." });
    }

    user.topupWallet += pendingTransfer.amount;
    pendingTransfer.status = "Approved"; // Update the status of the pendingTransfer

    await user.save();
    res.json({ message: "Transfer approved and funds moved to TOPUP wallet.", user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/transfer/reject/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const pendingTransfer = user.pendingTransfer.find(transfer => transfer.status === "Pending");
    if (!pendingTransfer) {
      return res.status(400).json({ error: "No pending transfer to reject." });
    }

    user.balance += pendingTransfer.amount + pendingTransfer.deduction;
    pendingTransfer.status = "Rejected"; // Update the status of the pendingTransfer

    await user.save();
    res.json({
      message: "Transfer rejected and funds returned to the income wallet.",user
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
