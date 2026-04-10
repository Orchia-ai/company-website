import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Stack,
  Chip,
  Paper,
} from '@mui/material';
import { useSelectionStore } from '../../editor/state/selectionStore';

interface PropertyFieldProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  type?: 'text' | 'number' | 'boolean' | 'vector3';
  min?: number;
  max?: number;
  step?: number;
}

const PropertyField: React.FC<PropertyFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  min,
  max,
  step = 1,
}) => {
  const renderField = () => {
    switch (type) {
      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                size="small"
              />
            }
            label={label}
          />
        );
      
      case 'number':
        return (
          <TextField
            fullWidth
            label={label}
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            size="small"
            slotProps={{
              htmlInput: { min, max, step },
            }}
          />
        );
      
      case 'vector3':
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {label}
            </Typography>
            <Stack direction="row" spacing={1}>
              {['X', 'Y', 'Z'].map((axis, index) => (
                <TextField
                  key={axis}
                  label={axis}
                  type="number"
                  value={value[index]}
                  onChange={(e) => {
                    const newValue = [...value] as [number, number, number];
                    newValue[index] = Number(e.target.value);
                    onChange(newValue);
                  }}
                  size="small"
                  slotProps={{
              htmlInput: { step: 0.1 },
            }}
                  sx={{ flex: 1 }}
                />
              ))}
            </Stack>
          </Box>
        );
      
      default:
        return (
          <TextField
            fullWidth
            label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            size="small"
          />
        );
    }
  };

  return <Box sx={{ mb: 2 }}>{renderField()}</Box>;
};

export const InspectorPanel: React.FC = () => {
  const { selectedIds, sceneObjects, updateSceneObject } = useSelectionStore();
  
  const selectedObjects = Array.from(selectedIds)
    .map((id) => sceneObjects.get(id))
    .filter((obj): obj is Exclude<typeof obj, undefined> => obj !== undefined);

  const updateProperty = (objectId: string, property: string, value: any) => {
    updateSceneObject(objectId, { [property]: value });
  };

  if (selectedObjects.length === 0) {
    return (
      <Box sx={{ height: '100%', p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Inspector
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            textAlign: 'center',
            bgcolor: 'grey.50',
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Select an object to view its properties
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (selectedObjects.length > 1) {
    return (
      <Box sx={{ height: '100%', p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Inspector
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            textAlign: 'center',
            bgcolor: 'grey.50',
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Multiple objects selected
          </Typography>
          <Chip
            label={`${selectedObjects.length} objects`}
            size="small"
            color="primary"
          />
        </Paper>
      </Box>
    );
  }

  const object = selectedObjects[0];

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Inspector
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Type:
          </Typography>
          <Chip
            label={object.type}
            size="small"
            variant="outlined"
            color="primary"
          />
        </Box>
      </Box>

      {/* Properties */}
      <Box sx={{ p: 2 }}>
        {/* Basic Properties */}
        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
          <Typography variant="subtitle2" gutterBottom>
            Basic Properties
          </Typography>
          <PropertyField
            label="Name"
            value={object.name}
            onChange={(value) => updateProperty(object.id, 'name', value)}
          />
          <PropertyField
            label="Visible"
            value={object.visible}
            onChange={(value) => updateProperty(object.id, 'visible', value)}
            type="boolean"
          />
        </Paper>

        {/* Transform */}
        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
          <Typography variant="subtitle2" gutterBottom>
            Transform
          </Typography>
          <PropertyField
            label="Position"
            value={object.position || [0, 0, 0]}
            onChange={(value) => updateProperty(object.id, 'position', value)}
            type="vector3"
          />
          <PropertyField
            label="Rotation"
            value={object.rotation || [0, 0, 0]}
            onChange={(value) => updateProperty(object.id, 'rotation', value)}
            type="vector3"
          />
          <PropertyField
            label="Scale"
            value={object.scale || [1, 1, 1]}
            onChange={(value) => updateProperty(object.id, 'scale', value)}
            type="vector3"
          />
        </Paper>

        {/* Object ID */}
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Typography variant="subtitle2" gutterBottom>
            Information
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {object.id}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default InspectorPanel;
