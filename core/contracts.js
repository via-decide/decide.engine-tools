/**
 * @fileoverview Core Data Contract Enforcement Engine
 * @module core/contracts
 * @description
 * Provides a robust, zero-dependency schema validation and contract enforcement system
 * designed specifically for the Decide Engine execution graph. This module ensures that
 * data propagating between nodes (tools, agents, functions) adheres strictly to predefined
 * input and output schemas, preventing malformed data from causing cascading failures.
 * 
 * Features:
 * - Comprehensive type validation (String, Number, Boolean, Object, Array, Enum, Custom)
 * - Deep nested object and array validation
 * - Detailed error reporting with precise JSON paths
 * - Node-level input/output contract binding
 * - Graph edge validation
 */

/**
 * Custom error class for contract validation failures.
 * Provides detailed information about exactly where and why validation failed.
 */
export class ContractValidationError extends Error {
    /**
     * @param {string} message - The general error message.
     * @param {Array<{path: string, message: string, expected?: string, actual?: any}>} details - Detailed validation errors.
     */
    constructor(message, details = []) {
        super(message);
        this.name = 'ContractValidationError';
        this.details = details;
        
        // Capture stack trace for V8 engines
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ContractValidationError);
        }
    }

    /**
     * Formats the error details into a readable string.
     * @returns {string} Formatted error string.
     */
    formatDetails() {
        return this.details.map(d => `  - [${d.path || 'root'}]: ${d.message}`).join('\n');
    }
}

/**
 * Base Validator class that all specific type validators inherit from.
 * Handles common constraints like required/optional and default values.
 */
export class BaseValidator {
    constructor() {
        this._isRequired = true;
        this._defaultValue = undefined;
        this._nullable = false;
        this._description = '';
    }

    /**
     * Marks the field as optional.
     * @returns {this} The validator instance for chaining.
     */
    optional() {
        this._isRequired = false;
        return this;
    }

    /**
     * Allows the field to be explicitly null.
     * @returns {this} The validator instance for chaining.
     */
    nullable() {
        this._nullable = true;
        return this;
    }

    /**
     * Sets a default value if the field is undefined.
     * @param {*} value - The default value to apply.
     * @returns {this} The validator instance for chaining.
     */
    default(value) {
        this._defaultValue = value;
        this._isRequired = false; // Setting a default implies it's not strictly required from input
        return this;
    }

    /**
     * Adds a description to the field for documentation purposes.
     * @param {string} desc - The description.
     * @returns {this} The validator instance for chaining.
     */
    describe(desc) {
        this._description = desc;
        return this;
    }

    /**
     * Core validation logic to be implemented by subclasses.
     * @param {*} value - The value to validate.
     * @param {string} path - The current path in the data structure.
     * @returns {{valid: boolean, value: *, errors: Array<{path: string, message: string}>}} Validation result.
     */
    validate(value, path = '') {
        const errors = [];
        let finalValue = value;

        if (finalValue === undefined) {
            if (this._defaultValue !== undefined) {
                finalValue = typeof this._defaultValue === 'function' ? this._defaultValue() : this._defaultValue;
            } else if (this._isRequired) {
                errors.push({ path, message: 'Value is required but was undefined.' });
                return { valid: false, value: finalValue, errors };
            } else {
                return { valid: true, value: finalValue, errors };
            }
        }

        if (finalValue === null) {
            if (this._nullable) {
                return { valid: true, value: finalValue, errors };
            } else {
                errors.push({ path, message: 'Value cannot be null.' });
                return { valid: false, value: finalValue, errors };
            }
        }

        return this._validateType(finalValue, path, errors);
    }

    /**
     * Internal type validation to be overridden by subclasses.
     * @protected
     * @param {*} value - The value to validate.
     * @param {string} path - The current path.
     * @param {Array} errors - The accumulated errors array.
     * @returns {{valid: boolean, value: *, errors: Array}}
     */
    _validateType(value, path, errors) {
        throw new Error('Method _validateType must be implemented by subclass.');
    }
}

/**
 * Validator for String types.
 */
export class StringValidator extends BaseValidator {
    constructor() {
        super();
        this._minLength = null;
        this._maxLength = null;
        this._pattern = null;
        this._allowedValues = null;
    }

    min(length) { this._minLength = length; return this; }
    max(length) { this._maxLength = length; return this; }
    pattern(regex) { this._pattern = regex; return this; }
    oneOf(values) { this._allowedValues = values; return this; }

