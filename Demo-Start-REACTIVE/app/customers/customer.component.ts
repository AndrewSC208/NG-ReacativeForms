import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn} from '@angular/forms';

import {Customer} from './customer';

// SIMPLE CUSTOM VALIDATOR:
function ratingRange1(c: AbstractControl): {[key: string]: boolean} | null {
	if(c.value != undefined && (isNaN(c.value) || c.value < 1 || c.value > 5)) {
		return {'range': true};
	};

	return null;
};

// COMPLEX CUSTOM VALIDATOR:
function ratingRange2(min: number, max: number): ValidatorFn {
	return (c: AbstractControl): {[key: string]: boolean} | null => {

		if(c.value != undefined && (isNaN(c.value) || c.value < min || c.value > max)) {
			return {'range': true};
		};
	
		return null;
	};
};

// CROSS FIELD VALIDATION:
function emailMatcher(c: AbstractControl) {
    let emailControl = c.get('email');
    let confirmControl = c.get('confirmEmail');
    
    if (emailControl.pristine || confirmControl.pristine) {
        return null;
    }

    if (emailControl.value === confirmControl.value) {
        return null;
    }

    return { 'match': true };
}

@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit {
	customerForm: FormGroup;
    customer: Customer= new Customer();

    constructor(private fb: FormBuilder) {

    }

    ngOnInit(): void {
    	this.customerForm = this.fb.group({
    			firstName: ['', [Validators.required, Validators.minLength(3)]],
    			lastName: ['', [Validators.required, Validators.maxLength(50)]],
                emailGroup: this.fb.group(
                    {
                        email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
                        confirmEmail: ['', Validators.required],
                    },
                    {
                        validator: emailMatcher
                    }
                ),
    			phone: '',
    			notification: 'email',
    			rating: ['', ratingRange2(1, 5)],
    			sendCatalog: true
    		}
    	);

        this.customerForm.get('notification').valueChanges
            .subscribe( value => console.log(value));
    }

    // these are hear to display 'setValue' when using formControl
    populateTestData(): void {
    	this.customerForm.setValue({
    			firstName: 'Andrew',
    			lastName: 'Meiling',
    			email: 'test1@test.com',
    			sendCatalog: false
    		}
    	);
    }

    // these are hear to display 'patchValue' when using formControl
    populateName(): void {
    	this.customerForm.patchValue({
    			firstName: 'Andrew',
    			lastName: 'Meiling'
    		}
    	);
    }

    save() {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    }

    setNotification(notifyVia: string): void {
    	const phoneControl = this.customerForm.get('phone');

    	if(notifyVia === 'text') {
    		phoneControl.setValidators(Validators.required);
    	} else {
    		phoneControl.clearValidators();
    	}

    	phoneControl.updateValueAndValidity();

    }
}


