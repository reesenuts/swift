import dotenv from 'dotenv';
import scheduledMessageService from '../services/scheduledMessageService.js';

// Load environment variables
dotenv.config();

/**
 * Format date to local time string
 */
const formatLocalTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Process scheduled messages that are due
 */
const processScheduledMessages = async () => {
    try {
        const now = new Date();
        console.log('Checking for scheduled messages...', formatLocalTime(now));
        const result = await scheduledMessageService.processScheduledMessages();
        
        if (result.processed > 0) {
            console.log(`Processed ${result.processed} messages: ${result.successful} successful, ${result.failed} failed`);
        } else {
            console.log('No messages to process at this time');
        }
    } catch (error) {
        console.error('Error processing scheduled messages:', error);
    }
    
    // Schedule next check in 1 minute
    setTimeout(processScheduledMessages, 60000);
};

// Start processing scheduled messages
console.log('Starting message scheduler...', formatLocalTime(new Date()));
processScheduledMessages();

process.on('uncaughtException', (error) => {
    console.error('Uncaught exception in scheduler:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection in scheduler:', reason);
}); 