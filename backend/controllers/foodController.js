import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";

// ✅ ADD FOOD (SAFE, ERROR-FREE)
const addFood = async (req, res) => {
  try {
    // 1️⃣ Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required. Please upload an image file.",
      });
    }

    const image_filename = req.file.filename;

    // 2️⃣ Prepare the food item
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename,
    });

    // 3️⃣ OPTIONAL ADMIN CHECK (disabled for testing)
    // If you want admin control, uncomment:
    /*
    if (req.body.userId) {
      const userData = await userModel.findById(req.body.userId);
      if (!userData || userData.role !== "admin") {
        return res.json({ success: false, message: "You are not admin" });
      }
    }
    */

    // 4️⃣ Save food item
    await food.save();

    return res.json({
      success: true,
      message: "Food Added Successfully",
    });

  } catch (error) {
    console.log("ADD FOOD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// ✅ FETCH ALL FOOD ITEMS
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    return res.json({
      success: true,
      data: foods,
    });
  } catch (error) {
    console.log("LIST FOOD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// ✅ REMOVE FOOD (SAFE)
const removeFood = async (req, res) => {
  try {
    // 1️⃣ Optional admin check
    /*
    const userData = await userModel.findById(req.body.userId);
    if (!userData || userData.role !== "admin") {
      return res.json({ success: false, message: "You are not admin" });
    }
    */

    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    // 2️⃣ Delete image from uploads folder
    try {
      fs.unlink(`uploads/${food.image}`, () => {});
    } catch (err) {
      console.log("Image delete error:", err);
    }

    // 3️⃣ Remove from database
    await foodModel.findByIdAndDelete(req.body.id);

    return res.json({
      success: true,
      message: "Food Removed Successfully",
    });

  } catch (error) {
    console.log("REMOVE FOOD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { addFood, listFood, removeFood };

