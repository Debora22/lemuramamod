
const logError = (exception) => {
    const logMethod = console.error || console.log;
    const messages = [];
    const time = new Date()
    .toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '');

    if (exception instanceof Error) {
        messages.push(exception.message);
        const stack = exception.stack
        .split('\n')
        .map((line) => line.trim());
        stack.splice(0, 1);
        messages.push(...stack);
    } else {
        message.push(exception);
    }

    messages.forEach((message) => {
        logMethod(`[Error][${time}] ${message}`);
    });
};

module.exports = {
    register: () => {
        process.on('uncaughtException', logError);
        process.on('unhandledRejection', logError);
    }
};
