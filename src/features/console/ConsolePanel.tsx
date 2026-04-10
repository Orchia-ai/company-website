import React, { useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Clear,
  Search,
  Info,
  Warning,
  Error as ErrorIcon,
  CheckCircle,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { useEditorStore, LogMessage } from '../../editor/state/editorStore';

interface LogItemProps {
  message: LogMessage;
}

const LogItem: React.FC<LogItemProps> = ({ message }) => {
  const getIcon = (level: LogMessage['level']) => {
    switch (level) {
      case 'info':
        return <Info fontSize="small" sx={{ color: 'info.main' }} />;
      case 'warning':
        return <Warning fontSize="small" sx={{ color: 'warning.main' }} />;
      case 'error':
        return <ErrorIcon fontSize="small" sx={{ color: 'error.main' }} />;
      case 'success':
        return <CheckCircle fontSize="small" sx={{ color: 'success.main' }} />;
      default:
        return <Info fontSize="small" />;
    }
  };

  const getTimeString = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <ListItem
      dense
      sx={{
        py: 0.5,
        px: 2,
        '&:hover': {
          bgcolor: 'action.hover',
        },
        fontFamily: 'monospace',
        fontSize: '0.875rem',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', gap: 1 }}>
        {getIcon(message.level)}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ minWidth: 70, fontFamily: 'monospace' }}
        >
          {getTimeString(message.timestamp)}
        </Typography>
        {message.source && (
          <Chip
            label={message.source}
            size="small"
            variant="outlined"
            sx={{ height: 20, fontSize: '0.7rem' }}
          />
        )}
        <Typography
          variant="body2"
          sx={{
            flex: 1,
            wordBreak: 'break-word',
            color: message.level === 'error' ? 'error.main' : 'text.primary',
          }}
        >
          {message.message}
        </Typography>
      </Box>
    </ListItem>
  );
};

export const ConsolePanel: React.FC = () => {
  const {
    logs,
    clearLogs,
    addLog,
  } = useEditorStore();
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [levelFilter, setLevelFilter] = React.useState<LogMessage['level'] | 'all'>('all');
  const [autoScroll, setAutoScroll] = React.useState(true);
  const listRef = useRef<HTMLUListElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleClearLogs = () => {
    clearLogs();
    addLog('Console cleared', 'info', 'Console');
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    setAutoScroll(isAtBottom);
  };

  const getLogCount = (level: LogMessage['level']) => {
    return logs.filter((log) => log.level === level).length;
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Console
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Chip
            label={`${getLogCount('error')} Errors`}
            size="small"
            color="error"
            variant="outlined"
            onClick={() => setLevelFilter('error')}
            clickable={levelFilter !== 'error'}
          />
          <Chip
            label={`${getLogCount('warning')} Warnings`}
            size="small"
            color="warning"
            variant="outlined"
            onClick={() => setLevelFilter('warning')}
            clickable={levelFilter !== 'warning'}
          />
          <Chip
            label={`${getLogCount('info')} Info`}
            size="small"
            color="info"
            variant="outlined"
            onClick={() => setLevelFilter('info')}
            clickable={levelFilter !== 'info'}
          />
          <Chip
            label={`${getLogCount('success')} Success`}
            size="small"
            color="success"
            variant="outlined"
            onClick={() => setLevelFilter('success')}
            clickable={levelFilter !== 'success'}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search logs..."
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
            sx={{ flex: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Level</InputLabel>
            <Select
              value={levelFilter}
              label="Level"
              onChange={(e) => setLevelFilter(e.target.value as any)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="error">Error</MenuItem>
              <MenuItem value="warning">Warning</MenuItem>
              <MenuItem value="info">Info</MenuItem>
              <MenuItem value="success">Success</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={handleClearLogs} size="small" title="Clear logs">
            <Clear fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => setAutoScroll(!autoScroll)}
            size="small"
            title={autoScroll ? 'Auto-scroll enabled' : 'Auto-scroll disabled'}
            color={autoScroll ? 'primary' : 'default'}
          >
            {autoScroll ? <KeyboardArrowDown fontSize="small" /> : <KeyboardArrowUp fontSize="small" />}
          </IconButton>
        </Box>
      </Box>

      {/* Log List */}
      <Box
        ref={listRef}
        sx={{
          flex: 1,
          overflow: 'auto',
          bgcolor: '#F7F2FA',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
        }}
        onScroll={handleScroll}
      >
        {filteredLogs.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="grey.500">
              {searchTerm || levelFilter !== 'all'
                ? 'No logs match the filters'
                : 'No logs to display'}
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filteredLogs.map((log) => (
              <LogItem key={log.id} message={log} />
            ))}
            <div ref={endRef} />
          </List>
        )}
      </Box>
    </Box>
  );
};

export default ConsolePanel;
