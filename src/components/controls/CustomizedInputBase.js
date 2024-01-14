import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import Input from './Input';

export default function CustomizedInputBase(props) {
    const { name, label, value,error=null, onChange, onSearchClick, ...other } = props;

    return (
        <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}
        >
            <Input
                label={label}
                name={name}
                value={value}
                onChange={onChange}
                
                {...other}
                {...(error && {error:true,helperText:error})}
            />
        
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search"
        onClick={onSearchClick}>
            <SearchIcon />
        </IconButton>
        </Paper>
    );
}

/*
<InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Google Maps"
        inputProps={{ 'aria-label': 'search google maps' }}
      />
*/