    _validateType(value, path, errors) {
        if (typeof value !== 'string') {
            errors.push({ path, message: `Expected string, got ${typeof value}.` });
            return { valid: false, value, errors };
        }

        if (this._minLength !== null && value.length < this._minLength) {
            errors.push({ path, message: `String length must be at least ${this._minLength}.` });
        }
        if (this._maxLength !== null && value.length > this._maxLength) {
            errors.push({ path, message: `String length must be at most ${this._maxLength}.` });
        }
        if (this._pattern !== null && !this._pattern.test(value)) {
            errors.push({ path, message: `String does not match required pattern ${this._pattern}.` });
        }
        if (this._allowedValues !== null && !this._allowedValues.includes(value)) {
            errors.push({ path, message: `String must be one of: ${this._allowedValues.join(', ')}.` });
        }

        return { valid: errors.length === 0, value, errors };
    }
}

/**
 * Validator for Number types.
 */
export class NumberValidator extends BaseValidator {
    constructor() {
        super();
        this._min = null;
        this._max = null;
        this._isInteger = false;
        this._isPositive = false;
    }

    min(val) { this._min = val; return this; }
    max(val) { this._max = val; return this; }
    integer() { this._isInteger = true; return this; }
    positive() { this._isPositive = true; return this; }

    _validateType(value, path, errors) {
        if (typeof value !== 'number' || isNaN(value)) {
            errors.push({ path, message: `Expected valid number, got ${typeof value}.` });
            return { valid: false, value, errors };
        }

        if (this._isInteger && !Number.isInteger(value)) {
            errors.push({ path, message: `Expected integer, got float.` });
        }
        if (this._isPositive && value <= 0) {
            errors.push({ path, message: `Expected positive number, got ${value}.` });
        }
        if (this._min !== null && value < this._min) {
            errors.push({ path, message: `Number must be >= ${this._min}.` });
        }
        if (this._max !== null && value > this._max) {
            errors.push({ path, message: `Number must be <= ${this._max}.` });
        }

        return { valid: errors.length === 0, value, errors };
    }
}

/**
 * Validator for Boolean types.
 */
export class BooleanValidator extends BaseValidator {
    _validateType(value, path, errors) {
        if (typeof value !== 'boolean') {
            errors.push({ path, message: `Expected boolean, got ${typeof value}.` });
            return { valid: false, value, errors };
        }
        return { valid: true, value, errors };
    }
}

/**
 * Validator for Array types.
 */
export class ArrayValidator extends BaseValidator {
    /**
     * @param {BaseValidator} itemValidator - Validator for the array elements.
     */
    constructor(itemValidator) {
        super();
        this._itemValidator = itemValidator;
        this._minLength = null;
        this._maxLength = null;
    }

    min(length) { this._minLength = length; return this; }
    max(length) { this._maxLength = length; return this; }

    _validateType(value, path, errors) {
        if (!Array.isArray(value)) {
            errors.push({ path, message: `Expected array, got ${typeof value}.` });
            return { valid: false, value, errors };
        }

        if (this._minLength !== null && value.length < this._minLength) {
            errors.push({ path, message: `Array must contain at least ${this._minLength} items.` });
        }
        if (this._maxLength !== null && value.length > this._maxLength) {
            errors.push({ path, message: `Array must contain at most ${this._maxLength} items.` });
        }

        const validatedArray = [];
        let allValid = true;

        for (let i = 0; i < value.length; i++) {
            const itemPath = path ? `${path}[${i}]` : `[${i}]`;
            const result = this._itemValidator.validate(value[i], itemPath);
            
            if (!result.valid) {
                allValid = false;
                errors.push(...result.errors);
            }
            validatedArray.push(result.value);
        }

        return { valid: allValid && errors.length === 0, value: validatedArray, errors };
    }
}

/**
 * Validator for Object types. Supports nested schemas and strict mode.
 */
export class ObjectValidator extends BaseValidator {
    /**
     * @param {Object.<string, BaseValidator>} schema - The object schema mapping keys to validators.
     */
    constructor(schema) {
        super();
        this._schema = schema || {};
        this._strict = false;
    }

    /**
     * Enforces strict mode, rejecting objects with properties not defined in the schema.
     * @returns {this}
     */
    strict() {
        this._strict = true;
        return this;
    }

