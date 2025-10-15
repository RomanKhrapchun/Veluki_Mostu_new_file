// routes/tasks-routes.js
const { RouterGuard } = require('../../../helpers/Guard');
const { accessLevel } = require('../../../utils/constants');
const tasksController = require('../controller/tasks-controller');

const routes = async (fastify) => {
    /**
     * POST /api/taskss/process-register
     * Обробити реєстр боржників та отримати контрольні суми
     */
    fastify.post(
        "/process-register",
        {
            //schema: processRegisterSchema,
            preParsing: RouterGuard({
                permissionLevel: "debtor",
                permissions: accessLevel.VIEW
            })
        },
        tasksController.processDebtorRegister
    );

    /**
     * POST /api/taskss/send-email
     * Відправити email з результатами
     */
    fastify.post(
        "/send-email",
        {
            //schema: sendEmailSchema,
            preParsing: RouterGuard({
                permissionLevel: "debtor",
                permissions: accessLevel.INSERT
            })
        },
        tasksController.sendEmail
    );
};

module.exports = routes;