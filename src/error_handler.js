'use strict';

const errorHandler = exports.errorHandler = function errorHandler(errorCode, endpoint, message) {
    if (errorCode && endpoint && message) {
        if (errorCode === 500) {
            return errorReturnMessage(500, endpoint, "Something went wrong.");
        } else {
            return errorReturnMessage(errorCode, endpoint, message);
        }
    } else {
        return {
            code: 500,
            message: 'Error was not accounted for.',
            endpoint: endpoint
        };
    }
}

const errorReturnMessage = function errorReturnMessage(errorCode, endpoint, message) {
    return {
        code: errorCode,
        message: (message) ? message : 'Error was not accounted for',
        endpoint: endpoint
    };
}