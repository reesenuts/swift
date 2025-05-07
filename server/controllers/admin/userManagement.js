import { getAllUsers as getAllUsersFromDB, deleteUserById, setUserStatus } from '../../models/userModel.js';

//user-management get all user
export const getAllUsers = async (req, res) => {
    try {
      const users = await getAllUsersFromDB(); 
      if (users && Array.isArray(users)) {
        return res.json({ success: true, users }); 
      } else {
        return res.status(404).json({ success: false, message: 'No users found.' });
      }
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
};

// Enable/Disable user
export const toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  if (typeof is_active !== 'boolean') {
    return res.status(400).json({ success: false, message: 'is_active must be a boolean.' });
  }

  try {
    setUserStatus(id, is_active, (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Failed to update status.', error: err.message });
      }
      return res.status(200).json({ success: true, message: `User has been ${is_active ? 'enabled' : 'disabled'}.` });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
      deleteUserById(id, (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Failed to delete user.', error: err.message });
        }
        return res.status(200).json({ success: true, message: 'User deleted successfully.' });
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
};