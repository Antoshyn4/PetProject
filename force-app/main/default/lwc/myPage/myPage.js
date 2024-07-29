import { LightningElement, track, wire, api} from 'lwc';
import getCustomSettings from '@salesforce/apex/ComponentCustomSettings.getCustomSettings';
import getAccountList from '@salesforce/apex/ComponentCustomSettings.getAccountList';
import getSortSettings from '@salesforce/apex/ComponentCustomSettings.getSortSettings';
import setOrder from '@salesforce/apex/ComponentCustomSettings.setOrder';
import getObjectsName from '@salesforce/apex/ComponentCustomSettings.getObjectsName';

export default class MyPage extends LightningElement {
    @track noSearchResult = false;
    @api ObjectName;
    @api countOfColumns;
    @track countOfAllElements;
    @track countOfPageElements;
    @track countOfPages;
    @track record = [];
    @track error; 
    parentName;
    childName;
    sortField;
    sortedByDescending;
    pageNum = 1;

    get countOfAllElementsAct(){
        console.log('MyPage get countOfAllElementsAct' + this.record);
        if (this.record  !== undefined && this.countOfAllElements > this.record.length) {
            return  this.record.length;
        }
        return this.countOfAllElements;
    }
    get countOfPagesAct(){
        if (this.record  !== undefined && this.countOfAllElements > this.record.length) {
            return  Math.ceil(this.record.length/this.countOfPageElements);
        }
        return this.countOfPages;
    }

    connectedCallback(){
        getObjectsName()
        .then(result => {
            this.parentName = result.Parent__c;
            this.childName = result.Child__c;
            this.getAccounts();
            })
            .catch(error => {
                alert('Error on getObName');
            });
        getCustomSettings()
        .then(result => {
            if (result.All_elements_count__c <= 0 || result.Columns_count__c <= 0 || result.On_page_elements_count__c < 0) {
                alert('Incorrect input values');
                // this.countOfAllElements = 0;
                // this.countOfColumns = 0;
                // this.countOfPageElements = 0;
                // this.countOfPages = 0;
                // this.record = undefined;
            }
            else {
                this.countOfAllElements = result.All_elements_count__c;
                this.countOfColumns = result.Columns_count__c;
                this.countOfPageElements = result.On_page_elements_count__c;
                this.countOfPages = Math.ceil(this.countOfAllElements/this.countOfPageElements);
            }
        }) 
        .catch(error => {
            alert('Error in getCS' + JSON.stringify(error));
        });
        debugger;
        
    }
    getAccounts(){
        console.log( this.childName);
        console.log(this.parentName);
        console.log('asdasd');
        getAccountList({parentName: this.parentName, childName: this.childName})
            .then(resultAcc => {
            this.record.length = 0;
            let temp = []; 
            for (const key in resultAcc) {
                temp.push(resultAcc[key])
            }
            this.record = temp;
            this.error = undefined; 
            if (this.countOfAllElements > this.record.length) {
                this.template.querySelector('c-menu').changeCount(Math.ceil(this.record.length/this.countOfPageElements));
            }
            else {
                this.template.querySelector('c-menu').changeCount(Math.ceil(this.countOfAllElementsAct/this.countOfPageElements));
            }
            getSortSettings()
            .then(result => {
                this.sortField = result.SortBy__c;
                this.sortedByDescending = result.isDesc__c == 'DESC' ? true : false;
                let inputArr = this.record;
                this.record = this.quickSort(inputArr);
            })
            .catch(error => {
                alert('Error in sort' + JSON.stringify(error));
            });
            })
            .catch(error => {
                this.record = undefined;
                this.error = error;
                alert('Error in getAcc' + JSON.stringify(error));
            });
    }
    reDraw(event){
        this.countOfPages = Math.ceil(this.countOfAllElements/this.countOfPageElements);
        this.pageNum = event.detail;
        this.template.querySelector('c-list-of-accounts').draw(this.pageNum);
    }
    changeRecord(event){
        if (event.detail['record'].length == 0) {
            this.noSearchResult = true;
            this.record.length = 0;
            this.template.querySelector('c-menu').changeCount(this.countOfPagesAct);
            this.template.querySelector('c-list-of-accounts').changeRecord(event.detail);
        }
        else {
            this.noSearchResult = false;
            let data = [];
            for (const key in event.detail['record']) {
                data.push(event.detail['record'][key]['Account']);
            }
            this.record = data;
            this.error = undefined; 
            let inputArr = this.record;
            this.record = this.quickSort(inputArr);
            this.template.querySelector('c-menu').changeCount(this.countOfPagesAct);
            this.template.querySelector('c-list-of-accounts').changeRecord(event.detail);
        }
    }
    fillAllValues(){
        this.noSearchResult = false;
        getCustomSettings()
        .then(result => {
            if (result.All_elements_count__c <= 0 || result.Columns_count__c <= 0 || result.On_page_elements_count__c < 0) {
                alert('Incorrect input values');
                // this.countOfAllElements = 0;
                // this.countOfColumns = 0;
                // this.countOfPageElements = 0;
                // this.countOfPages = 0;
                // this.record = undefined;
            }
            else {
                this.countOfAllElements = result.All_elements_count__c;
                this.countOfColumns = result.Columns_count__c;
                this.countOfPageElements = result.On_page_elements_count__c;
                this.countOfPages = Math.ceil(this.countOfAllElements/this.countOfPageElements);
            }
        }) 
        .catch(error => {
            alert('Error in getCS' + JSON.stringify(error));
        });
        getAccountList({parentName: this.parentName, childName: this.childName})
        .then(result => {
            this.record.length = 0;
            let temp = []; 
            for (const key in result) {
                temp.push(result[key])
            }
            this.record = temp;
            this.error = undefined; 
            let inputArr = this.record;
            this.record = this.quickSort(inputArr);
            this.template.querySelector('c-list-of-accounts').recordPlease = this.record;
            if (this.countOfAllElements > this.record.length) {
                this.template.querySelector('c-menu').changeCount(Math.ceil(this.record.length/this.countOfPageElements));
            }
            else {
                this.template.querySelector('c-menu').changeCount(Math.ceil(this.countOfAllElementsAct/this.countOfPageElements));
            }
        })
        .catch(error => {
            this.record = undefined;
            this.error = error;
            alert('Error in getAcc' + JSON.stringify(error));
        });
    }
    changeSort(event){
        setOrder({sortBy: event.detail.sortBy, isDesc: event.detail.isDesc})
        .catch(error => {
            alert('Error: ' + JSON.stringify(error));
        });
        this.sortField = event.detail.sortBy;
        this.sortedByDescending = event.detail.isDesc;
        console.log(this.sortedByDescending);
        console.log(this.so);
        let inputArr = this.record;
        this.record = this.quickSort(inputArr);
        this.template.querySelector('c-list-of-accounts').recordPlease = this.record;
    }
    quickSort(origArray){
        if (origArray.length <= 1) { 
            return origArray;
        } 
        else {
            var left = [];
            var right = [];
            var newArray = [];  
            var pivot = origArray.pop();
            var length = origArray.length;

            for (var i = 0; i < length; i++) {
                if (this.sortedByDescending ? origArray[i][this.sortField] <= pivot[this.sortField] : origArray[i][this.sortField] >= pivot[this.sortField]) {
                    left.push(origArray[i]);
                } else {
                    right.push(origArray[i]);
                }
            }
    
            return newArray.concat(this.quickSort(left), pivot, this.quickSort(right));
        }
    }
}