    _validateType(value, path, errors) {
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
            errors.push({ path, message: `Expected object, got ${value === null ? 'null' : typeof value}.` });
            return { valid: false, value, errors };
        }

        const validatedObject = {};
        let allValid = true;
        const keys = new Set([...Object.keys(this._schema), ...Object.keys(value)]);

        for (const key of keys) {
            const itemPath = path ? `${path}.${key}` : key;
            const validator = this._schema[key];

            if (!validator) {
                if (this._strict) {
                    allValid = false;
                    errors.push({ path: itemPath, message: `Key '${key}' is not allowed in strict mode.` });
                } else {
                    // Pass through unknown keys if not strict
                    validatedObject[key] = value[key];
                }
                continue;
            }

            const result = validator.validate(value[key], itemPath);
            
            if (!result.valid) {
                allValid = false;
                errors.push(...result.errors);
            } else if (result.value !== undefined) {
                validatedObject[key] = result.value;
            }
        }

        return { valid: allValid && errors.length === 0, value: validatedObject, errors };
    }
}

/**
 * Validator for custom function-based validation logic.
 */
export class CustomValidator extends BaseValidator {
    /**
     * @param {Function} validationFn - Function returning boolean or throwing an error.
     */
    constructor(validationFn) {
        super();
        this._validationFn = validationFn;
    }

    _validateType(value, path, errors) {
        try {
            const isValid = this._validationFn(value);
            if (!isValid) {
                errors.push({ path, message: `Custom validation failed.` });
                return { valid: false, value, errors };
            }
        } catch (err) {
            errors.push({ path, message: `Custom validation threw error: ${err.message}` });
            return { valid: false, value, errors };
        }
        return { valid: true, value, errors };
    }
}

/**
 * Validator for Any type (bypasses type checking, but handles required/optional).
 */
export class AnyValidator extends BaseValidator {
    _validateType(value, path, errors) {
        return { valid: true, value, errors };
    }
}

/**
 * Types Factory
 * Provides a clean API for constructing schemas.
 * Example: Types.object({ id: Types.string().required(), count: Types.number().min(0) })
 */
export const Types = {
    string: () => new StringValidator(),
    number: () => new NumberValidator(),
    boolean: () => new BooleanValidator(),
    array: (itemValidator) => new ArrayValidator(itemValidator),
    object: (schema) => new ObjectValidator(schema),
    custom: (fn) => new CustomValidator(fn),
    any: () => new AnyValidator(),
    enum: (values) => new StringValidator().oneOf(values)
};

/**
 * Represents a defined Data Contract.
 * Wraps a validator and provides assertion methods.
 */
export class Contract {
    /**
     * @param {string} name - The name of the contract.
     * @param {BaseValidator} schema - The root validator (usually an ObjectValidator).
     */
    constructor(name, schema) {
        this.name = name;
        this.schema = schema;
    }

    /**
     * Validates data against the contract without throwing an error.
     * @param {*} data - The data payload to validate.
     * @returns {{valid: boolean, data: *, errors: Array}} 
     */
    validate(data) {
        const result = this.schema.validate(data, '');
        return {
            valid: result.valid,
            data: result.value,
            errors: result.errors
        };
    }

    /**
     * Asserts that data matches the contract. Throws ContractValidationError if invalid.
     * @param {*} data - The data payload to check.
     * @returns {*} The validated and potentially transformed (defaults applied) data.
     * @throws {ContractValidationError}
     */
    assert(data) {
        const result = this.validate(data);
        if (!result.valid) {
            const errorMsg = `Contract '${this.name}' validation failed.`;
            throw new ContractValidationError(errorMsg, result.errors);
        }
        return result.data;
    }
}

/**
 * Central Registry for managing named contracts across the engine.
 */
export class ContractRegistry {
    constructor() {
        this._contracts = new Map();
    }

    /**
     * Defines and registers a new contract.
     * @param {string} name - Unique identifier for the contract.
     * @param {BaseValidator} schema - The schema definition.
     * @returns {Contract} The created contract.
     */
    define(name, schema) {
        if (this._contracts.has(name)) {
            console.warn(`[ContractRegistry] Overwriting existing contract: ${name}`);
        }
        const contract = new Contract(name, schema);
        this._contracts.set(name, contract);
        return contract;
    }

