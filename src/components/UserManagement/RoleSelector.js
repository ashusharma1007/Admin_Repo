import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  ListItemText, 
  Checkbox,
  OutlinedInput
} from '@mui/material';
import { roles } from '../../data/mockData';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const RoleSelector = ({ selectedRoles, onChange, disabled = false }) => {
  const handleChange = (event) => {
    const { value } = event.target;
    onChange(value);
  };

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel id="role-select-label">Roles</InputLabel>
      <Select
        labelId="role-select-label"
        id="role-select"
        multiple
        value={selectedRoles}
        onChange={handleChange}
        input={<OutlinedInput label="Roles" />}
        renderValue={(selected) => {
          // Get the labels for the selected role names
          const selectedLabels = selected.map(roleName => {
            const role = roles.find(r => r.name === roleName);
            return role ? role.label : roleName;
          });
          return selectedLabels.join(', ');
        }}
        MenuProps={MenuProps}
      >
        {roles.map((role) => (
          <MenuItem key={role.id} value={role.name}>
            <Checkbox checked={selectedRoles.indexOf(role.name) > -1} />
            <ListItemText primary={role.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default RoleSelector;