import { LightningElement,api, track } from 'lwc';

export default class Menu extends LightningElement {
    @api countOfAllElements;
    @api countOfPageElements;
   
    @api countOfPages;
    @api currentPageNum;
    @track isFirstPage;
    @track isLastPage;
    inputValue;
    isSingle;

    connectedCallback(){
        debugger;
        this.isFirstPage = true;  
        this.isLastPage = false;
        this.inputValue = this.currentPageNum;
        this.isSingle = this.countOfPages == 1 ? true: false;
    }       
    @api changeCount(countOfPages){
        this.countOfPages = countOfPages;
        this.isFirstPage = true;  
        this.isLastPage = false;
        this.isSingle = (this.countOfPages == 1 || this.countOfPages == 0) ? true: false;
        this.currentPageNum = 1;
        this.inputValue = this.currentPageNum;
    }
    drawPreviousPage(){
        this.currentPageNum--;
        this.inputValue--;
        if(this.currentPageNum == 1){
            this.isFirstPage = true;
        }
        if (this.currentPageNum != 1) {
            this.isFirstPage = false;
        }
        if (this.currentPageNum == this.countOfPages){
            this.isLastPage = true; 
        }
        else {
            this.isLastPage = false;
        }
        const doEvent = new CustomEvent('redraw', {detail: this.currentPageNum});
        this.dispatchEvent(doEvent);
    }
    drawNextPage(){
        this.currentPageNum++;
        this.inputValue++;
        if(this.currentPageNum == 1){
            this.isFirstPage = true;
        }
        if (this.currentPageNum != 1) {
            this.isFirstPage = false;
        }
        if (this.currentPageNum == this.countOfPages){
            this.isLastPage = true; 
        }
        else {
            this.isLastPage = false;
        }
        const doEvent = new CustomEvent('redraw', {detail: this.currentPageNum});
        this.dispatchEvent(doEvent);
    }
    drawSomePage(event){
        if (event.target.value > 0 && event.target.value <= this.countOfPages) {
            this.currentPageNum = event.target.value;
            this.inputValue = event.target.value;
            if(this.currentPageNum == 1){
                this.isFirstPage = true;
            }
            if (this.currentPageNum != 1) {
                this.isFirstPage = false;
            }
            if (this.currentPageNum == this.countOfPages){
                this.isLastPage = true; 
            }
            else {
                this.isLastPage = false;
            }
            const doEvent = new CustomEvent('redraw',{detail: this.currentPageNum});
            this.dispatchEvent(doEvent);
        }
    }
    drawFirstPage(){
        this.currentPageNum = 1;
        this.inputValue = 1;
        this.isFirstPage = true;
        this.isLastPage = false;
        const doEvent = new CustomEvent('redraw', {detail: this.currentPageNum});
        this.dispatchEvent(doEvent);
    }
    drawLastPage(){
        this.currentPageNum = this.countOfPages;
        this.inputValue = this.countOfPages;
        this.isFirstPage = false;
        this.isLastPage = true; 
        const doEvent = new CustomEvent('redraw', {detail: this.currentPageNum});
        this.dispatchEvent(doEvent);
    }
}