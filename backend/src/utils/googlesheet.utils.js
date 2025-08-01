import { google } from 'googleapis';
import fs from 'fs';
import { configDotenv } from 'dotenv';

configDotenv();

const credentials = JSON.parse(fs.readFileSync('a1launchpadersp-d8a3db862a15.json', 'utf8'));

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const mapping = {
    name: 'A',
    requestId: 'B',
    serialno: 'C',
    product_model: 'D',
    product_details: 'E',
    dop: 'F',
    image_url: 'G',
    fault_description: 'H',
    status: 'I',
    isReviewed: 'J',
    isRepaired: 'K',
    isApproved: 'L',
    amount: 'M',
    createdAt: 'N',
    updatedAt: 'O',
};

const saveToGoogleSheet = async (data) => {
    try {
        const googleSheet = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;
        // Ensure the header row (columns) exists
        const header = [
            'Name',
            'requestId',
            'Serial No',
            'Product Model',
            'Product Details',
            'Date of Purchase',
            'Image URL',
            'Fault Description',
            'Status',
            'isReviewed',
            'isRepaired',
            'isApproved',
            'amount',
            'Created At',
            'Updated At',
        ];
    
        // Check if header exists, if not, set it
        const getHeader = await googleSheet.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1!A1:Z1',
        });
    
        if (
            !getHeader.data.values ||
            getHeader.data.values.length === 0 ||
            JSON.stringify(getHeader.data.values[0]) !== JSON.stringify(header)
        ) {
            await googleSheet.spreadsheets.values.update({
                spreadsheetId,
                range: 'Sheet1!A1:Z1',
                valueInputOption: 'RAW',
                requestBody: {
                    values: [header],
                },
            });
        }
        const values = [
            data.name,
            data.requestId || '',
            data.serialno,
            data.product_model || '',
            data.product_details,
            data.dop,
            data.image_url,
            data.fault_description,
            data.status || 'Pending',
            data.isReviewed || false,
            data.isRepaired || false,
            data.isApproved || false,
            data.amount || 0,
            new Date().toISOString(),
            new Date().toISOString(),
        ]
    
        await googleSheet.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A2',
            valueInputOption: 'RAW',
            requestBody: {
                values: [values],
            }
        })
    
        console.log('Data saved to Google Sheet successfully');
        return {
            success: true,
            message: 'Data saved to Google Sheet successfully',
            data: {
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        };
    } catch (error) {
        console.error('Error saving data to Google Sheet:', error);
        return {
            success: false,
            message: 'Error saving data to Google Sheet',
            error: error.message,
        };
    }
}

const updateGoogleSheet = async ({ data, cols, requestId }) => {
    try {
        const googleSheet = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        // Fetch the existing data to find the row index
        const response = await googleSheet.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1!A2:Z',
        });

        const rowIndex = response.data.values.findIndex(row => row[1] === requestId);
        if (rowIndex === -1) {
            return {
                success: false,
                message: 'Request ID not found in Google Sheet',
            };
        }
        console.log('Row index found:', rowIndex);
        const values = cols.map(col => data[col] !== undefined ? data[col] : '');

        // Update the specific row with the new values
        for (let i=0; i<cols.length; i++) {
            const col = cols[i];
            await googleSheet.spreadsheets.values.update({
                spreadsheetId,
                range: `Sheet1!${mapping[col]}${rowIndex + 2}:${mapping[col]}${rowIndex + 2}`,
                valueInputOption: 'RAW',
                requestBody: {
                    values: [[values[i]]],
                }
            });
        }

        console.log('Data updated in Google Sheet successfully');
        return {
            success: true,
            message: 'Data updated in Google Sheet successfully',
        };
    } catch (error) {
        console.error('Error updating data in Google Sheet:', error);
        return {
            success: false,
            message: 'Error updating data in Google Sheet',
            error: error.message,
        };
    }
}

const getGoogleSheetDataByRequestId = async (requestId) => {
    try {
        const googleSheet = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        // Fetch the existing data to find the row index
        const response = await googleSheet.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1!A2:Z',
        });

        const rowIndex = response.data.values.findIndex(row => row[1] === requestId);
        if (rowIndex === -1) {
            return {
                success: false,
                message: 'Request ID not found in Google Sheet',
            };
        }

        const rowData = response.data.values[rowIndex];
        return {
            success: true,
            data: rowData,
        };
    } catch (error) {
        console.error('Error fetching data from Google Sheet:', error);
        return {
            success: false,
            message: 'Error fetching data from Google Sheet',
            error: error.message,
        };
    }
}

const getAllGoogleSheetData = async () => {
    try {
        const googleSheet = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        // Fetch all data from the sheet
        const response = await googleSheet.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1!A2:Z',
        });

        if (!response.data.values || response.data.values.length === 0) {
            return {
                success: true,
                data: [],
            };
        }

        return {
            success: true,
            data: response.data.values,
        };
    } catch (error) {
        console.error('Error fetching all data from Google Sheet:', error);
        return {
            success: false,
            message: 'Error fetching all data from Google Sheet',
            error: error.message,
        };
    }
}

export {
    saveToGoogleSheet,
    updateGoogleSheet,
    getGoogleSheetDataByRequestId,
    getAllGoogleSheetData
};