'use strict';

const errorHandler = exports.errorHandler = function errorHandler(errorCode, endpoint) {
    if (errorCode || endpoint) {

    } else {
        return {
            code: 500,
            message: 'Error was not accounted for'
        };
    }
}

const errorCode400 = function errorCode400(endpoint) {
    
}