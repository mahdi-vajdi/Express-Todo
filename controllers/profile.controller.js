const Profile = require("../models/profile.model");

exports.createProfile = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "User ID is required" });

  // Check for duplicate profile in db
  const duplicate = await Profile.findOne({ userId }).exec();
  if (duplicate) return res.sendStatus(409);

  try {
    const result = await Profile.create(req.body);
    console.log(result);
    res.status(200).json({ success: "Profile created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user.id }).exec();
  console.log("profile", profile);
  if (!profile)
    return res
      .status(404)
      .json({ message: "You haven't created your profile yet" });

  res.status(200).json(profile);
};

exports.updateProfile = async (req, res) => {
  const profile = await Profile.findOneAndUpdate(
    { userId: req.user.id },
    req.body,
    { returnDocument: "after", runValidators: true }
  );
  if (!profile) res.status(404).json({ message: "Couldn't find a profile" });
  res.status(200).json({ message: "Profile updated successfully", profile });
};
