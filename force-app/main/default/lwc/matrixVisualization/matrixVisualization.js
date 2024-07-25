import {LightningElement, track} from 'lwc';

export default class MatrixVisalization extends LightningElement {
    output = "Default";
    xLength;
    yHeight;
    @track listOfCheckboxes = [[]];
    @track listOfListOfCheckboxes = [[]];
    clearAll(){
        this.listOfCheckboxes.length = 0;
        this.listOfListOfCheckboxes.length = 0;
        setTimeout(()=>{
            for (let i = 0; i < this.yHeight; i++) {
                this.listOfCheckboxes.push([]);
                this.listOfListOfCheckboxes.push([]);
                for (let z = 0; z < this.xLength; z++) {
                    this.listOfCheckboxes[i].push(false);
                    this.listOfListOfCheckboxes[i].push(false);
                }
            }
        },1);
    }
    changeHandler(event){
        if (event.target.name == "xLength"){
            this.xLength = event.target.value;
        }
        else if (event.target.name == "yHeight"){
            this.yHeight = event.target.value;
        }
        if (this.xLength === undefined || this.yHeight === undefined){
            return;
        }
        else {
            this.updateCheckboxes();
        }
    }  
    updateCheckboxes(){
        if (this.listOfListOfCheckboxes.length == 1 && this.listOfListOfCheckboxes[0].length == 0) {
            this.listOfListOfCheckboxes.length = 0;
            for (let i = 0; i < this.yHeight; i++) {
                this.listOfListOfCheckboxes.push([]);
                for (let z = 0; z < this.xLength; z++) {
                    this.listOfListOfCheckboxes[i].push(false);
                }
            }
        }
        if (this.xLength > this.listOfListOfCheckboxes[0].length) {
            for (let i = 0; i < this.listOfListOfCheckboxes.length; i++) {
                for (let z = this.listOfListOfCheckboxes[i].length; z < this.xLength; z++) {
                    this.listOfListOfCheckboxes[i].push(false);
                }
            }
        }
        if (this.yHeight > this.listOfListOfCheckboxes.length) {
            for (let i = this.listOfListOfCheckboxes.length; i < this.yHeight; i++) {
                this.listOfListOfCheckboxes.push([]);
                for (let z = 0; z < this.listOfListOfCheckboxes[i].length; z++) {
                    this.listOfListOfCheckboxes[i].push(false);
                }
            }
        }
        let listTest =[[]];
        this.listOfCheckboxes.length = 0;
        for (let i = 0; i < this.yHeight; i++) {
            debugger;
            listTest.push([]);
            for (let z = 0; z < this.xLength; z++) {
                if (this.listOfListOfCheckboxes[i][z]) {
                    listTest[i].push(true);
                }
                else listTest[i].push(false);
            }
        }
        this.listOfCheckboxes = listTest;
    }
    checkBoxChangeFun(event){
        let x = parseInt(event.target.id.substring(0,event.target.id.indexOf("-")));
        let y = parseInt(event.target.name);
        if (this.listOfListOfCheckboxes[y][x] == true) {
            this.listOfListOfCheckboxes[y][x] = false;
        }
        else {
            this.listOfListOfCheckboxes[y][x] = true;
        }
    }
}