
import { api, wire} from 'lwc';
import LightningModal from 'lightning/modal';

export default class popUpAccount extends LightningModal {
    @api options = [];
    @api objectName;
    @api recordId;
    link;

    handleOkay() {
        this.close('okay');
    }
    handleSubmit(event){
        event.preventDefault();
        const fields = event.detail;  
        debugger;
        for (const key in fields) {
            debugger;
            if (key == 'Phone') {
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(key.value)){
                    
                }
            }
        }     // stop the form from submitting
        this.template.querySelector('lightning-record-edit-form').submit(fields);
     }
     validation(event){
        const inputCmp = this.template.querySelectorAll("lightning-input-field");
        
        debugger;
        switch (event.target.dataset.name) {
            case 'Phone':
                for (const key in inputCmp) {
                    if (inputCmp[key].fieldName == 'Phone') {
                        inputCmp[key].value = event.target.value.replace(/[a-zA-Z]/g,'');
                        inputCmp[key].value = event.target.value.replace(/^\-/,'-');
                        inputCmp[key].value = event.target.value.replace('\ ','-');
                        inputCmp[key].value = event.target.value.replace(/(?!\-)[^\w\s]/,'');
                        inputCmp[key].value = event.target.value.replace(/^\-{1,99}/g,'');   
                    }
                }
                break;
            case 'Fax': 
                for (const key in inputCmp) {
                    if (inputCmp[key].fieldName == 'Fax') {
                        inputCmp[key].value = event.target.value.replace(/[a-zA-Z]/g,'');
                        inputCmp[key].value = event.target.value.replace(/^\-/,'-');
                        inputCmp[key].value = event.target.value.replace('\ ','-');
                        inputCmp[key].value = event.target.value.replace(/(?!\-)[^\w\s]/,'');
                        inputCmp[key].value = event.target.value.replace(/^\-{1,99}/g,'');   
                    }
                }
                break;
            default:
                break;
        }
        console.log();
        debugger;
     }
}
