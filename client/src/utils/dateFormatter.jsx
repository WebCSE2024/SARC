import { format, parseISO } from 'date-fns';

export const formatDate = (dateString) => {
    try {
        const date = parseISO(dateString);
        return format(date, 'MMMM dd, yyyy');
    } catch (error) {
        console.error('Error formatting date:', error);
        return '(To Be Informed)';
    }
};