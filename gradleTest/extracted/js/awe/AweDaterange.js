/*
 * Custom class used for the AweCreatePanel and AweFiltersView,
 * dependent datefields (duration field). Events for calculating
 * are binded in the AweListController, before showing the views.
 */
Ext.define('Awe.AweDaterange', {

    /*
     * These properties are comming from the user
     * based on what kind of dependent fields should be configured
     */
    fromFilter: undefined,
    startField: undefined,
    endField: undefined,
    durationField: undefined,
    fromField: undefined,
    form: undefined,

    // "private" properties
    notEmptyFields: {},
    validationErrors: {},
    // "private" constants used in the class
    MONTH_DAYS: 30,
    MINIMUM_DATE_DIFFERENCE: 29,
    MAXIMUM_DATE_DIFFERENCE: 180,
    ONE_DAY_TIMESTAMP: 86400000,
    MIN_POSSIBLE_DATE: Ext.Date.parse("01.01.2010", "d.m.Y"),
    MAX_POSSIBLE_DATE: Ext.Date.parse("31.12.2049", "d.m.Y"),
    MAX_POSSIBLE_START_DATE: undefined,
    END_STRING: 'end',
    START_STRING: 'start',
    DURATION_STRING: 'duration',

    // "private" methods for validating datefields and duration field if exists
    checkStartDate: function() {
        if (Ext.isEmpty(this.startField.getValue())) {
            return true;
        }
        if (this.startField.getValue() < this.MIN_POSSIBLE_DATE || this.startField.getValue() > this.MAX_POSSIBLE_START_DATE) {
            this.validationErrors[this.startField.name] = i18n.awe.validation.invalidDateRange(this.MIN_POSSIBLE_DATE, this.MAX_POSSIBLE_START_DATE);
            return false;
        }
        return this.startField.isValid();
    },

    checkEndDate: function() {
        if (Ext.isEmpty(this.endField.getValue())) {
            return true;
        }
        if (this.endField.getValue() > this.MAX_POSSIBLE_DATE) {
            this.validationErrors[this.endField.name] = i18n.awe.validation.endDateExceeded(this.MAX_POSSIBLE_DATE);
            return false;
        }
        return this.endField.isValid();
    },

    checkDuration: function() {
	if (Ext.isEmpty(this.durationField.getValue())) {
	    return true;
	}
	if((this.fromField == this.endField.name || this.fromField == this.startField.name) && Object.keys(this.notEmptyFields).length == 3){
	    return true;
	}
        if(!this.durationField.fromEndField && this.durationField.getValue() == parseInt(this.durationField.getValue())){
            return true;
        }
        return this.durationField.fromEndField;
    },

    checkStartEndRange: function() {
        if (Ext.isEmpty(this.endField.getValue()) || Ext.isEmpty(this.startField.getValue())) {
            return true;
        }
        if (this.endField.getValue() instanceof Date && this.startField.getValue() instanceof Date) {
        var difference = Math.round((this.endField.getValue().getTime() - this.startField.getValue().getTime()) / this.ONE_DAY_TIMESTAMP);
        if (difference < this.MINIMUM_DATE_DIFFERENCE && !this.fromFilter) {
            this.validationErrors[this.startField.name] = i18n.awe.validation.invalidDurationValue(this.MINIMUM_DATE_DIFFERENCE, this.MAXIMUM_DATE_DIFFERENCE);
            this.validationErrors[this.endField.name] = i18n.awe.validation.invalidDurationValue(this.MINIMUM_DATE_DIFFERENCE, this.MAXIMUM_DATE_DIFFERENCE);
            this.validationErrors[this.durationField.name] = i18n.awe.validation.invalidDurationValue(this.MINIMUM_DATE_DIFFERENCE, this.MAXIMUM_DATE_DIFFERENCE);
            return false;
        } else if (difference > this.MAXIMUM_DATE_DIFFERENCE && !this.fromFilter) {
            this.validationErrors[this.startField.name] = i18n.awe.validation.invalidDurationValue(this.MINIMUM_DATE_DIFFERENCE, this.MAXIMUM_DATE_DIFFERENCE);
            this.validationErrors[this.endField.name] = i18n.awe.validation.invalidDurationValue(this.MINIMUM_DATE_DIFFERENCE, this.MAXIMUM_DATE_DIFFERENCE);
            this.validationErrors[this.durationField.name] = i18n.awe.validation.invalidDurationValue(this.MINIMUM_DATE_DIFFERENCE, this.MAXIMUM_DATE_DIFFERENCE);
            return false;
        } else if (difference < 0 && this.fromFilter) {
            this.validationErrors[this.fromField] = i18n.awe.validation.invalidDateDifference();
            return false;
        }
        return true;
        } else {
            return false;
        }
    },
    /*
     * Group validation based on the methods above
     * Two cases for filter and not for filter
     */
    groupValidation: function() {
        if (!this.fromFilter) {
            /*
             * If the 3 fields has valid values and the user is comming from duration field or start field
             * we have to pass the group validation and to calculate the end date.
             */
            if (this.checkStartDate() && this.checkEndDate() && this.checkDuration() && !Ext.isEmpty(this.startField.getValue()) && !Ext.isEmpty(this.endField.getValue()) && !Ext.isEmpty(this.durationField.getValue()) && (this.fromField == this.durationField.name || this.fromField == this.startField.name))
                return true;
            /*
             * Else make the standart group validation.
             * We need valid or empty values in the 3 fields, valid range between start and end
             * and more than 1 not empty field, if we have 1 field the group validation will not pass and
             * we are not going to calculate anything.
             */
            return this.checkStartDate() && this.checkEndDate() && this.checkDuration() && this.checkStartEndRange() && (Object.keys(this.notEmptyFields).length > 1);
        } else if (this.fromFilter) {
            /*
             * If we are in the filter and we are from the end field
             * or from the start field but we dont have calculated duration.
             * For example:
             * Start and end are empty -> user sets end date than chooses start after the end date.
             */
            if (this.fromField == this.endField.name || (this.fromField == this.startField.name && this.startField.durationValue === undefined)) {
                return this.checkStartDate() && this.checkEndDate() && this.checkStartEndRange();
            }

            return this.checkStartDate() && this.checkEndDate();
        }
    },
    /*
     * Method used to recognize which field should be calculated
     * Based on the field we are comming from, and how much not empty fields we have.
     */
    recognizeCalculation: function() {
        // Two fields in the create panel
        if (Object.keys(this.notEmptyFields).length == 2 && !this.fromFilter) {
            // If the two fields are end and duration we are going to calculate the start field.
            if (this.notEmptyFields.hasOwnProperty(this.END_STRING) && this.notEmptyFields.hasOwnProperty(this.DURATION_STRING))
                return this.START_STRING;
            //If the two fields are end and start we are going to calculate the duration field.
            if (this.notEmptyFields.hasOwnProperty(this.END_STRING) && this.notEmptyFields.hasOwnProperty(this.START_STRING))
                return this.DURATION_STRING;
            // If the two fields are start and duration we are going to calculte end field.
            if (this.notEmptyFields.hasOwnProperty(this.START_STRING) && this.notEmptyFields.hasOwnProperty(this.DURATION_STRING))
                return this.END_STRING;
        }
        //If we have 3 populated fields in the create panel
        if (Object.keys(this.notEmptyFields).length == 3 && !this.fromFilter) {
            // And we are from the start field, we have to recalculate the end date.
            if (this.fromField == this.startField.name && !this.durationField.hasActiveError())
                return this.END_STRING;
            if (this.fromField == this.startField.name && this.durationField.hasActiveError())
                return this.DURATION_STRING;
            //If we are from the end field, we are going to recalculate the duration value.
            if (this.fromField == this.endField.name)
                return this.DURATION_STRING;
            //If we are from the duration field, we are going to recalculate the end date.
            if (this.fromField == this.durationField.name)
                return this.END_STRING;
        }
        //If we are from the filter with 2 populated dates
        if (Object.keys(this.notEmptyFields).length == 2 && this.fromFilter) {
            //If we are from the end field, we are recalculating the duration value
            if (this.fromField == this.endField.name) {
                return this.DURATION_STRING;
            }
            //If we are from the start and we have already calculated duration we can calculate the end date
            if (this.fromField == this.startField.name && this.startField.durationValue !== undefined) {
                return this.END_STRING;
            }
            //If we are from the start without duration, we can calculate it.
            if (this.fromField == this.startField.name && this.startField.durationValue === undefined) {
                return this.DURATION_STRING;
            }
        }
    },
    /*
     * You can take a look here: http://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
     */
    dateDiffInDays: function(a, b) {
        var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / this.ONE_DAY_TIMESTAMP);
    },
    /*
     * Date calculation
     */
    calcDate: function(type) {
        if (type == this.START_STRING) {
            var endDate = this.endField.getValue();
            var duration = Math.round(this.durationField.getValue() * this.MONTH_DAYS);
            var newDate = new Date(endDate.setDate(endDate.getDate() - duration));
            this.startField.setValue(newDate);
        } else if (type == this.END_STRING && !this.fromFilter) {
            var startDate = this.startField.getValue();
            var duration = Math.round(this.durationField.getValue() * this.MONTH_DAYS);
            var newDate = new Date(startDate.setDate(startDate.getDate() + duration));
            this.endField.setValue(newDate);
        } else if (type == this.END_STRING && this.fromFilter && this.startField.durationValue !== undefined) {
            var startDate = this.startField.getValue();
            var newDate = new Date(startDate.setDate(startDate.getDate() + this.startField.durationValue));
            this.endField.setValue(newDate);
        }
    },
    /*
     * Duration calculation :)
     */
    calcDuration: function() {
        if (!this.fromFilter) {
            var startDate = this.startField.getValue();
            var endDate = this.endField.getValue();
            var newDuration = this.dateDiffInDays(startDate, endDate) / this.MONTH_DAYS;
            this.durationField.suspendEvents();
            this.durationField.setValue(newDuration);
            this.durationField.fromEndField = true;
            this.durationField.resumeEvents(false);
        } else if (this.fromFilter) {
            var startDate = this.startField.getValue();
            var endDate = this.endField.getValue();
            var newDuration = this.dateDiffInDays(startDate, endDate);
            this.startField.durationValue = newDuration;
        }
    },
    /*
     * Wrapper for calculation.
     * Based on the recognizeCalculation result.
     * Decides which calculation method to call.
     */
    calculate: function() {
        var type = this.recognizeCalculation();
        switch (type) {
            case this.START_STRING:
                this.calcDate(this.START_STRING);
                break;
            case this.END_STRING:
                this.calcDate(this.END_STRING);
                break;
            case this.DURATION_STRING:
                this.calcDuration();
                break;
        }
    },
    /*
     * Marking fields invalid.
     */
    markFields: function() {
        for (fieldId in this.validationErrors) {
            /*
             * Stupid "hack" but with only setActiveError.
             * The tooltip with error message doesnt show.
             * That's why mark and set.
             */
            this.form.findField(fieldId).markInvalid(this.validationErrors[fieldId]);
            this.form.findField(fieldId).setActiveError(this.validationErrors[fieldId]);
        }
    },
    /*
     * Count how much of the dependent fields are not empty
     */
    countNotEmptyFields: function() {
        if (this.startField.getValue()) {
            this.notEmptyFields[this.START_STRING] = this.startField;
        }

        if (this.endField.getValue()) {
            this.notEmptyFields[this.END_STRING] = this.endField;
        }

        if (!this.fromFilter && this.durationField.getValue()) {
            this.notEmptyFields[this.DURATION_STRING] = this.durationField;
        }
    },
    // "public" methods bellow
    /*
     * Resets the errors. Calls group validation
     * and if its passed calls the calculation.
     * After calculation validates the values.
     */
    buildFields: function() {
        this.notEmptyFields = {};
        this.countNotEmptyFields();
        if (this.groupValidation()) {
            this.calculate();
            this.startField.validate();
            this.endField.validate();
            if (!this.fromFilter)
                this.durationField.validate();
        } else {
            this.markFields();
            this.validationErrors = {};
            if (this.fromFilter)
                this.startField.durationValue = undefined;
        }
    },
    /*
     * Checks if the current state of the 3 fields is valid combination.
     * Used in save awe method in AweDialogController
     */
    isCombinationValid: function() {
        if (!this.fromFilter) {
            if(this.startField.isRequest && this.endField.isRequest && this.durationField.isRequest){
        	return true;
            }
            return !(this.startField.hasActiveError() || this.endField.hasActiveError() || this.durationField.hasActiveError());
        }
    },

    clear: function(){
	    this.fromFilter = undefined;
	    this.startField = undefined;
	    this.endField = undefined;
	    this.durationField = undefined;
	    this.fromField = undefined;
	    this.form = undefined;
    },
    /*
     * Applies passed properties
     */
    constructor: function(options) {
        Ext.apply(this, options || {});
        this.MAX_POSSIBLE_START_DATE = new Date(this.MAX_POSSIBLE_DATE.setDate(this.MAX_POSSIBLE_DATE.getDate() - this.MINIMUM_DATE_DIFFERENCE));
    }

});