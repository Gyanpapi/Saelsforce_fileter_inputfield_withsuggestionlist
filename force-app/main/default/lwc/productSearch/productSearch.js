import { LightningElement, track } from 'lwc';
import fetchProducts from '@salesforce/apex/ProductSearchController.fetchProducts';

export default class ProductSearch extends LightningElement {
    @track suggestions = [];
    @track inputValue = '';
    @track selectedProducts = [];

    handleKeyUp(event) {
        const fullInput = event.target.value;
        this.inputValue = fullInput;

        // Do NOT update selectedExternalIds here!

        // Split by commas, get last incomplete term
        const terms = fullInput.split(',');
        const keyword = terms[terms.length - 1].trim();

        if (keyword.length >= 2) {
            fetchProducts({ keyword })
                .then(result => {
                    this.suggestions = result;
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                });
        } else {
            this.suggestions = [];
        }
    }

    selectSuggestion(event) {
        const selectedExternalId = event.target.dataset.externalid;
        const selectedName = event.target.dataset.name;
        
        if (!this.selectedProducts.find(p => p.externalId === selectedExternalId)) {
            this.selectedProducts.push({ externalId: selectedExternalId, name: selectedName });
        }
        
        this.inputValue = this.selectedProducts.map(p => p.externalId).join(', ') + ', ';

        

        this.suggestions = [];
    }
    removeExternalId(event) {
        const extIdToRemove = event.target.dataset.extid;
        this.selectedProducts = this.selectedProducts.filter(p => p.externalId !== extIdToRemove);
        this.inputValue = this.selectedProducts.map(p => p.externalId).join(', ') + (this.selectedProducts.length ? ', ' : '');
        
    }
}