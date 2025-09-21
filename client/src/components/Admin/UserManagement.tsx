import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Fab,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete, Add, Refresh } from '@mui/icons-material';
import axios from '../../utils/axios';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'instructor' | 'student' | 'content_creator';
  status: 'active' | 'inactive';
  joinDate: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'student' as User['role'],
    status: 'active' as User['status'],
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/users');
      setUsers(response.data.users || response.data || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
      // Fallback to demo data if API fails
      setUsers([
        {
          id: '1',
          email: 'admin@lms.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          status: 'active',
          joinDate: '2025-01-15',
        },
        {
          id: '2',
          email: 'instructor@lms.com',
          firstName: 'John',
          lastName: 'Smith',
          role: 'instructor',
          status: 'active',
          joinDate: '2025-02-10',
        },
        {
          id: '3',
          email: 'student@lms.com',
          firstName: 'Alice',
          lastName: 'Cooper',
          role: 'student',
          status: 'active',
          joinDate: '2025-03-01',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'instructor': return 'primary';
      case 'student': return 'success';
      case 'content_creator': return 'warning';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'default';
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: 'student',
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  const handleSaveUser = async () => {
    try {
      setSaving(true);
      setError('');
      
      if (editingUser) {
        // Update existing user
        const response = await axios.put(`/api/users/${editingUser.id}`, formData);
        setUsers(users.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...formData }
            : user
        ));
      } else {
        // Create new user
        const response = await axios.post('/api/users', formData);
        const newUser: User = {
          id: response.data.user?.id || Date.now().toString(),
          ...formData,
          joinDate: new Date().toISOString().split('T')[0],
        };
        setUsers([...users, newUser]);
      }
      
      handleCloseDialog();
    } catch (err: any) {
      console.error('Error saving user:', err);
      setError(err.response?.data?.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err: any) {
        console.error('Error deleting user:', err);
        setError(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleInputChange = (field: string) => (event: any) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1" gutterBottom>
            User Management
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchUsers}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role.replace('_', ' ')} 
                      color={getRoleColor(user.role) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status} 
                      color={getStatusColor(user.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenDialog(user)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteUser(user.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Fab
          color="primary"
          aria-label="add user"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => handleOpenDialog()}
        >
          <Add />
        </Fab>

        {}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingUser ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                fullWidth
                required
              />
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                fullWidth
                required
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={handleInputChange('role')}
                  label="Role"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="instructor">Instructor</MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="content_creator">Content Creator</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleInputChange('status')}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleSaveUser} 
              variant="contained"
              disabled={saving}
            >
              {saving ? <CircularProgress size={20} /> : (editingUser ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default UserManagement;
