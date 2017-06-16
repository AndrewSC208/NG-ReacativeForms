CLASS COMMENTS: http://blogs.msmvps.com/deborahk/angular-2-reactive-forms-problem-solver/

CLASS TITLE: ANGULAR 2: REACTIVE FORMS

Template Forms vs Reacative Forms:

1. Angular form building blocks
	- FormGroup
	- FormControl

2. Template Syntax for Forms
3. Template-driven forms
4. Complex Scenarios


STATE:
	Value changed
		1. pristine
		2. dirty

	validity
		1. valid
		2. errors

	Visited
		1. touched
		2. untoched

FORM BUILDING BLOCKS:
	-FormControl
		-> one input element
	-FormGroup
		-> group of input elements

FORM MODEL:
	-Retains form state
	-Retains form value
	-Retains child controls
		*FormControls
		*Nested FormGroups

TEAMPLATE DRIVEN FORMS:
	Template
		-Form elements
		-Input elements(s)
		-Data binding
		-Validation rules (attributes)
		-Form model auomatically generated
	
	Component Class
		- Properties for data binding (data model)
		- Methods for form oprations, such as submit

	FormsModule
		*ngForm
		*ngModel
		*ngModleGroup

		TEMPLATE EXAMPLE:

		<form (ngSubmit)="save()">
			<input
				type="text"
				id="firstNameId"
				[(ngModel)]="cusomer.firstName"
				name="firstName"
				#firstNameVar="ngModel" />
		</form>

		Template-Driven Form:

		<form (ngSubmit)="save()">
			<fieldset>

				<div [ngClass]="{'has-error': firsNameVar.touched && !firstNameVar.valid}">
					<label for="firstNameId">First Name</label>
					<input id="firsNameId" type="text"
						placeholder="First Name (required)"
						required
						minlength="3"
						[(ngModel)]="customer.firstName"
						name="firstName"
						#firstNameVar="ngModel" />
					<span *ngIf="firstNameVar.touched && firstNameVar.errors">
						Please enter your first name.
					</span>
				</div>

			</fieldset>
		</form>

REACTIVE FORMS:
	Component Class -> holds the main responsibility for creating the form
		- Form Model
		- Validation rules
		- Validation error messages
		- Properties for managing data (data model)
		- Methods for form operations, such as submit

Template
	- Form element
	- Input element(s)
	- Binding to form model

ReactiveFormsModule
	* Root FormGroup
	* fromControl
	* formControlName
	* formGroupName
	* formArrayName

REACTIVE FORM COMPONENT TEMPLATE:

	import {FormGroup, FormControl} form '@angular/forms';

	export class customerComponent implements OnInit {
		customerForm: FormGroup;
		customer: Customer = new Customer();

		ngOnInit(): void {
			this.customerForm = new FormGroup(
				{
					firstName: new FormControl(),
					lastName: new FormControl(),
					email: new Formcontrol(),
					sendCatalog: new FormControl(true)
				}
			);
		}

	}

*FORM BUILDER: 
	- Creates a form model from a configuration
	- Shortens boilerplate code
	- Provided as a service

	**Steps:
		1. Import FormBuilder
		2. Inject the FormBuilder instance
		3. use the instance
	
	** Syntax:
		- OPTION 1:
		this.customerForm = this.fb.group({
				firstName: '',
				sendCatalog: true
			}
		)

		- OPTION 2:
		this.customerForm = this.fb.group({
				firstName: {value: 'n/a', disabled: true},
				sendCatalog: {value: true, disabled: false}
			}
		);

		- OPTION 3:
		this.customerForm = this.fb.group({
				firstName: ['', ...validationRules],
				sendCatalog: [{value: true, disabled: false}, ...validationRules]
			}
		);


*CHECKLIST: NgModule Setup:
	1. Import ReactiveFormsModule
	2. Add ReactiveFormsModule to the imports array

*CHECKLIST: Component Class with FormGroup and FormControl
	1. Import FormGroup and FormControl
	2. Create a propertyfor the root FormGroup
	3. Create the FormGroup instance
	4. Pass in each FormControl instance
	
	I.E.: FormGroup and FormControl:
		import {FormGroup, FormControl} from '@angular/forms';

		customerForm: FormGroup;

		ngOnInit(): void {
			this.customerForm = new FormGroup({
					firstName: new FormControl(),
					lastName: new FormControl(),
					email: new FormControl(),
					sendCatalog: new FormControl(true)
				}
			)
		}

