public class ETLC_ApexBridge_Controller {
    @AuraEnabled
    public static String execute(String requestJson) {
        Savepoint spAllDataChanges;
        ETLC_ApexBridge_Request request;
        ETLC_ApexBridge_Response response = new ETLC_ApexBridge_Response();

        try {
            System.debug('Input: ' + requestJson);
            request = ETLC_ApexBridge_Request.fromJSON(requestJson);
            if (!request.createSavePoint) {
                // If there are any errors, the data will be reset... so, save a SavePoint
                spAllDataChanges = Database.setSavepoint();
            }
            ETLC_ApexBridge_Abstract executor = (ETLC_ApexBridge_Abstract) Type.forName(request.controller).newInstance();
            executor.process(request, response);
        } catch (Exception ex) {
            // Rollback the data changes (Apex automatically rolls back when there are 
            // unhandled exception, but this is being handled)
            if (!request.createSavePoint) {
                Database.rollback(spAllDataChanges);
            }
            
            System.debug('**** Exception ****');
            System.debug(ex.getMessage());
            System.debug(ex.getStackTraceString());
            
            // Build messages to return.
            String strEx = '';
            String st = ex.getStackTraceString();
            strEx += ex.getMessage();
            if (st != null){
                st = st.trim();
                if (st != '()') {
                    strEx += '\r\nStack Trace:\r\n' + ex.getStackTraceString();                
                }
            }
            
            response.addMessage(ETLC_ApexBridge_Response.MessageType.Errors, strEx);
            if (request.createSavePoint) {
                throw new AuraHandledException(strEx);
            }
        }
        
        String output = response.toJSON(); 
        return output;
    }
}