import dotenv from 'dotenv';
import { Vonage } from '@vonage/server-sdk';
import messages from '@vonage/messages';
import messageService from './messageService.js';
const { MessageSearchFilter } = messages;

dotenv.config();

class SMSService {
    constructor() {
        const apiKey = process.env.VONAGE_API_KEY;
        const apiSecret = process.env.VONAGE_API_SECRET;
        const brandName = process.env.VONAGE_BRAND_NAME;
        
        console.log('Initializing Vonage with:', {
            apiKey: apiKey ? 'Present' : 'Missing',
            apiSecret: apiSecret ? 'Present' : 'Missing',
            brandName: brandName || 'Using default'
        });

        if (!apiKey || !apiSecret) {
            throw new Error('Vonage credentials are not configured in .env file');
        }

        this.brandName = brandName || 'VONAGE';
        
        try {
            this.vonage = new Vonage({
                apiKey: apiKey,
                apiSecret: apiSecret
            });
            console.log('Vonage client initialized successfully');
        } catch (error) {
            console.error('Error initializing Vonage client:', error);
            throw new Error('Failed to initialize Vonage client: ' + error.message);
        }
    }

    /**
     * Validate and format phone number
     * @param {string} phoneNumber 
     * @returns {string} Formatted number in international format
     */
    formatPhoneNumber(phoneNumber) {
        // Remove all non-digit characters except +
        let cleaned = phoneNumber.replace(/[^\d+]/g, '');
        
        // Handle different formats for PH numbers
        if (cleaned.startsWith('0')) {
            // Convert 0917xxxxxxx to +63917xxxxxxx
            cleaned = '+63' + cleaned.substring(1);
        } else if (cleaned.startsWith('63')) {
            // Add + to 63917xxxxxxx
            cleaned = '+' + cleaned;
        } else if (!cleaned.startsWith('+63') && cleaned.length === 10 && cleaned.startsWith('9')) {
            // Convert 917xxxxxxx to +63917xxxxxxx
            cleaned = '+63' + cleaned;
        } else if (!cleaned.startsWith('+')) {
            // Add + for international format if missing
            cleaned = '+' + cleaned;
        }
        
        console.log('Formatted phone number:', {
            original: phoneNumber,
            formatted: cleaned
        });
        
        return cleaned;
    }

    /**
     * Validate if the number is a valid phone number
     * @param {string} phoneNumber 
     * @returns {boolean}
     */
    isValidPhoneNumber(phoneNumber) {
        const cleaned = phoneNumber.replace(/[^\d+]/g, '');
        
        // Basic validation for Philippine numbers
        return (
            // 09XXXXXXXXX format (11 digits)
            (cleaned.startsWith('0') && cleaned.length === 11) ||
            // 9XXXXXXXXX format (10 digits)
            (cleaned.length === 10 && cleaned.startsWith('9')) ||
            // 63XXXXXXXXX format (12 digits)
            (cleaned.startsWith('63') && cleaned.length === 12) ||
            // +63XXXXXXXXX format (13 digits)
            (cleaned.startsWith('+63') && cleaned.length === 13)
        );
    }

    /**
     * Send a single SMS message
     * @param {string} to - Recipient phone number
     * @param {string} message - Message content
     * @returns {Promise} Message result
     */
    async sendSMS(to, message) {
        try {
            console.log('SendSMS called with:', {
                to: to,
                messageLength: message.length,
                brandName: this.brandName
            });

            if (!this.isValidPhoneNumber(to)) {
                console.log('Invalid phone number format:', to);
                return {
                    success: false,
                    error: 'Invalid phone number format',
                    code: 'invalid_number_format',
                    to: to
                };
            }

            const formattedNumber = this.formatPhoneNumber(to);
            console.log('Attempting to send SMS to:', formattedNumber);

            try {
                const responseData = await this.vonage.sms.send({
                    to: formattedNumber,
                    from: this.brandName,
                    text: message,
                    // Enable DLR (Delivery Receipt) webhook
                    "status-report-req": 1
                });

                console.log('Vonage API Response:', responseData);
                const messageResponse = responseData.messages[0];
                const isSuccess = ['0', '1'].includes(messageResponse.status);

                // Store message in database
                await messageService.createMessage({
                    message_id: messageResponse['message-id'],
                    phone_number: formattedNumber,
                    message_text: message
                });

                if (isSuccess) {
                    return {
                        success: true,
                        messageId: messageResponse['message-id'],
                        status: messageResponse.status === '0' ? 'sent' : 'accepted',
                        to: formattedNumber,
                        originalNumber: to,
                        remainingBalance: messageResponse['remaining-balance'],
                        network: messageResponse.network,
                        details: `Message ${messageResponse.status === '0' ? 'sent' : 'accepted'} successfully`
                    };
                } else {
                    console.error('Vonage message failed:', messageResponse);
                    return {
                        success: false,
                        error: messageResponse['error-text'],
                        code: messageResponse.status,
                        to: formattedNumber,
                        network: messageResponse.network
                    };
                }
            } catch (err) {
                console.error('Vonage API Error:', {
                    error: err.message,
                    code: err.code,
                    stack: err.stack
                });
                return {
                    success: false,
                    error: err.message,
                    code: err.code || 'unknown_error',
                    to: formattedNumber
                };
            }
        } catch (error) {
            console.error('Error in sendSMS:', {
                error: error.message,
                stack: error.stack,
                to: to
            });
            return {
                success: false,
                error: error.message,
                code: 'system_error',
                to: to
            };
        }
    }

    /**
     * Send bulk SMS messages
     * @param {Array<string>} numbers - Array of recipient phone numbers
     * @param {string} message - Message content
     * @returns {Promise} Bulk message result
     */
    async sendBulkSMS(numbers, message) {
        try {
            // Validate all numbers first
            const invalidNumbers = numbers.filter(num => !this.isValidPhoneNumber(num));
            if (invalidNumbers.length > 0) {
                return {
                    success: false,
                    error: 'Invalid phone numbers detected',
                    code: 'invalid_number_format',
                    invalidNumbers
                };
            }

            // Send messages in parallel
            const results = await Promise.all(numbers.map(number => this.sendSMS(number, message)));
            
            const successfulSends = results.filter(r => r.success);
            const failedSends = results.filter(r => !r.success);

            return {
                success: true,
                totalSent: successfulSends.length,
                totalFailed: failedSends.length,
                details: results,
                failedNumbers: failedSends.map(f => f.to)
            };
        } catch (error) {
            console.error('Error in sendBulkSMS:', error);
            return {
                success: false,
                error: error.message,
                code: 'bulk_send_error'
            };
        }
    }

    /**
     * Get message status from database
     * @param {string} messageId - Message ID
     * @returns {Promise} Message status
     */
    async getMessageStatus(messageId) {
        return messageService.getMessageStatus(messageId);
    }

    /**
     * Get account balance
     * @returns {Promise} Account balance information
     */
    async getBalance() {
        return new Promise((resolve, reject) => {
            this.vonage.account.checkBalance((err, response) => {
                if (err) {
                    console.error('Error fetching balance:', err);
                    resolve({
                        success: false,
                        error: err.message,
                        code: err.code || 'balance_fetch_error'
                    });
                } else {
                    resolve({
                        success: true,
                        balance: response.value,
                        autoReload: response.autoReload
                    });
                }
            });
        });
    }
}

export default new SMSService(); 