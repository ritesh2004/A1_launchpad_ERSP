import { saveToGoogleSheet,updateGoogleSheet,getGoogleSheetDataByRequestId,getAllGoogleSheetData } from "../utils/googlesheet.utils.js";
import { HTTP_STATUS_CODES } from "../utils/httpStatus.js";
import { v4 as uuidv4 } from 'uuid';

export const createRepairRequest = async (req, res) => {
    const { name, serialno, product_model, product_details, dop, image_url, fault_description } = req.body;

    try {
        // generate a unique request ID
        const requestId = uuidv4()
        const result = await saveToGoogleSheet({ name, requestId, serialno, product_model, product_details, dop, image_url, fault_description, status: 'Pending', isReviewed: false, isRepaired: false, amount: 0 });

        if (result.success) {
            return res.status(HTTP_STATUS_CODES.CREATED).json({
                success: true,
                message: 'Repair request created successfully',
                data: result.data
            });
        } else {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        console.error('Error creating repair request:', error);
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error creating repair request',
            error: error.message
        });
    }
}

export const updateRepairRequest = async (req, res) => {
    const { requestId } = req.params;

    try {
        const result = await updateGoogleSheet({ data: req.body, cols: ['status', 'isRepaired', 'isReviewed', 'isApproved'], requestId });

        if (result.success) {
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                message: 'Repair request updated successfully',
                data: result.data
            });
        } else {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        console.error('Error updating repair request:', error);
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error updating repair request',
            error: error.message
        });
    }
}

export const getRepairRequestById = async (req, res) => {
    const { requestId } = req.params;

    try {
        const data = await getGoogleSheetDataByRequestId(requestId);

        if (data) {
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: data
            });
        } else {
            return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                success: false,
                message: 'Repair request not found'
            });
        }
    } catch (error) {
        console.error('Error fetching repair request:', error);
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error fetching repair request',
            error: error.message
        });
    }
}

export const getAllRepairRequests = async (req, res) => {
    try {
        const data = await getAllGoogleSheetData();

        if (data && data.length > 0) {
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: data
            });
        } else {
            return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                success: false,
                message: 'No repair requests found'
            });
        }
    } catch (error) {
        console.error('Error fetching all repair requests:', error);
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error fetching all repair requests',
            error: error.message
        });
    }
}