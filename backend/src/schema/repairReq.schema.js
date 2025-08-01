import { z } from 'zod';

export const createRepairReqSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    serialno: z.string().min(1, 'Serial number is required'),
    product_model: z.string().min(1, 'Product model is required'),
    product_details: z.string().min(1, 'Product details are required'),
    dop: z.string().min(1, 'Date of purchase is required'),
    image_url: z.string().min(1, 'Image URL is required'),
    fault_description: z.string().min(1, 'Fault description is required')
});

export const updateRepairReqSchema = z.object({
    status: z.string().optional(),
    isRepaired: z.boolean().optional(),
    isReviewed: z.boolean().optional(),
    isApproved: z.boolean().optional()
});