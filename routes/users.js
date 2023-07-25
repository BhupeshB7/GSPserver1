const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// router.post('/userWalletUpdate/:userId', auth, async (req, res) => {
//   const userId = req.params;
//   try {
//     await User.findOne({userId}, { income: 146 });
//     await User.findOne({userId}, { balance: 146 });
//     await User.findOne({userId}, { selfIncome: 120 });
//     await User.findOne({userId}, { teamIncome: 26 });
//     res.sendStatus(200);
//   } catch (error) {
//     console.error('Failed to update user names', error);
//     res.sendStatus(500);
//   }
// });

// router.post("/userWalletUpdating/:userId", async (req, res) => {
//   const { userId } = req.params;
//   try{
//     let user = await User.findOne({ userId : userId});
//     if (!user) {
//       // console.log(`User with ID ${userId} not found`);
//       return res.status(404).send("User not found");
//     }
//     // console.log(`User found: ${JSON.stringify(user)}`);
//     user.balance === 146;
//     user.income === 146;
//     user.selfIncome === 120;
//     user.teamIncome === 26;
//     await user.save();
//   }catch(error){
//     res.status(500).json({error:'Internal server error'})
//   }

// })
// Manually update user wallet through API
router.post("/userWalletUpdating/", async (req, res) => {
  const { userId } = req.body;
  try {
    let user = await User.findOne({ userId: userId }).select('userId');
    if (!user) {
      return res.status(404).send("User not found");
    }
    if (req.body.balance) {
      user.balance = req.body.balance.trim();
    }
    if (req.body.income) {
      user.income = req.body.income.trim();
    }
    if (req.body.selfIncome) {
      user.selfIncome = req.body.selfIncome.trim();
    }
    if (req.body.teamIncome) {
      user.teamIncome = req.body.teamIncome.trim();
    }
    if (req.body.withdrawal) {
      user.withdrawal = req.body.withdrawal.trim();
    }
    if (req.body.rewards) {
      user.rewards = req.body.rewards.trim();
    }
    await user.save();
    res.status(200).send("User wallet updated successfully");
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Example using Express.js
// router.get('/team/:userId', async (req, res) => {
//   const { userId } = req.params;
// const teamUser = await User.findOne({userId:userId});
// if(!teamUser){
//   return res.status(400).json({error:'user not Found'});
// }
//   try {
//     const teamStructure = await getUserTeam(userId);
//     res.json(teamStructure);
//   } catch (error) {
//     console.error('Error fetching team structure:', error);
//     res.status(500).json({ error: 'An error occurred while fetching the team structure.' });
//   }
// });

// // Recursive function to fetch the user's team structure
// async function getUserTeam(userId) {
//   try {
//     const user = await User.find({userId:userId}).select('userId name mobile').lean();
//     // if (!user) {
//     //   return null;
//     // }
//     // const teamStructure = {
//     //   userId: userId,
//     //   // name: name,
//     //   mobile: mobile,
//     //   downline: [],
//     // };
//     // const downlineUser = await User.find({ userId: userId }).select('mobile').lean();
//     const teamStructure = {
//       userId: userId,
//       // name: name,
//       // mobile: mobile,
//       downline: [],
//     };
//     const downlineUsers = await User.find({ sponsorId: userId }).lean().limit(2);
//     for (const downlineUser of downlineUsers) {
//       const downlineTeam = await getUserTeam(downlineUser.userId);
//       teamStructure.downline.push(downlineTeam);
//     }
 

//     return teamStructure;
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     throw error;
//   }
// }

  // Latest team strructure code 
// router.get('/team/:userId', async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const teamStructure = await getUserTeam(userId);
//     res.json(teamStructure);
//   } catch (error) {
//     console.error('Error fetching team structure:', error);
//     res.status(500).json({ error: 'An error occurred while fetching the team structure.' });
//   }
// });

// // Recursive function to fetch the user's team structure
// async function getUserTeam(userId) {
//   try {
//     // const user = await User.findOne({ userId }).lean();
//     const user = await User.findOne({ userId }).select('userId name mobile is_active').lean();

//     if (!user) {
//       return null;
//     }
// const activeStatus = user.is_active ? 'active':'not active'
//     const teamStructure = {
//       userId: user.userId,
//       name: user.name,
//       mobile: user.mobile,
//       status: activeStatus,
//       downline: [],
//     };

//     // const downlineUsers = await User.find({ sponsorId: userId }).lean();
//     // for (const downlineUser of downlineUsers) {
//     //   const downlineTeam = await getUserTeam(downlineUser.userId);
//     //   teamStructure.downline.push(downlineTeam);
//     // }
//     const downlineUsers = await User.find({ sponsorId: userId }).lean();
// const downlinePromises = downlineUsers.map((downlineUser) => getUserTeam(downlineUser.userId));
// const downlineTeam = await Promise.all(downlinePromises);
// teamStructure.downline = downlineTeam;


//     return teamStructure;
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     throw error;
//   }
// }
// latest team structure code end 

//old down line code  line no 176-237
// Get user's team structure
// router.get('/team/:userId', async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const teamStructure = await getUserTeam(userId);
//     res.json(teamStructure);
//   } catch (error) {
//     console.error('Error fetching team structure:', error);
//     res.status(500).json({ error: 'An error occurred while fetching the team structure.' });
//   }
// });

// // Recursive function to fetch the user's team structure
// async function getUserTeam(userId) {
//   try {
//     const user = await User.findOne({ userId }).select('userId name mobile is_active').lean();

//     if (!user) {
//       return null;
//     }

//     const activeStatus = user.is_active ? 'active' : 'not active';
//     const teamStructure = {
//       userId: user.userId,
//       name: user.name,
//       mobile: user.mobile,
//       status: activeStatus,
//       downlineCount: 0,
//       activeDownlineCount: 0,
//       allUsersCount:0,
//       activeUsersCount :0,
//       downline: [],
//     };

//     // const downlineUsers = await User.find({ sponsorId: userId }).lean();
//     // const downlinePromises = downlineUsers.map((downlineUser) => getUserTeam(downlineUser.userId));
//     // const downlineTeam = await Promise.all(downlinePromises);

//     // teamStructure.downline = downlineTeam;
//     // teamStructure.downlineCount = downlineTeam.length;
//     // teamStructure.activeDownlineCount = downlineTeam.reduce((count, downline) => count + (downline.status === 'active' ? 1 : 0), 0);

//     const downlineUsers = await User.find({ sponsorId: userId }).lean();
//     const downlinePromises = downlineUsers.map((downlineUser) => getUserTeam(downlineUser.userId));
//     const downlineTeam = await Promise.all(downlinePromises);

//     teamStructure.downline = downlineTeam;
//     teamStructure.downlineCount = downlineTeam.length;
//     teamStructure.activeDownlineCount = downlineTeam.reduce((count, downline) => count + (downline.status === 'active' ? 1 : 0), 0);

//     // Count number of all users and active users
//     teamStructure.allUsersCount = downlineTeam.reduce((count, downline) => count + downline.allUsersCount + 1, 0);
//     teamStructure.activeUsersCount = downlineTeam.reduce((count, downline) => count + downline.activeUsersCount + (downline.status === 'active' ? 1 : 0), 0);

//     return teamStructure;
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     throw error;
//   }
// }
//old downline code  line no 176 - 237
//
// new downline code 239-299
router.get('/team/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const teamStructure = await getUserTeam(userId, 6); // Set the depth to 5 levels
    res.json(teamStructure);
  } catch (error) {
    console.error('Error fetching team structure:', error);
    res.status(500).json({ error: 'An error occurred while fetching the team structure.' });
  }
});

async function getUserTeam(userId, depth) {
  try {
    if (depth <= 0) {
      // If depth reaches 0, return null to stop recursion
      return null;
    }

    const user = await User.findOne({ userId }).select('userId name mobile is_active').lean();

    if (!user) {
      return null;
    }

    const activeStatus = user.is_active ? 'active' : 'not active';
    const teamStructure = {
      level: 6-depth,
      userId: user.userId,
      name: user.name,
      mobile: user.mobile,
      status: activeStatus,
      downlineCount: 0,
      activeDownlineCount: 0,
      allUsersCount: 0,
      activeUsersCount: 0,
      downline: [],
    };

    const downlineUsers = await User.find({ sponsorId: userId }).lean();
    const downlinePromises = downlineUsers.map((downlineUser) => getUserTeam(downlineUser.userId, depth - 1)); // Decrement depth in recursive call
    const downlineTeam = await Promise.all(downlinePromises);

    // Remove null elements from downlineTeam array
    const filteredDownlineTeam = downlineTeam.filter((item) => item !== null);

    teamStructure.downline = filteredDownlineTeam;
    teamStructure.downlineCount = filteredDownlineTeam.length;
    teamStructure.activeDownlineCount = filteredDownlineTeam.reduce((count, downline) => count + (downline.status === 'active' ? 1 : 0), 0);

    // Count number of all users and active users
    teamStructure.allUsersCount = filteredDownlineTeam.reduce((count, downline) => count + downline.allUsersCount + 1, 0);
    teamStructure.activeUsersCount = filteredDownlineTeam.reduce((count, downline) => count + downline.activeUsersCount + (downline.status === 'active' ? 1 : 0), 0);

    return teamStructure;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}
// new down line code 239-299
// count the Rank of user 
// count the Rank of user End
//latest code that show the Rank
// 
//latest code that show the Rank End
//new latest code that show the Rank start
router.get('/teamRank/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId }).select('userId is_active').lean();

    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    const activeUsersByLevel = await getActiveUsersByLevel(userId, 5, user.is_active); // Set the depth to 5 levels
    const filteredActiveUsersByLevel = filterAchievedRanks(activeUsersByLevel);
    res.json(filteredActiveUsersByLevel);
  } catch (error) {
    console.error('Error fetching team structure:', error);
    res.status(500).json({ error: 'An error occurred while fetching the team structure.' });
  }
});

