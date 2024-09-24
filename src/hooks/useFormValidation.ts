import { useState } from "react"

type ValidationRules<T> = {
    [K in keyof T]?: (value: string) => string | null;
}

const useFormValidation = <T extends { [key: string]: any }>(initialState: T, validationRules?: ValidationRules<T>) => {
    const [formValues, setFormValues] = useState<T>(initialState);
    const [validationError, setValidationError] = useState<Partial<{ [K in keyof T]: string | null }>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLTextAreaElement>|React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSelectorChange = (name: string, value: number) => {
        setFormValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleOnBlurValidation = (e: React.FocusEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        if(validationRules![name as keyof T]) {
            const validationFunction = validationRules![name as keyof T];
            if(validationFunction) {
                const error = validationFunction(value);
                setValidationError(prevState => ({
                    ...prevState,
                    [name]: error
                }));
            }
        }
    }

    const resetForm = () => {
        setFormValues(initialState);
        setValidationError({});
    }

    return {
        formValues,
        validationError,
        resetForm,
        handleInputChange,
        handleOnBlurValidation,
        handleSelectorChange
    };
};

export default useFormValidation;

