const fs = require("fs");
const { promisify } = require("util");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const FormData = require("form-data");

const unlinkAsync = promisify(fs.unlink);

const fetchIngredientsFromPhoto = async (photoPath) => {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(photoPath));

  try {
    console.log("Sending request to external server...");
    const response = await fetch(
      "https://reseepe-object-detection-ehx2oeustq-et.a.run.app/object-to-json",
      {
        method: "POST",
        body: formData,
      }
    );

    console.log("Response received:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to fetch ingredients: ${response.statusText} - ${errorText}`
      );
      throw new Error(
        `Failed to fetch ingredients: ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Data received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching ingredients from photo:", error.message);
    throw new Error(`Error fetching ingredients from photo: ${error.message}`);
  } finally {
    try {
      await unlinkAsync(photoPath);
    } catch (unlinkError) {
      console.error("Error removing uploaded photo:", unlinkError.message);
    }
  }
};

exports.getIngredientsFromPhoto = async (req, res) => {
  const photo = req.file;
  if (!photo) {
    return res.status(400).json({ error: true, message: "No photo uploaded" });
  }
  console.log("Photo uploaded:", photo);

  try {
    const responseData = await fetchIngredientsFromPhoto(photo.path);
    if (!responseData.result) {
      throw new Error("Invalid response from external API");
    }

    const ingredientList = responseData.result.map((item) => ({
      name: item.name,
    }));

    res.json({
      error: false,
      message: "Ingredients fetched successfully",
      ingredientList: ingredientList,
    });
  } catch (error) {
    console.error("Error fetching ingredients from photo:", error.message);
    res.status(500).json({ error: true, message: error.message });
  }
};
