export const formatAmount = (amount) => {
    try {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } catch (error) {
        console.error('Error formatting amount:', error);
        return amount;
    }
};