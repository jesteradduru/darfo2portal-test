import Select from "react-select";
import styled from "styled-components";

export const StyledSelect = styled(Select)`
    .select__control{
        min-width: 300px
    }
    @media only screen and (max-width:430px){
        .select__control{
            min-width: 230px !important
        }
    }
`