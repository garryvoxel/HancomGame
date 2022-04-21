class Validator {
    constructor(rules) {
        this.rules = rules;
    }

    validate(params) {
        for (var name in params) {
            const value = params[name];

            for (var i in this.rules) {
                const rule = this.rules[i];

                if (name === rule.name) {
                    if (rule.required) {
                        if (! value) {
                            return `${value} mismatch ${name} 필드가 필요합니다.`;
                        }
                    }
                    
                    if (rule.confirmed) {
                        const passwordConfirmation = params[name + '_confirmation'];

                        if (! passwordConfirmation || value !== passwordConfirmation) {
                            return `${name} 필드와 ${name}_confirmation 필드가 일치하지 않습니다.`;
                        }
                    }
                }
            }
        }

        return true;
    }
}

module.exports = Validator;