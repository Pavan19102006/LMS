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
  TablePagination,
} from '@mui/material';
import { Edit, Delete, Add, Search } from '@mui/icons-material';
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
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'student' as User['role'],
    status: 'active' as User['status'],
  });

  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/users', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: searchTerm,
          role: roleFilter
        }
      });
      setUsers(response.data.users);
      setTotalUsers(response.data.total);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again.');
      
      const mockUsers: User[] = [
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
          email: 'john.smith@lms.com',
          firstName: 'John',
          lastName: 'Smith',
          role: 'instructor',
          status: 'active',
          joinDate: '2025-02-10',
        },
        {
          id: '3',
          email: 'sarah.johnson@lms.com',
          firstName: 'Sarah',
          lastName: 'Johnson',
          role: 'instructor',
          status: 'active',
          joinDate: '2025-02-15',
        },
        {
          id: '4',
          email: 'student1@lms.com',
          firstName: 'Alice',
          lastName: 'Cooper',
          role: 'student',
          status: 'active',
          joinDate: '2025-03-01',
        },
        {
          id: '5',
          email: 'student2@lms.com',
          firstName: 'Bob',
          lastName: 'Wilson',
          role: 'student',
          status: 'inactive',
          joinDate: '2025-03-05',
        },
        {
          id: '6',
          email: 'creator@lms.com',
          firstName: 'Content',
          lastName: 'Creator',
          role: 'content_creator',
          status: 'active',
          joinDate: '2025-03-10',
        },
      ];
      setUsers(mockUsers);
      setTotalUsers(mockUsers.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, searchTerm, roleFilter]);

  
  useEffect(() => {
    const mockUsers: User[] = [
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
        email: 'john.smith@lms.com',
        firstName: 'John',
        lastName: 'Smith',
        role: 'instructor',
        status: 'active',
        joinDate: '2025-02-10',
      },
      {
        id: '3',
        email: 'sarah.johnson@lms.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'instructor',
        status: 'active',
        joinDate: '2025-02-15',
      },
      {
        id: '4',
        email: 'student1@lms.com',
        firstName: 'Alice',
        lastName: 'Cooper',
        role: 'student',
        status: 'active',
        joinDate: '2025-03-01',
      },
      {
        id: '5',
        email: 'student2@lms.com',
        firstName: 'Bob',
        lastName: 'Wilson',
        role: 'student',
        status: 'inactive',
        joinDate: '2025-03-05',
      },
    ];
    
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

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
        password: '',
        role: user.role,
        status: user.status,
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
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
      setError('');
      setSuccess('');
      
      if (editingUser) {
        
        const updateData: any = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          status: formData.status,
        };
        
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        await axios.put(`/users/${editingUser.id}`, updateData);
        setSuccess('User updated successfully!');
      } else {
        
        if (!formData.password) {
          setError('Password is required for new users');
          return;
        }
        
        await axios.post('/users', formData);
        setSuccess('User created successfully!');
      }
      
      handleCloseDialog();
      fetchUsers();
    } catch (err: any) {
      console.error('Error saving user:', err);
      setError(err.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setError('');
        await axios.delete(`/users/${userId}`);
        setSuccess('User deleted successfully!');
        fetchUsers();
      } catch (err: any) {
        console.error('Error deleting user:', err);
        setError(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleRoleFilterChange = (event: any) => {
    setRoleFilter(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
    if (editingUser) {
      
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      ));
    } else {
      
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        joinDate: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUser]);
    }
    handleCloseDialog();
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleInputChange = (field: string) => (event: any) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <Typography>Loading users...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Management
        </Typography>
        
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
            <Button onClick={handleSaveUser} variant="contained">
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default UserManagement;
