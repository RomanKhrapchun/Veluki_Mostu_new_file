const rabbitmqClient = require('../../../helpers/rabbitmq');
const Logger = require('../../../utils/logger');

class tasksService {
    /**
     * Відправити завдання на обробку реєстру боржників
     * Чекає на відповідь від Worker (RPC)
     */
    async processDebtorRegister(communityName) {
        if (!communityName || typeof communityName !== 'string') {
            throw new Error('Не вказано community_name або невірний формат');
        }

        try {
            Logger.info('Відправка завдання process_debtor_register', {
                communityName
            });

            // Відправляємо завдання та чекаємо на відповідь (60 секунд таймаут)
            const result = await rabbitmqClient.sendtasksWithReply(
                'process_debtor_register',
                { community_name: communityName },
                60000 // 60 секунд
            );

            // Перевіряємо чи успішний результат
            if (!result.success) {
                throw new Error(result.error || 'Помилка обробки на стороні Worker');
            }

            Logger.info('Завдання process_debtor_register виконано', {
                communityName,
                totalRecords: result.total_records
            });

            return result;

        } catch (error) {
            Logger.error('Помилка виконання process_debtor_register', {
                error: error.message,
                communityName
            });
            throw error;
        }
    }

    /**
     * Відправити завдання на відправку email
     * Чекає на відповідь від Worker (RPC)
     */
    async sendEmail(communityName) {
        if (!communityName || typeof communityName !== 'string') {
            throw new Error('Не вказано community_name або невірний формат');
        }

        try {
            Logger.info('Відправка завдання send_email', {
                communityName
            });

            // Відправляємо завдання та чекаємо на відповідь (120 секунд таймаут)
            const result = await rabbitmqClient.sendtasksWithReply(
                'send_email',
                { community_name: communityName },
                120000 // 120 секунд для email
            );

            // Перевіряємо чи успішний результат
            if (!result.success) {
                throw new Error(result.error || 'Помилка відправки email на стороні Worker');
            }

            Logger.info('Завдання send_email виконано', {
                communityName,
                recipientEmail: result.recipient_email
            });

            return result;

        } catch (error) {
            Logger.error('Помилка виконання send_email', {
                error: error.message,
                communityName
            });
            throw error;
        }
    }
}

module.exports = new tasksService();