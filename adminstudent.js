// admin.js

// Function to fetch and display user data
function fetchUserData() {
    const userTable = document.querySelector('table tbody');
    
    // Clear existing rows
    userTable.innerHTML = '';
    
    // Reference to the 'users' node in the database
    const usersRef = database.ref('users');
    
    // Fetch user data from Realtime Database
    usersRef.once('value')
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const userId = childSnapshot.key;
          const user = childSnapshot.val();
          
          const row = document.createElement('tr');
          
          // Create cells and add data
          row.innerHTML = `
            <td>${userId}</td>
            <td>${user.firstName || ''} ${user.lastName || ''}</td>
            <td>${user.phone || ''}</td>
            <td>${user.email || ''}</td>
            <td>${user.referral || ''}</td>
            <td>${user.city || ''}</td>
            <td>${user.createdAt || ''}</td>
            <td><button class="delete-btn" data-id="${userId}">Delete</button></td>
          `;
          
          userTable.appendChild(row);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
          button.addEventListener('click', (e) => {
            const userId = e.target.getAttribute('data-id');
            deleteUser(userId);
          });
        });
      })
      .catch((error) => {
        console.error("Error fetching user data: ", error);
      });
  }
  
  // Function to delete a user
  function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
      database.ref('users/' + userId).remove()
        .then(() => {
          alert('User deleted successfully');
          fetchUserData(); // Refresh the table
        })
        .catch((error) => {
          console.error("Error deleting user: ", error);
          alert('Failed to delete user');
        });
    }
  }
  
  // If you want real-time updates
  function setupRealTimeUpdates() {
    const usersRef = database.ref('users');
    
    // Listen for changes
    usersRef.on('child_added', function(data) {
      fetchUserData(); // Refresh the entire table
    });
    
    usersRef.on('child_changed', function(data) {
      fetchUserData();
    });
    
    usersRef.on('child_removed', function(data) {
      fetchUserData();
    });
  }
  
  // Call the function when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    fetchUserData();
    // Uncomment the line below if you want real-time updates
    // setupRealTimeUpdates();
  });