const tasksService = require('../service/tasks-service');
const Logger = require('../../../utils/logger');

class tasksController {
    /**
     * POST /api/taskss/process-register
     * Обробити реєстр боржників та отримати контрольні суми
     */
    async processDebtorRegister(request, reply) {
        try {
            const { community_name } = request.body;

            if (!community_name) {
                return reply.status(400).send({
                    success: false,
                    error: 'Не вказано community_name'
                });
            }

            Logger.info('Запит на обробку реєстру', {
                communityName: community_name,
                userId: request?.user?.id
            });

            // Відправляємо завдання та чекаємо на результат
            const result = await tasksService.processDebtorRegister(community_name);

            return reply.status(200).send({
                success: true,
                data: result
            });

        } catch (error) {
            Logger.error('Помилка в processDebtorRegister', {
                error: error.message,
                stack: error.stack
            });

            // Перевіряємо чи це timeout
            if (error.message.includes('Timeout')) {
                return reply.status(408).send({
                    success: false,
                    error: 'Час очікування вичерпано. Спробуйте ще раз.'
                });
            }

            return reply.status(500).send({
                success: false,
                error: error.message || 'Внутрішня помилка сервера'
            });
        }
    }

    /**
     * POST /api/taskss/send-email
     * Відправити email з результатами
     */
    async sendEmail(request, reply) {
        try {
            const { community_name } = request.body;

            if (!community_name) {
                return reply.status(400).send({
                    success: false,
                    error: 'Не вказано community_name'
                });
            }

            Logger.info('Запит на відправку email', {
                communityName: community_name,
                userId: request?.user?.id
            });

            // Відправляємо завдання та чекаємо на результат
            const result = await tasksService.sendEmail(community_name);

            return reply.status(200).send({
                success: true,
                data: result
            });

        } catch (error) {
            Logger.error('Помилка в sendEmail', {
                error: error.message,
                stack: error.stack
            });

            // Перевіряємо чи це timeout
            if (error.message.includes('Timeout')) {
                return reply.status(408).send({
                    success: false,
                    error: 'Час очікування вичерпано. Email може бути відправлено пізніше.'
                });
            }

            return reply.status(500).send({
                success: false,
                error: error.message || 'Внутрішня помилка сервера'
            });
        }
    }
}

module.exports = new tasksController();