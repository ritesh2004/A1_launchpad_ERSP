import { google } from 'googleapis';
import fs from 'fs';
import { configDotenv } from 'dotenv';

configDotenv();

const credentials = JSON.parse(fs.readFileSync('a1launchpadersp-d8a3db862a15.json', 'utf8'));

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const saveToGoogleSheet = async (data) => {
    const googleSheet = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const values = [
        data.name,
        data.serialno,
        data.product_details,
        data.dop,
        data.image_url,
        data.fault_description,
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
}

const dummy = {
    name: 'Jon Doe',
    serialno: '1234567890',
    product_details: 'A1 Fence',
    dop: '2023-10-01',
    image_url: 'https://example.com/image.jpg',
    fault_description: 'No issues',
}

saveToGoogleSheet(dummy);