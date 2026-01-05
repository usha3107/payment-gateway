const ValidationService = {
    validateVPA: (vpa) => {
        // ^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
        return regex.test(vpa);
    },

    validateCardLuhn: (number) => {
        const cleaned = number.replace(/[\s-]/g, '');
        if (!/^\d{13,19}$/.test(cleaned)) return false;

        let sum = 0;
        let shouldDouble = false; // Start from right, 1st digit (rightmost) is unchanged

        // Loop backwards
        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned.charAt(i));

            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }

            sum += digit;
            shouldDouble = !shouldDouble;
        }

        return (sum % 10) === 0;
    },

    detectCardNetwork: (number) => {
        const cleaned = number.replace(/[\s-]/g, '');

        if (cleaned.startsWith('4')) return 'visa';

        // Mastercard: 51-55
        const firstTwo = parseInt(cleaned.substring(0, 2));
        if (firstTwo >= 51 && firstTwo <= 55) return 'mastercard';

        // Amex: 34 or 37
        if (firstTwo === 34 || firstTwo === 37) return 'amex';

        // RuPay: 60, 65, 81-89
        if (firstTwo === 60 || firstTwo === 65 || (firstTwo >= 81 && firstTwo <= 89)) return 'rupay';

        return 'unknown';
    },

    validateCardExpiry: (month, year) => {
        const m = parseInt(month);
        let y = parseInt(year);

        if (m < 1 || m > 12) return false;

        // Handle 2-digit year
        if (y < 100) y += 2000;

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // 1-indexed

        if (y < currentYear) return false;
        if (y === currentYear && m < currentMonth) return false;

        return true;
    }
};

module.exports = ValidationService;