    /**
     * Retrieves a contract by name.
     * @param {string} name - The contract name.
     * @returns {Contract}
     * @throws {Error} If contract is not found.
     */
    get(name) {
        if (!this._contracts.has(name)) {
            throw new Error(`Contract '${name}' not found in registry.`);
        }
        return this._contracts.get(name);
    }

    /**
     * Checks if a contract exists.
     * @param {string} name - The contract name.
     * @returns {boolean}
     */
    has(name) {
        return this._contracts.has(name);
    }
}

// Global Singleton Registry Export
export const globalContractRegistry = new ContractRegistry();

/**
 * NodeContract
 * Represents the strict Input and Output requirements for a specific Execution Node (Tool/Agent).
 */
export class NodeContract {
    /**
     * @param {Object} config
     * @param {string} config.nodeName - Name of the node.
     * @param {BaseValidator} config.inputSchema - Schema for data entering the node.
     * @param {BaseValidator} config.outputSchema - Schema for data exiting the node.
     */
    constructor({ nodeName, inputSchema, outputSchema }) {
        this.nodeName = nodeName;
        this.inputContract = new Contract(`${nodeName}_Input`, inputSchema || Types.any());
        this.outputContract = new Contract(`${nodeName}_Output`, outputSchema || Types.any());
    }

    /**
     * Wraps a node's execution function with strict contract enforcement.
     * @param {Function} executionFn - The async function representing the node's logic.
     * @returns {Function} A wrapped async function that enforces inputs and outputs.
     */
    enforce(executionFn) {
        return async (inputData, context = {}) => {
            // 1. Validate Input
            let validatedInput;
            try {
                validatedInput = this.inputContract.assert(inputData);
            } catch (error) {
                if (error instanceof ContractValidationError) {
                    console.error(`[Node: ${this.nodeName}] Input Validation Failed:\n${error.formatDetails()}`);
                    throw new Error(`Node '${this.nodeName}' received invalid input: ${error.message}`);
                }
                throw error;
            }

            // 2. Execute Node Logic
            let rawOutput;
            try {
                rawOutput = await executionFn(validatedInput, context);
            } catch (error) {
                console.error(`[Node: ${this.nodeName}] Execution Failed:`, error);
                throw error;
            }

            // 3. Validate Output
            let validatedOutput;
            try {
                validatedOutput = this.outputContract.assert(rawOutput);
            } catch (error) {
                if (error instanceof ContractValidationError) {
                    console.error(`[Node: ${this.nodeName}] Output Validation Failed:\n${error.formatDetails()}`);
                    throw new Error(`Node '${this.nodeName}' produced invalid output: ${error.message}`);
                }
                throw error;
            }

            return validatedOutput;
        };
    }
}

/**
 * GraphEdgeValidator
 * Validates the transition of data between two nodes in the execution graph,
 * ensuring the output of Node A is compatible with the input of Node B.
 */
export class GraphEdgeValidator {
    /**
     * Validates compatibility between an output schema and an input schema dynamically.
     * Useful for graph compilation/validation before execution.
     * @param {BaseValidator} sourceSchema - The schema of the data source.
     * @param {BaseValidator} targetSchema - The schema of the data destination.
     * @returns {boolean} True if theoretically compatible (basic check).
     */
    static checkCompatibility(sourceSchema, targetSchema) {
        // Advanced structural typing compatibility check could go here.
        // For runtime enforcement, we rely on the actual data passing through NodeContract.
        // This is a placeholder for static graph analysis.
        if (!sourceSchema || !targetSchema) return false;
        
        // If target is 'Any', it's always compatible.
        if (targetSchema instanceof AnyValidator) return true;

        // Basic class match check
        return sourceSchema.constructor === targetSchema.constructor;
    }

    /**
     * Enforces an edge transmission at runtime.
     * @param {Contract} sourceOutputContract 
     * @param {Contract} targetInputContract 
     * @param {*} data 
     * @returns {*} Validated data ready for the target node.
     */
    static enforceTransition(sourceOutputContract, targetInputContract, data) {
        // Ensure the data conforms to what the source claims it outputs
        const sourceData = sourceOutputContract.assert(data);
        
        // Ensure the data conforms to what the target requires
        const targetData = targetInputContract.assert(sourceData);

        return targetData;
    }
}

export default {
    ContractValidationError,
    Types,
    Contract,
    ContractRegistry,
    globalContractRegistry,
    NodeContract,
    GraphEdgeValidator
};