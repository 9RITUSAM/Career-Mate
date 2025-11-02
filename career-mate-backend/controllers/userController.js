import User from "../models/User.js";

const userController = {
  async createOrUpdateUser(req, res) {
    try {
      const { clerkId, name, email } = req.body;

      if (!clerkId || !name || !email) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      let user = await User.findOne({ clerkId });

      if (user) {
        user.name = name;
        user.email = email;
        await user.save();
      } else {
        user = await User.create({ clerkId, name, email });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error in createOrUpdateUser:", error);
      res
        .status(500)
        .json({ message: "Error creating/updating user", error: error.message });
    }
  },

  async getUserByClerkId(req, res) {
    try {
      const { clerkId } = req.params;
      const user = await User.findOne({ clerkId })
        .populate("tasks")
        .populate("hackathons");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error in getUserByClerkId:", error);
      res
        .status(500)
        .json({ message: "Error fetching user", error: error.message });
    }
  },
};

export default userController;
