import { uploadToCloudinary } from '../microservices/fileupload.service.js';
import { HTTP_STATUS_CODES } from '../utils/httpStatus.js';

export const uploadFileController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: 'No file uploaded' });
        }

        const result = await uploadToCloudinary(req.file);
        res.status(HTTP_STATUS_CODES.OK).json({ message: 'File uploaded successfully', data: { url: result.secure_url } });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: `File upload failed: ${error.message}` });
    }
}