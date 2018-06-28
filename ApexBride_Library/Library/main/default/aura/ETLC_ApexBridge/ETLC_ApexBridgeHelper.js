({
    callServer : function(component, helper, params) {
        var msgError;
        var sourceComponent = params.component;
        var request = params.request;
        var callBackMethod = params.callBackMethod;
        var callBackError = params.callBackError;
        var setStorable = params.setStorable;
        var setBackground = params.setBackground;
        
        var action = component.get("c.execute");
        action.setParams({
            requestJson: JSON.stringify({
                controller: request.controller,
                method: request.method,
                input: JSON.stringify(request.input),
                createSavePoint: (request.createSavePoint) ? true : false,
                records: request.records
            })
        });
        
        if (setStorable) action.setStorable();
        if (setBackground) action.setBackground();
            
        action.setCallback(this, function(response) {
            if (sourceComponent.isValid()) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var dataReturned = response.getReturnValue();
                    dataReturned = JSON.parse(dataReturned);
                    if (dataReturned.isSuccess) {
                        dataReturned.output = JSON.parse(dataReturned.output);
                        callBackMethod.call(this, dataReturned);
                    } else {
                        msgError = '\r\n*** SERVER ERROR #01 (Operation Not succesful)***\r\n';
                        for (var errorType in dataReturned.messages) {
                            if(dataReturned.messages.hasOwnProperty(errorType)) {
                                msgError += errorType + ': ' + dataReturned.messages[errorType].toString();
                            }
                        }
                        if (callBackError) {
                            callBackError.call(this, response, msgError);
                        } else {
                            throw new Error(msgError);
                        }
                    }
                } else {
                    var errors = response.getError();
                    if (errors && errors[0] && errors[0].message) {
                        msgError = "\r\n*** SERVER ERROR #02 (State not succesful)***\r\nError message: " + errors[0].message;
                        if (callBackError) {
                            callBackError.call(this, response, msgError);
                        } else {
                            throw new Error(msgError);
                        }
                    } else {
                        msgError = "\r\n*** SERVER ERROR #03 (State not succesful)***\r\nUnknown error)";
                        if (callBackError) {
                            callBackError.call(this, response, msgError);
                        } else {
                            throw new Error(msgError);
                        }
                    }
                }
            } else {
                msgError = "\r\n*** CLIENT ERROR #01 ***\r\nComponent is no longer valid!";
                if (callBackError) {
                    callBackError.call(this, response, msgError);
                } else {
                    throw new Error(msgError);
                }
            }
        });
        $A.enqueueAction(action);
    }
})