import { Typeahead } from "react-bootstrap-typeahead";
import { v4 as uuidv4 } from "uuid";



export interface ICountrySelectProps {
    value: string;
    onChange: (value: string) => void;
}

export const CountrySelect = ({ value, onChange }: ICountrySelectProps) => {
    interface ICountry {
        code: string;
        name: string;
    };

    const countries: ICountry[] = [
        { code: 'US', name: 'United States' },
        { code: 'CA', name: 'Canada' },
        { code: 'GB', name: 'United Kingdom' },
        { code: 'AU', name: 'Australia' },
        { code: 'FR', name: 'France' },
        { code: 'DE', name: 'Germany' },
        { code: 'IN', name: 'India' },
        { code: 'JP', name: 'Japan' },
        { code: 'CN', name: 'China' },
        { code: 'BR', name: 'Brazil' },
        // Add more countries as needed
    ];

    const uuid = uuidv4();

    return (
      <Typeahead
        id={`country-select-${uuid}`}
        labelKey={`name`}
        onChange={(selected) => onChange((selected[0] as ICountry)?.code || "")}
        options={countries}
        placeholder="Select a country..."
        selected={countries.filter((country) => country.code.toLocaleLowerCase() === value.toLocaleLowerCase())}
      />
    );
}