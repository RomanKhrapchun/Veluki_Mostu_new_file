// services/taskApi.js
import { fetchFunction } from "../utils/function";

/**
 * Відправити завдання на обробку реєстру боржників
 * Повертає контрольні суми синхронно
 */
export const processDebtorRegister = async (communityName) => {
    try {
        const response = await fetchFunction('/api/tasks/process-register', {
            method: 'POST',
            data: {
                community_name: communityName
            }
        });

        if (!response.data.success) {
            throw new Error(response.data.error || 'Помилка обробки реєстру');
        }

        return response.data.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Відправити email з результатами
 */
export const sendEmailTask = async (communityName) => {
    try {
        const response = await fetchFunction('/api/tasks/send-email', {
            method: 'POST',
            data: {
                community_name: communityName
            }
        });

        if (!response.data.success) {
            throw new Error(response.data.error || 'Помилка відправки email');
        }

        return response.data.data;
    } catch (error) {
        throw error;
    }
};