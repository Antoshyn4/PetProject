/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 07-29-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public class ComponentCustomSettings {

    @AuraEnabled
    public static Sort_Acc__c getSortSettings(){
        return Sort_Acc__c.getOrgDefaults();
    }
    @AuraEnabled
    public static void setOrder(Boolean isDesc, String sortBy){
        System.debug(isDesc + ' ' + sortBy);
        Sort_Acc__c customSetting = Sort_Acc__c.getOrgDefaults();
        customSetting.SortBy__c = sortBy;
        customSetting.isDesc__c = isDesc;
        update customSetting;
    }
    @AuraEnabled
    public static List<SObject> getAccountList(String parentName, String childName){
        //System.debug(parentName + ' child: ' + childName);
        String query;
        query = 'SELECT Name, CreatedDate, (SELECT ';
        String field;
        switch on childName {
            when  'Contacts'{
                query += 'Name';
            }
            when 'Cases'{
                query += 'CaseNumber';
            }
        }
        query += ' FROM '+ childName + ')  FROM '+ parentName;
        System.debug(query);
        return Database.query(query);
    }
    @AuraEnabled(cacheable=true)
    public static Dependencies__c getCustomSettings(){
        return [SELECT All_elements_count__c, Child__c, Columns_count__c, On_page_elements_count__c, Parent__c, Error_message__c FROM Dependencies__c LIMIT 1];
    }
    @AuraEnabled
    public static Dependencies__c getObjectsName(){
        Dependencies__c query = Database.query('SELECT Parent__c, Child__c FROM Dependencies__c LIMIT 1');
        System.debug(query);
        return query;
    }
    @AuraEnabled(cacheable=true)
    public static SObject getAllAccountRecords(Id accid){
        System.debug(accId);
        String name = accid.getSObjectType().getDescribe().getName();
        Schema.FieldSet allAccountFields;
        switch on name {
            when  'Account'{
                allAccountFields = Schema.SObjectType.Account.fieldSets.All_Fields;
            }
            when 'Contact'{
                allAccountFields = Schema.SObjectType.Contact.fieldSets.All_Fields;
            }
            when 'Case'{
                allAccountFields = Schema.SObjectType.Case.fieldSets.All_Fields;
            }
        }
        String query = 'SELECT ';
        for (Schema.FieldSetMember f : allAccountFields.getFields()){
            if (f.getFieldPath() != 'Tier'){
                query += f.getFieldPath() + ', ';
            }
        }
        query = query.substring(0,query.length() - 2);
        query += ' FROM ' + name + ' WHERE Id = \'';
        query += accid + '\'';
        return Database.query(query);   
    }
    @AuraEnabled
    public static string getNameById(Id objectId){
        return objectId.getSObjectType().getDescribe().getName();
    }
}