async function getActiveUsersByLevel(userId, depth, isParentActive) {
  try {
    if (depth <= 0) {
      // If depth reaches 0, return an empty array to stop recursion
      return [];
    }

    const user = await User.findOne({ userId }).select('userId is_active').lean();

    if (!user) {
      return [];
    }

    const activeStatus = user.is_active ? 'active' : 'not active';
    const teamStructure = {
      level: 6 - depth, // The current level, from 1 to 5
      userId: user.userId,
      status: activeStatus,
      activeUsersCount: activeStatus === 'active' ? 1 : 0,
      downline: [],
    };

    const downlineUsers = await User.find({ sponsorId: userId }).lean();
    const downlinePromises = downlineUsers.map((downlineUser) => getActiveUsersByLevel(downlineUser.userId, depth - 1, user.is_active)); // Pass the is_active from the parent
    const downlineResults = await Promise.all(downlinePromises);

    teamStructure.downline = downlineResults.filter((item) => item.length > 0); // Filter out empty results

    // Count number of active users on this level
    teamStructure.activeUsersCount += downlineResults.reduce((count, downline) => count + downline.reduce((c, user) => c + user.activeUsersCount, 0), 0);

    // Assign the rank based on the number of active users at this level
    teamStructure.rank = calculateRank(teamStructure.activeUsersCount, isParentActive);

    return [teamStructure];
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Function to calculate rank based on the number of active users and validate rank achievement
function calculateRank(activeUsersCount, isParentActive) {
  if (!isParentActive) {
    return 'Inactive'; // If the parent is not active, set rank to 'Inactive' for this level
  } else if (activeUsersCount > 2000) {
    return 'Diamond Rank';
  } else if (activeUsersCount > 1000) {
    return 'Gold Rank';
  } else if (activeUsersCount > 400) {
    return 'Silver Rank';
  } else if (activeUsersCount > 70) {
    return 'Bronze Rank';
  } else if (activeUsersCount > 14) {
    return 'Starter Rank';
  } else {
    // If user has not achieved level 1 rank, set rank to 'No Rank'
    return isParentActive ? 'No Rank' : 'Inactive';
  }
}

// Function to filter and remove ranks if the user has not achieved a lower rank
function filterAchievedRanks(teamStructureArray) {
  let maxAchievedRank = 'Inactive';
  return teamStructureArray.filter((teamStructure) => {
    if (teamStructure.rank !== 'Inactive' && teamStructure.rank !== 'No Rank') {
      if (teamStructure.rank === 'Starter Rank') {
        maxAchievedRank = 'Starter Rank';
        return true;
      } else if (teamStructure.rank === 'Bronze Rank' && maxAchievedRank !== 'Starter Rank') {
        maxAchievedRank = 'Bronze Rank';
        return true;
      } else if (teamStructure.rank === 'Silver Rank' && maxAchievedRank !== 'No Rank') {
        maxAchievedRank = 'Silver Rank';
        return true;
      } else if (teamStructure.rank === 'Gold Rank' && maxAchievedRank !== 'No Rank') {
        maxAchievedRank = 'Gold Rank';
        return true;
      } else if (teamStructure.rank === 'Diamond Rank' && maxAchievedRank !== 'No Rank') {
        maxAchievedRank = 'Diamond Rank';
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  });
}

// new latest code that show the Rank End



router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


// router.post('/profileUpdate',auth, async (req, res) => {
//   // const {id}= req.params;

//   try {
    // const user = await User.findById(req.user.id);
    // const user = await User.findById({_id : id});

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     if (req.body.name) {
//       user.name = req.body.name.trim();
//     }
//     if (req.body.accountHolderName) {
//       user.accountHolderName = req.body.accountHolderName.trim();
//     }

//     if (req.body.bio) {
//       user.bio = req.body.bio.trim();
//     }
//     if (req.body.address) {
//       user.address = req.body.address.trim();
//     }
//     if (req.body.accountNo) {
//       user.accountNo = req.body.accountNo.trim();
//     }
//     if (req.body.ifscCode) {
//       user.ifscCode = req.body.ifscCode.trim();
//     }
//      //For google Pay
//      if (req.body.GPay) {
//       const GPay = req.body.GPay.trim();
//       const GPayExists = await User.findOne({ GPay });
//       if (GPayExists && GPayExists._id.toString() !== user._id.toString()) {
//         return res.status(400).json({ error: 'Gpay number already exists' });
//       }
//       user.GPay = GPay;
//     }
//     if (req.body.mobile) {
//       const mobile = req.body.mobile.trim();
//       const mobileExists = await User.findOne({ mobile });
//       if (mobileExists && mobileExists._id.toString() !== user._id.toString()) {
//         return res.status(400).json({ error: 'Mobile number already exists' });
//       }
//       user.mobile = mobile;
//     }
// if (req.body.aadhar) {
//       const aadhar = req.body.aadhar.trim();
//       const aadharExists = await User.findOne({ aadhar });
//       if (aadharExists && aadharExists._id.toString() !== user._id.toString()) {
//         return res.status(400).json({ error: 'Aadhar number already exists' });
//       }
//       user.aadhar = aadhar;
//     }
//     if (req.body.email) {
//       const email = req.body.email.trim().toLowerCase();
//       const emailExists = await User.findOne({ email });
//       if (emailExists && emailExists._id.toString() !== user._id.toString()) {
//         return res.status(400).json({ error: 'Email already exists' });
//       }
//       user.email = email;
//     }

//     await user.save();

//     res.json({ message: 'Profile updated successfully' });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Server Error for updation');
//   }
// });


router.post('/profileUpdate',auth, async (req, res) => {
  // const {id}= req.params;

  try {
    const user = await User.findById(req.user.id);
    // const user = await User.findById({_id : id});

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.body.name) {
      user.name = req.body.name.trim();
    }
    if (req.body.accountHolderName) {
      user.accountHolderName = req.body.accountHolderName.trim();
    }

    if (req.body.bio) {
      user.bio = req.body.bio.trim();
    }
    if (req.body.address) {
      user.address = req.body.address.trim();
    }
    if (req.body.accountNo) {
      user.accountNo = req.body.accountNo.trim();
    }
    if (req.body.ifscCode) {
      user.ifscCode = req.body.ifscCode.trim();
    }
     //For google Pay
     if (req.body.GPay) {
      const GPay = req.body.GPay.trim();
      const GPayExists = await User.findOne({ GPay });
      if (GPayExists && GPayExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: 'Gpay number already exists' });
      }
      user.GPay = GPay;
    }
    if (req.body.mobile) {
      const mobile = req.body.mobile.trim();
      const mobileExists = await User.findOne({ mobile });
      if (mobileExists && mobileExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: 'Mobile number already exists' });
      }
      user.mobile = mobile;
    }
if (req.body.aadhar) {
      const aadhar = req.body.aadhar.trim();
      const aadharExists = await User.findOne({ aadhar });
      if (aadharExists && aadharExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: 'Aadhar number already exists' });
      }
      user.aadhar = aadhar;
    }
    if (req.body.email) {
      const email = req.body.email.trim().toLowerCase();
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      user.email = email;
    }

    await user.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error for updation');
  }
});

