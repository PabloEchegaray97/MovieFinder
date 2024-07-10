
import React from 'react';
import { styled } from '@mui/material/styles';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import FormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

interface StyledFormControlLabelProps extends FormControlLabelProps {
    checked: boolean;
}

const StyledFormControlLabel = styled((props: StyledFormControlLabelProps) => (
    <FormControlLabel {...props} />
))(({ theme, checked }) => ({
    '.MuiFormControlLabel-label': checked && {
        color: theme.palette.primary.main,
    },
}));

function MyFormControlLabel(props: FormControlLabelProps) {
    const radioGroup = useRadioGroup();
    let checked = false;

    if (radioGroup) {
        checked = radioGroup.value === props.value;
    }

    return <StyledFormControlLabel checked={checked} {...props} />;
}

interface SearchToggleProps {
    searchType: string;
    setSearchType: (type: string) => void;
}

const SearchToggle: React.FC<SearchToggleProps> = ({ searchType, setSearchType }) => {
    return (
        <RadioGroup
            name="search-type"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            row
        >
            <MyFormControlLabel value="movie" label="Películas" control={<Radio />} />
            <MyFormControlLabel value="actor" label="Actores" control={<Radio />} />
        </RadioGroup>
    );
};

export default SearchToggle;
