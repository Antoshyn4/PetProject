import { LightningElement,api } from 'lwc';
import doSearch from '@salesforce/apex/ComponentCustomSettings.doSearch';

export default class SearchAndSort extends LightningElement {
    record = [];
    searchText = 'Enter Account or Contact name';
    @api sortField;
    @api sortedByDescending;
    @api parentName;
    @api childName;
    get options() {
        return [
            { label: 'Creation Date', value: 'CreatedDate' },
            { label: 'Name', value: 'Name' },
        ];
    }
    handleComboboxChange(event) {
        this.sortField = event.detail.value;
        let ce = new CustomEvent('sort',{detail: {isDesc: this.sortedByDescending, sortBy: this.sortField}});
        this.dispatchEvent(ce);
    }
    doSearchEvent(event){
        this.searchText = event.detail.value;
        if (event.detail.value.length == 0) {
            let ce = new CustomEvent('fill');
            this.dispatchEvent(ce);
        }
        if (event.detail.value.length >= 2) {
            doSearch({search: this.searchText, parentName: this.parentName, childName: this.childName})
            .then(result => {
                let temp = [];
                for (const key in JSON.parse(result)) {
                    let ob = {};
                    ob['Account'] = JSON.parse(result)[key].Account;
                    ob['isAccount'] = JSON.parse(result)[key].isAccount;
                    temp.push(ob);
                }
                this.record = temp;
                for (const key in this.record ) {
                    if (this.record[key]['Account'][this.childName]) {
                        this.record[key]['Account'][this.childName] = this.record[key]['Account'][this.childName].records;
                        debugger;
                    }
                }
                if (this.record.length == 0) {
                    let ce = new CustomEvent('recordchange', {detail: {record: []} });
                    this.dispatchEvent(ce);
                } else {
                    let ce = new CustomEvent('recordchange',{detail: {record: this.record} } );
                    this.dispatchEvent(ce);
                }
            })
            .catch(error => {
                alert('Error in Search ' + JSON.stringify(error));
            })
        }
    }
    handleDesc(event){
        this.sortedByDescending = true;
        let ce = new CustomEvent('sort',{detail: {isDesc: this.sortedByDescending, sortBy: this.sortField}});
        this.dispatchEvent(ce);
    }
    handleAsc(event){
        this.sortedByDescending = false;
        let ce = new CustomEvent('sort',{detail: {isDesc: this.sortedByDescending, sortBy: this.sortField}});
        this.dispatchEvent(ce);  
    }
}