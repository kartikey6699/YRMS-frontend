import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserTimeline, updateTimelineEntry } from '../actions/resourceAction';
import { format } from 'date-fns';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';

const TimelineComponent = ({ publicId }) => {
  const dispatch = useDispatch();
  const { timeline, timelineLoading } = useSelector((state) => state.resource);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [editData, setEditData] = useState({
    status: '',
    description: '',
    clientName: '',
    training: []
  });

  React.useEffect(() => {
    if (publicId) {
      dispatch(fetchUserTimeline(publicId));
    }
  }, [publicId, dispatch]);

  const handleEditClick = (entry) => {
    setCurrentEntry(entry);
    setEditData({
      status: entry.status,
      description: entry.description,
      clientName: entry.clientName || '',
      training: entry.training.map(t => t.id)
    });
    setEditModalOpen(true);
  };

  const handleSave = () => {
    dispatch(updateTimelineEntry({
      timelineId: currentEntry.id,
      data: editData
    })).then(() => {
      setEditModalOpen(false);
    });
  };

  const statusOptions = ['pool', 'training', 'bench', 'deployed', 'resigned'];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Resource Timeline
      </Typography>

      {timelineLoading && <Typography>Loading timeline...</Typography>}

      {!timelineLoading && timeline.length === 0 && (
        <Typography>No timeline entries found</Typography>
      )}

      {timeline.map((entry) => (
        <Card key={entry.id} sx={{ mb: 3, boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ 
                color: getStatusColor(entry.status),
                textTransform: 'capitalize'
              }}>
                {entry.status}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {format(new Date(entry.createdAt), 'PPpp')}
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mt: 2 }}>
              {entry.description}
            </Typography>

            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {entry.clientName && (
                <Chip 
                  label={`Client: ${entry.clientName}`} 
                  color="primary" 
                  variant="outlined"
                />
              )}
              {entry.training.length > 0 && entry.training.map((training) => (
                <Chip
                  key={training.id}
                  label={`Training: ${training.name}`}
                  color="secondary"
                  variant="outlined"
                />
              ))}
            </Box>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleEditClick(entry)}
              >
                Edit
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>Edit Timeline Entry</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={editData.status}
              label="Status"
              onChange={(e) => setEditData({...editData, status: e.target.value})}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            value={editData.description}
            onChange={(e) => setEditData({...editData, description: e.target.value})}
            multiline
            rows={3}
            sx={{ mt: 2 }}
          />

          <TextField
            margin="dense"
            label="Client Name"
            fullWidth
            variant="outlined"
            value={editData.clientName}
            onChange={(e) => setEditData({...editData, clientName: e.target.value})}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Helper function for status colors
const getStatusColor = (status) => {
  switch (status) {
    case 'deployed':
      return 'success.main';
    case 'training':
      return 'info.main';
    case 'bench':
      return 'warning.main';
    case 'resigned':
      return 'error.main';
    default:
      return 'text.primary';
  }
};

export default TimelineComponent;