router.post('/activeuser/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    
    let user = await User.findOne({ userId: userId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Find the active user based on userId: sponsorId
    const sponsor = await User.find({ userId: user.sponsorId });

    // Count the number of active users based on sponsorId
    // let spnosorCount = await User.countDocuments({ userId: user.sponsorId, is_active: true });
    const sponsorCount = await User.countDocuments({ sponsorId: user.userId, is_active: true });
    const sponsor1 = await User.find({ sponsorId: user.userId, is_active: true });
    const sponsorTotalCount = await User.countDocuments({ sponsorId: user.userId });

    // Count the number of active users based on sponsor.sponsorId
    const sponsor2Count = await User.countDocuments({sponsorId: sponsorCount, is_active: true });

    // Count the number of active users based on sponsor2.sponsorId
    const sponsor3Count = await User.countDocuments({ sponsorId: sponsor2Count, is_active: true });

    // Count the number of active users based on sponsor3.sponsorId
    const sponsor4Count = await User.countDocuments({ sponsorId: sponsor3Count?.sponsorId, is_active: true });

    const data = {
      // activeUser: user,
      sponsor1,
      sponsorCount,
      sponsorTotalCount,
      sponsor2Count,
      sponsor3Count,
      sponsor4Count,
    };

    // console.log(data);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API route to get a user's sponsors
router.get('/sponsors', async (req, res) => {
  try {
    const {userId } = req.query;

    // Find the user's sponsor
    const user = await User.findOne({userId }).select('activationTime createdAt name usesrId income balance withdrawal selfIncome teamIncome rewards accountNo ifscCode GPay');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find all sponsors
    // const sponsors = await User.find({ sponsorId: user.userId });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to handle the request
// router.get('/find-matching-sponsors/:userId', async (req, res) => {
//   const { userId } = req.params;

//   try {
//       // Find all users whose sponsorId matches the given userId
//       const matchedUsers = await User.find({ sponsorId: userId });

//       // Extract the sponsorIds from the matched users
//       const sponsorIds = matchedUsers.map(user => user.sponsorId);
  
//       // Find all users whose sponsorId is in the sponsorIds array
//       const matchedUsers2 = await User.find({ sponsorId: { $in: sponsorIds } });
  
//       // Extract the sponsorIds from the second set of matched users
//       const sponsorIds2 = matchedUsers2.map(user => user.sponsorId);

//       // Find all users whose sponsorId is in the sponsorIds2 array
//       const matchedUsers3 = await User.find({ sponsorId: { $in: sponsorIds2 } });
  
//       // Extract the sponsorIds from the third set of matched users
//       const sponsorIds3 = matchedUsers3.map(user => user.sponsorId);
  
//       res.json({ sponsorIds: sponsorIds3 });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });





// API route to get different sponsors based on all sponsors
// router.get('/api/users/different-sponsors/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;

   
//     // Find the user's sponsor
//     const user = await User.findOne({ userId });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Find all sponsors
//     const sponsors = await User.find({ sponsorId: user.userId });

//     if (sponsors.length === 0) {
//       return res.json([]);
//     }

//     // Find different sponsors based on all sponsors
//     const differentSponsors = await User.find({
//       sponsorId: { $nin: sponsors.map((sponsor) => sponsor.userId) },
//     });

//     res.json(differentSponsors);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

module.exports = router;
