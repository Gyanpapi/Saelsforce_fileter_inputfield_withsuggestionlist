public with sharing class ProductController {
    
    @AuraEnabled(cacheable=true)
    public static List<String> searchExternalIds(String searchKey) {
        
        // Get current user ID
        Id currentUserId = UserInfo.getUserId();
        
        // Query matching ExternalIds for Products created by current user
        List<Product2> products = [
            SELECT ExternalId 
            FROM Product2 
            WHERE CreatedById = :currentUserId 
            AND ExternalId LIKE :('%' + searchKey + '%') 
            LIMIT 10
        ];
        
        List<String> externalIds = new List<String>();
        
        for(Product2 p : products) {
            if(p.ExternalId != null) {
                externalIds.add(p.ExternalId);
            }
        }
        
        return externalIds;
    }
    
    @AuraEnabled(cacheable=true)
public static List<String> getAllExternalIdsForCurrentUser() {
    Id currentUserId = UserInfo.getUserId();
    List<String> externalIds = new List<String>();
    for(Product2 p : [
        SELECT ExternalId FROM Product2 WHERE CreatedById = :currentUserId AND ExternalId != null
    ]) {
        externalIds.add(p.ExternalId);
    }
    return externalIds;
}
}