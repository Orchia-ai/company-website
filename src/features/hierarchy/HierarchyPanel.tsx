import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Collapse,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Search,
  Visibility,
  VisibilityOff,
  Add,
  Delete,
} from '@mui/icons-material';
import { useSelectionStore, SceneObject } from '../../editor/state/selectionStore';

interface HierarchyItemProps {
  object: SceneObject;
  level: number;
  onSelect: (id: string, multi?: boolean) => void;
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
}

const HierarchyItem: React.FC<HierarchyItemProps> = ({
  object,
  level,
  onSelect,
  onToggleVisibility,
  onDelete,
}) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = object.children && object.children.length > 0;
  const childObjects = useSelectionStore((state) =>
    object.children?.map((id) => state.sceneObjects.get(id)).filter(Boolean) as SceneObject[]
  );

  const getItemIcon = (type: SceneObject['type']) => {
    switch (type) {
      case 'robot':
        return '🤖';
      case 'object':
        return '📦';
      case 'light':
        return '💡';
      case 'camera':
        return '📷';
      default:
        return '📍';
    }
  };

  return (
    <>
      <ListItem
        disablePadding
        sx={{
          pl: 2 + level * 2,
          bgcolor: object.selected ? 'action.selected' : 'transparent',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
        secondaryAction={
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(object.id);
              }}
              sx={{ opacity: object.visible ? 1 : 0.5 }}
            >
              {object.visible ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(object.id);
              }}
              sx={{ '&:hover': { color: 'error.main' } }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        }
      >
        <ListItemButton
          onClick={() => onSelect(object.id)}
          dense
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            {hasChildren ? (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
              >
                {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              </IconButton>
            ) : (
              <Box sx={{ width: 24 }} />
            )}
            <Typography sx={{ fontSize: 18, ml: 0.5 }}>
              {getItemIcon(object.type)}
            </Typography>
          </ListItemIcon>
          <ListItemText
            primary={object.name}
            sx={{
              '& .MuiListItemText-primary': {
                fontWeight: object.selected ? 600 : 400,
              },
            }}
          />
        </ListItemButton>
      </ListItem>
      {hasChildren && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {childObjects.map((child) => (
              <HierarchyItem
                key={child.id}
                object={child}
                level={level + 1}
                onSelect={onSelect}
                onToggleVisibility={onToggleVisibility}
                onDelete={onDelete}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export const HierarchyPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    sceneObjects,
    select,
    deselectAll,
    updateSceneObject,
    removeSceneObject,
    getSceneHierarchy,
  } = useSelectionStore();

  const hierarchy = getSceneHierarchy();
  
  const filteredHierarchy = hierarchy.filter((obj) =>
    obj.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (id: string, multi = false) => {
    if (!multi) {
      deselectAll();
    }
    select(id, multi);
  };

  const handleToggleVisibility = (id: string) => {
    const obj = sceneObjects.get(id);
    if (obj) {
      updateSceneObject(id, { visible: !obj.visible });
    }
  };

  const handleDelete = (id: string) => {
    removeSceneObject(id);
  };

  const handleAddObject = () => {
    const newObject: SceneObject = {
      id: `object-${Date.now()}`,
      name: `New Object ${sceneObjects.size + 1}`,
      type: 'object',
      visible: true,
      selected: false,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    };
    useSelectionStore.getState().addSceneObject(newObject);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Hierarchy
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Search objects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 1 }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label="Add Object"
            icon={<Add fontSize="small" />}
            onClick={handleAddObject}
            clickable
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`${sceneObjects.size} objects`}
            size="small"
            variant="filled"
            color="default"
          />
        </Box>
      </Box>

      {/* Tree View */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {filteredHierarchy.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'No objects found' : 'No objects in scene'}
            </Typography>
          </Box>
        ) : (
          <List component="nav" disablePadding>
            {filteredHierarchy.map((obj) => (
              <HierarchyItem
                key={obj.id}
                object={obj}
                level={0}
                onSelect={handleSelect}
                onToggleVisibility={handleToggleVisibility}
                onDelete={handleDelete}
              />
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default HierarchyPanel;
