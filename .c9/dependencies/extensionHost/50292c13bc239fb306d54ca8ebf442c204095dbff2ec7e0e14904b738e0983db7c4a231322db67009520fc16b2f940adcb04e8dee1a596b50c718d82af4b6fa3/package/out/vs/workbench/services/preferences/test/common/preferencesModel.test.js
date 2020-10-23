/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "assert", "vs/workbench/services/preferences/common/preferencesModels"], function (require, exports, assert, preferencesModels_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('Preferences Model test', () => {
        class Tester {
            constructor(settings) {
                this.settings = settings;
                this.validator = preferencesModels_1.createValidator(settings);
            }
            accepts(input) {
                assert.equal(this.validator(input), '', `Expected ${JSON.stringify(this.settings)} to accept \`${input}\`. Got ${this.validator(input)}.`);
            }
            rejects(input) {
                assert.notEqual(this.validator(input), '', `Expected ${JSON.stringify(this.settings)} to reject \`${input}\`.`);
                return {
                    withMessage: (message) => {
                        const actual = this.validator(input);
                        assert.ok(actual);
                        assert(actual.indexOf(message) > -1, `Expected error of ${JSON.stringify(this.settings)} on \`${input}\` to contain ${message}. Got ${this.validator(input)}.`);
                    }
                };
            }
            validatesNumeric() {
                this.accepts('3');
                this.accepts('3.');
                this.accepts('.0');
                this.accepts('3.0');
                this.accepts(' 3.0');
                this.accepts(' 3.0  ');
                this.rejects('3f');
            }
            validatesNullableNumeric() {
                this.validatesNumeric();
                this.accepts('');
            }
            validatesNonNullableNumeric() {
                this.validatesNumeric();
                this.rejects('');
            }
            validatesString() {
                this.accepts('3');
                this.accepts('3.');
                this.accepts('.0');
                this.accepts('3.0');
                this.accepts(' 3.0');
                this.accepts(' 3.0  ');
                this.accepts('');
                this.accepts('3f');
                this.accepts('hello');
            }
        }
        test('exclusive max and max work together properly', () => {
            {
                const justMax = new Tester({ maximum: 5, type: 'number' });
                justMax.validatesNonNullableNumeric();
                justMax.rejects('5.1');
                justMax.accepts('5.0');
            }
            {
                const justEMax = new Tester({ exclusiveMaximum: 5, type: 'number' });
                justEMax.validatesNonNullableNumeric();
                justEMax.rejects('5.1');
                justEMax.rejects('5.0');
                justEMax.accepts('4.999');
            }
            {
                const bothNumeric = new Tester({ exclusiveMaximum: 5, maximum: 4, type: 'number' });
                bothNumeric.validatesNonNullableNumeric();
                bothNumeric.rejects('5.1');
                bothNumeric.rejects('5.0');
                bothNumeric.rejects('4.999');
                bothNumeric.accepts('4');
            }
            {
                const bothNumeric = new Tester({ exclusiveMaximum: 5, maximum: 6, type: 'number' });
                bothNumeric.validatesNonNullableNumeric();
                bothNumeric.rejects('5.1');
                bothNumeric.rejects('5.0');
                bothNumeric.accepts('4.999');
            }
        });
        test('exclusive min and min work together properly', () => {
            {
                const justMin = new Tester({ minimum: -5, type: 'number' });
                justMin.validatesNonNullableNumeric();
                justMin.rejects('-5.1');
                justMin.accepts('-5.0');
            }
            {
                const justEMin = new Tester({ exclusiveMinimum: -5, type: 'number' });
                justEMin.validatesNonNullableNumeric();
                justEMin.rejects('-5.1');
                justEMin.rejects('-5.0');
                justEMin.accepts('-4.999');
            }
            {
                const bothNumeric = new Tester({ exclusiveMinimum: -5, minimum: -4, type: 'number' });
                bothNumeric.validatesNonNullableNumeric();
                bothNumeric.rejects('-5.1');
                bothNumeric.rejects('-5.0');
                bothNumeric.rejects('-4.999');
                bothNumeric.accepts('-4');
            }
            {
                const bothNumeric = new Tester({ exclusiveMinimum: -5, minimum: -6, type: 'number' });
                bothNumeric.validatesNonNullableNumeric();
                bothNumeric.rejects('-5.1');
                bothNumeric.rejects('-5.0');
                bothNumeric.accepts('-4.999');
            }
        });
        test('multiple of works for both integers and fractions', () => {
            {
                const onlyEvens = new Tester({ multipleOf: 2, type: 'number' });
                onlyEvens.accepts('2.0');
                onlyEvens.accepts('2');
                onlyEvens.accepts('-4');
                onlyEvens.accepts('0');
                onlyEvens.accepts('100');
                onlyEvens.rejects('100.1');
                onlyEvens.rejects('');
                onlyEvens.rejects('we');
            }
            {
                const hackyIntegers = new Tester({ multipleOf: 1, type: 'number' });
                hackyIntegers.accepts('2.0');
                hackyIntegers.rejects('.5');
            }
            {
                const halfIntegers = new Tester({ multipleOf: 0.5, type: 'number' });
                halfIntegers.accepts('0.5');
                halfIntegers.accepts('1.5');
                halfIntegers.rejects('1.51');
            }
        });
        test('integer type correctly adds a validation', () => {
            {
                const integers = new Tester({ multipleOf: 1, type: 'integer' });
                integers.accepts('02');
                integers.accepts('2');
                integers.accepts('20');
                integers.rejects('.5');
                integers.rejects('2j');
                integers.rejects('');
            }
        });
        test('null is allowed only when expected', () => {
            {
                const nullableIntegers = new Tester({ type: ['integer', 'null'] });
                nullableIntegers.accepts('2');
                nullableIntegers.rejects('.5');
                nullableIntegers.accepts('2.0');
                nullableIntegers.rejects('2j');
                nullableIntegers.accepts('');
            }
            {
                const nonnullableIntegers = new Tester({ type: ['integer'] });
                nonnullableIntegers.accepts('2');
                nonnullableIntegers.rejects('.5');
                nonnullableIntegers.accepts('2.0');
                nonnullableIntegers.rejects('2j');
                nonnullableIntegers.rejects('');
            }
            {
                const nullableNumbers = new Tester({ type: ['number', 'null'] });
                nullableNumbers.accepts('2');
                nullableNumbers.accepts('.5');
                nullableNumbers.accepts('2.0');
                nullableNumbers.rejects('2j');
                nullableNumbers.accepts('');
            }
            {
                const nonnullableNumbers = new Tester({ type: ['number'] });
                nonnullableNumbers.accepts('2');
                nonnullableNumbers.accepts('.5');
                nonnullableNumbers.accepts('2.0');
                nonnullableNumbers.rejects('2j');
                nonnullableNumbers.rejects('');
            }
        });
        test('string max min length work', () => {
            {
                const min = new Tester({ minLength: 4, type: 'string' });
                min.rejects('123');
                min.accepts('1234');
                min.accepts('12345');
            }
            {
                const max = new Tester({ maxLength: 6, type: 'string' });
                max.accepts('12345');
                max.accepts('123456');
                max.rejects('1234567');
            }
            {
                const minMax = new Tester({ minLength: 4, maxLength: 6, type: 'string' });
                minMax.rejects('123');
                minMax.accepts('1234');
                minMax.accepts('12345');
                minMax.accepts('123456');
                minMax.rejects('1234567');
            }
        });
        test('patterns work', () => {
            {
                const urls = new Tester({ pattern: '^(hello)*$', type: 'string' });
                urls.accepts('');
                urls.rejects('hel');
                urls.accepts('hello');
                urls.rejects('hellohel');
                urls.accepts('hellohello');
            }
            {
                const urls = new Tester({ pattern: '^(hello)*$', type: 'string', patternErrorMessage: 'err: must be friendly' });
                urls.accepts('');
                urls.rejects('hel').withMessage('err: must be friendly');
                urls.accepts('hello');
                urls.rejects('hellohel').withMessage('err: must be friendly');
                urls.accepts('hellohello');
            }
        });
        test('custom error messages are shown', () => {
            const withMessage = new Tester({ minLength: 1, maxLength: 0, type: 'string', errorMessage: 'always error!' });
            withMessage.rejects('').withMessage('always error!');
            withMessage.rejects(' ').withMessage('always error!');
            withMessage.rejects('1').withMessage('always error!');
        });
        class ArrayTester {
            constructor(settings) {
                this.settings = settings;
                this.validator = preferencesModels_1.createValidator(settings);
            }
            accepts(input) {
                assert.equal(this.validator(input), '', `Expected ${JSON.stringify(this.settings)} to accept \`${JSON.stringify(input)}\`. Got ${this.validator(input)}.`);
            }
            rejects(input) {
                assert.notEqual(this.validator(input), '', `Expected ${JSON.stringify(this.settings)} to reject \`${JSON.stringify(input)}\`.`);
                return {
                    withMessage: (message) => {
                        const actual = this.validator(input);
                        assert.ok(actual);
                        assert(actual.indexOf(message) > -1, `Expected error of ${JSON.stringify(this.settings)} on \`${input}\` to contain ${message}. Got ${this.validator(input)}.`);
                    }
                };
            }
        }
        test('simple array', () => {
            {
                const arr = new ArrayTester({ type: 'array', items: { type: 'string' } });
                arr.accepts([]);
                arr.accepts(['foo']);
                arr.accepts(['foo', 'bar']);
            }
        });
        test('min-max items array', () => {
            {
                const arr = new ArrayTester({ type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 2 });
                arr.rejects([]).withMessage('Array must have at least 1 items');
                arr.accepts(['a']);
                arr.accepts(['a', 'a']);
                arr.rejects(['a', 'a', 'a']).withMessage('Array must have less than 2 items');
            }
        });
        test('array of enums', () => {
            {
                const arr = new ArrayTester({ type: 'array', items: { type: 'string', enum: ['a', 'b'] } });
                arr.accepts(['a']);
                arr.accepts(['a', 'b']);
                arr.rejects(['c']).withMessage(`Value 'c' is not one of`);
                arr.rejects(['a', 'c']).withMessage(`Value 'c' is not one of`);
                arr.rejects(['c', 'd']).withMessage(`Value 'c' is not one of`);
                arr.rejects(['c', 'd']).withMessage(`Value 'd' is not one of`);
            }
        });
        test('min-max and enum', () => {
            const arr = new ArrayTester({ type: 'array', items: { type: 'string', enum: ['a', 'b'] }, minItems: 1, maxItems: 2 });
            arr.rejects(['a', 'b', 'c']).withMessage('Array must have less than 2 items');
            arr.rejects(['a', 'b', 'c']).withMessage(`Value 'c' is not one of`);
        });
        test('pattern', () => {
            const arr = new ArrayTester({ type: 'array', items: { type: 'string', pattern: '^(hello)*$' } });
            arr.accepts(['hello']);
            arr.rejects(['a']).withMessage(`Value 'a' must match regex`);
        });
        test('pattern with error message', () => {
            const arr = new ArrayTester({ type: 'array', items: { type: 'string', pattern: '^(hello)*$', patternErrorMessage: 'err: must be friendly' } });
            arr.rejects(['a']).withMessage(`err: must be friendly`);
        });
    });
});
//# sourceMappingURL=preferencesModel.test.js.map