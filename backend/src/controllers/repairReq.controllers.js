import { saveToGoogleSheet,updateGoogleSheet,getGoogleSheetDataByRequestId,getAllGoogleSheetData } from "../utils/googlesheet.utils.js";
import { HTTP_STATUS_CODES } from "../utils/httpStatus.js";
import { v4 as uuidv4 } from 'uuid';
import User from "../models/user.models.js";
import { addEmailToQueue } from "../redis/producer.js";

export const createRepairRequest = async (req, res) => {
    const { name, serialno, product_model, product_details, dop, image_url, fault_description } = req.body;

    try {
        // generate a unique request ID
        const requestId = uuidv4()
        const result = await saveToGoogleSheet({ name, requestId, serialno, product_model, product_details, dop, image_url, fault_description, status: 'Pending', isReviewed: false, isRepaired: false, amount: 0 });

        if (result.success) {
            const servicer = await User.find({ role: 'servicer' });
            if (servicer) {
                // Prepare email data
                servicer.forEach(serv => {
                    const emailData = {
                        to: serv.email,
                        subject: 'New Repair Request',
                        html: `
                            <h1>New Repair Request</h1>
                            <p>A new repair request has been created with the following details:</p>
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Serial No:</strong> ${serialno}</p>
                            <p><strong>Product Model:</strong> ${product_model}</p>
                            <p><strong>Product Details:</strong> ${product_details}</p>
                            <p><strong>Date of Purchase:</strong> ${dop}</p>
                            <p><strong>Fault Description:</strong> ${fault_description}</p>
                            <p><strong>Request ID:</strong> ${requestId}</p>
                            <p>Please review the request and take necessary actions.</p>
                            <img src="${image_url}" alt="Product Image" style="max-width: 300px; max-height: 300px;"/></p>
                            <br>
                            <b>Thank you!</b>
                            <p>Best regards,</p>
                            <p>A1ElectroRepair Team</p>
                        `
                    };
    
                    // Add email to the queue
                    addEmailToQueue(emailData);
                })
            }
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