*CHECKLIST: Component Class with FormGroup and FormBuilder
	1. Import FormGroup and FormBuilder
	2. Create a propertyfor the root FormGroup
	3. Inject the FormBuilder instance
	4. Use that instance

	I.E.: FormGroup and FormBuilder:
		import {FormGroup, FormBuilder} from '@angular/forms';

		customerForm: FormGroup;

		constructor(private fb: FormBuilder) {}

		ngOnInit(): void {
			this.customerForm = this.fb.group({
					firstName: '',
					lastName: '',
					email: '',
					sendCatalog: false
				}
			);
		}

*CHECKLIST: HTML Template
1. Bind the form element to the FormGroup property
		<form 
			class="form-horizontal"
			(ngSubmit)="save()"
			[formGroup]="customerForm">
		...
		</form>

2. Bind each input element to it's associated FormControl
		<input
			class="form-control"
			id="firstNameId"
			type="text"
			placeholder="First Name (required)"
			formControlName="firstName" /> 

***FORM VALIDATION THE REACTIVE WAY***
Overview:
	1. Setting Built-in Validation Rules
	2. Adjusting Validation Rules at Runtime
	3. Custom Validators
	4. Custom Validators with Parameters
	5. Cross-field Validation

#SETTING BUILT-IN VALIDATORS
	SINGULAR:
	this.customerForm = this.fb.group({
			firstName: ['', Validators.required],
			sendCatalog: true
		}
	)

	MULTIPLE:
	this.customerForm = this.fb.group({
			firstName: ['', 
				[Validators.required, Validators.minLength(3)]
			],
			sendCatalog: true
		}
	)

*ADJUSTING VALIDATION RULES AT RUNTIME:
	=> Ref Validator method

#CUSTOM VALIDATORS
	SIMPLE EXAMPLE:
	function myCustomValidator(c: AbstractControl): {[key: string]: boolean} | null {
		if(someThingIsWrong) {
			return {'myValidator': true};
		}

		return null;
	}

	=> Ref ratingRange1 method

	COMPLEX EXAMPLE USING FACTOR FUNCTION THAT RETURNS ABSTRACT_CONTROL:

	function myCustomValidator(param: any): ValidatorFn {
		return (c: AbstractControl): {[key: string]: boolean} | null => {
			if (somethingIsWrong) {
				return {'myValidator': true };
			}

			return null;
		}
	}

	=> Ref ratingRange2 method

#CROSS-FIELD VALIDATION
	EXAMPLE:
	
	JS:
	this.customerForm = this.fb.group({
			firstName: ['', [Validators.required, Validators.minLength(3)]],
			lastName: ['', [Validators.required, Validators.maxLength(50)]],
			availability: this.fb.group({
					start: ['', Validators.required],
					end: ['', Validators.required]
				}
			)
		}
	)

	TEMPLATE:
	<div formGroupName="availability">
		...
		<input formControlName="start" />
		...
		<input formControlName="end" />
	</div>

#Checklist: Validators

##Setting BUilt-in Validations Rules:
	1. Import validators
	2. pass in the validator or array of validators

##Adjusting validation Rules
	1. Determin when to make the change
	2. Use setValidators or clearValidators
	3. Call updateValueAndValidity

##Custom Validators:
	1. build a validator function
	2. Use it like any other validator

##Custom Validators with Parameters
	1. Wrap the validator function in a factory function
	2. Use it like any other validator

## Cross-field Validation: FormGroup
	1. Create a nested FormGroup
	2. Add FormControls to that FormGroup
	3. Update the HTML

## Cross-field Validation: Validator
	1. Build a custom validator
	2. Use the validator

# REACTING TO CHANGES:
	1. Watching:
		a. valueChanges: property emits events on changes
		b. valueChagnes: is an Observable<any>
		c. Observable is a collection of events that arrive asynchronously over time
		d. Subscribe to the observable to watch the events
		e. statusChanges properties emits events on validation changes

		Example: 

			this.myFormcontrol.valuseChanges.subscribe(value => console.log(value));

			or

			this.myFormGroup.valueChanges.subscribe(value => console.log(JSON.stringify(value)));

			or 

			this.customerForm.valueChanges.subscribe(value => console.log(JSON.stringify(value)));

	2. Reacting:
		a.





