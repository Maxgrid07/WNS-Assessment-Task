'use strict';

exports.handleSuccess = function (res, result, successCode){
	successCode = successCode || 200;
    
	return res.status(successCode).json({'success' : true, 'result' : result});
};

exports.handleError = function (res, err, errCode) {
    errCode = errCode || 500;
    return res.status(errCode).json({'error' : err, 'errorCode' : errCode});
};
