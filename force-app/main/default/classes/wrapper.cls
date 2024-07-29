/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 07-25-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class wrapper {
    public SObject Account;
    public Boolean isAccount;

    public Object doSJON(){
        return JSON.serialize(this);
    }
}