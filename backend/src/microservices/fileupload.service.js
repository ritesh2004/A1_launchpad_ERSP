import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const fileTypes = ['image/jpeg', 'image/png', 'image/webp'];

const fileFilter = (req, file, cb) => {
    if (fileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const multerUpload = multer({ storage, fileFilter })

const uploadToCloudinary = async (file) => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const result = await cloudinary.uploader.upload(
            file.path,
            {
                resource_type: 'auto',
                use_filename: true,
                unique_filename: false,
                folder: 'A1_Fence_Project',
            }
        ).catch((error) => {
            fs.unlinkSync(file.path); // Clean up the local file on error
            throw new Error(`Cloudinary upload failed: ${error.message}`);
        });
        // Clean up the local file after upload
        
        fs.unlinkSync(file.path);
        return result;
    } catch (error) {
        throw new Error(`Error uploading to Cloudinary: ${error.message}`);
    }
}


export { multerUpload, uploadToCloudinary };