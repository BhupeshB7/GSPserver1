
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

// app.post('/api/transfer/:userId', async (req, res) => {
//     try {
//       const userId = req.params.userId;
//       const transferAmount = parseFloat(req.body.amount);
//       const user = await User.findById(userId);

//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
//       if (transferAmount <= 0) {
//         return res.status(400).json({ error: 'Invalid transfer amount. Transfer amount must be greater than 0.' });
//       }
//       if (transferAmount <= user.balance) {
//         const deduction = transferAmount * 0.1; // 10% deduction
//         const transferAfterDeduction = transferAmount - deduction;

//         user.balance -= transferAmount;
//         user.pendingTransfer = {
//           amount: transferAfterDeduction,
//           deduction: deduction,
//         };

//         await user.save();
//         res.json({ message: 'Transfer requested and pending approval.' });
//       } else {
//         res.status(400).json({ error: 'Insufficient funds in the income wallet.' });

//       }
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//       console.log(chalk.bgRed.blue(error))
//     }
//   });
// // Route to approve fund transfer (for admin)
// app.post('/api/approve/:userId', async (req, res) => {
//     try {
//       const userId = req.params.userId;
//       const user = await User.findById(userId);

//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       const pendingTransfer = user.pendingTransfer;
//       if (!pendingTransfer) {
//         return res.status(400).json({ error: 'No pending transfer to approve.' });
//       }

//       user.topupWallet += pendingTransfer.amount;
//       user.pendingTransfer = null;

//       await user.save();
//       res.json({ message: 'Transfer approved and funds moved to TOPUP wallet.', pendingTransfer:{amount:user.amount, deduction:user.deduction}, balance:balance });
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//       console.log(chalk.bgRed.green(error))
//     }
//   });
// // Route to reject fund transfer (for admin)
// app.post('/api/reject/:userId', async (req, res) => {
//     try {
//       const userId = req.params.userId;
//       const user = await User.findById(userId);

//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       const pendingTransfer = user.pendingTransfer;
//       if (!pendingTransfer) {
//         return res.status(400).json({ error: 'No pending transfer to reject.' });
//       }

//       user.balance += (pendingTransfer.amount + pendingTransfer.deduction);
//       user.pendingTransfer = null;

//       await user.save();
//       res.json({ message: 'Transfer rejected and funds returned to the income wallet.' });
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });

// module.exports = router;










// server/routes/transferRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/transferDetail', async (req, res) => {
  try {
    const users = await User.find({ 'pendingTransfer.status': 'Pending' });
    const pendingTransfers = users.map((user) => ({
      userId: user._id,
      userName: user.name,
      pendingTransfer: user.pendingTransfer,
    }));
    res.json(pendingTransfers);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Route to request for fund transfer
router.post('transfer/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const transferAmount = req.body.amount;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (transferAmount <= user.incomeWallet) {
      const deduction = transferAmount * 0.1; // 10% deduction
      const transferAfterDeduction = transferAmount - deduction;

      user.incomeWallet -= transferAmount;
      user.pendingTransfer = {
        amount: transferAfterDeduction,
        deduction: deduction,
      };

      await user.save();
      res.json({ message: 'Transfer requested and pending approval.' });
    } else {
      res.status(400).json({ error: 'Insufficient funds in the income wallet.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to approve fund transfer (for admin)
router.post('transfer/approve/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const pendingTransfer = user.pendingTransfer;
    if (!pendingTransfer || pendingTransfer.status !== 'Pending') {
      return res.status(400).json({ error: 'No pending transfer to approve.' });
    }

    user.topupWallet += pendingTransfer.amount;
    user.pendingTransfer.status = 'Approved'; // Update the status of the pendingTransfer

    await user.save();
    res.json({ message: 'Transfer approved and funds moved to TOPUP wallet.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to reject fund transfer (for admin)
router.post('transfer/reject/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const pendingTransfer = user.pendingTransfer;
    if (!pendingTransfer || pendingTransfer.status !== 'Pending') {
      return res.status(400).json({ error: 'No pending transfer to reject.' });
    }

    user.incomeWallet += (pendingTransfer.amount + pendingTransfer.deduction);
    user.pendingTransfer.status = 'Rejected'; // Update the status of the pendingTransfer

    await user.save();
    res.json({ message: 'Transfer rejected and funds returned to the income wallet.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
