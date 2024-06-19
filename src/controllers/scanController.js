const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const fetchIngredientsFromPhoto = async (photoPath) => {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(photoPath), {
        filename: path.basename(photoPath)
    });

    try {
        const response = await fetch('https://reseepe-object-detection-ehx2oeustq-et.a.run.app/object-to-json', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch ingredients: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching ingredients from photo: ' + error.message);
    } finally {
        fs.unlinkSync(photoPath);
    }
};

exports.getIngredientsFromPhoto = async (req, res) => {
    const photo = req.file;
    if (!photo) {
        return res.status(400).json({ error: true, message: 'No photo uploaded' });
    }

    console.log('Uploaded photo path:', photo.path);
    console.log('Uploaded photo originalname:', photo.originalname);

    try {
        const responseData = await fetchIngredientsFromPhoto(photo.path);

        console.log('responseData:', responseData);

        if (!responseData.result) {
            throw new Error('Invalid response from external API');
        }

        res.json({
            error: false,
            message: 'Ingredients fetched successfully',
            ingredientList: responseData.result,
        });
    } catch (error) {
        console.error('Error fetching ingredients from photo:', error.message);
        res.status(500).json({ error: true, message: error.message });
    }
};

exports.getIngredientsFromPhotoTest = async (req, res) => {
    const photoPath = "uploads/ayam.jpg";

    try {
        const responseData = await fetchIngredientsFromPhoto(photoPath);

        console.log('responseData:', responseData);

        if (!responseData.result) {
            throw new Error('Invalid response from external API');
        }

        res.json({
            error: false,
            message: 'Ingredients fetched successfully',
            ingredientList: responseData.result,
        });
    } catch (error) {
        console.error('Error fetching ingredients from photo:', error.message);
        res.status(500).json({ error: true, message: error.message });
    }
};