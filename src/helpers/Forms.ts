/* eslint-disable @typescript-eslint/no-explicit-any */
export const processFormDataChangeEvent = <T>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, objectForForm: T, setFormData: React.Dispatch<React.SetStateAction<T>>) => {
    const { name, value } = event.target;
    const isBoolean = getPropertyType(objectForForm, name) === 'boolean';
    const parsedValue = isBoolean ? stringToBool(value) : value;

    setFormData((prevFormData) => {
        if (!prevFormData) return prevFormData;
        const updatedFormData = { ...prevFormData };
        return setNestedProperty(updatedFormData, name, parsedValue);
    });
}

export const stringToBool = (value: string): boolean => {
    return value.toLowerCase() === 'true';
};

const getPropertyType = <T>(obj: T, key: string): any => {
    return typeof(obj[key as keyof T]);
}

const setNestedProperty = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const arrayIndexMatch = key.match(/^(.+)\[(\d+)\]$/);

        if (arrayIndexMatch) {
            const arrayKey = arrayIndexMatch[1];
            const index = parseInt(arrayIndexMatch[2], 10);

            if (!current[arrayKey]) {
                current[arrayKey] = [];
            }

            if (!current[arrayKey][index]) {
                current[arrayKey][index] = {};
            }

            current = current[arrayKey][index];
        } else {
            if (!current[key]) {
                current[key] = {};
            }

            current = current[key];
        }
    }

    const lastKey = keys[keys.length - 1];
    const lastArrayIndexMatch = lastKey.match(/^(.+)\[(\d+)\]$/);

    if (lastArrayIndexMatch) {
        const arrayKey = lastArrayIndexMatch[1];
        const index = parseInt(lastArrayIndexMatch[2], 10);

        if (!current[arrayKey]) {
            current[arrayKey] = [];
        }

        current[arrayKey][index] = value;
    } else {
        current[lastKey] = value;
    }

    return obj;
};