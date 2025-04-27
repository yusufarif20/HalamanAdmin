// Function to fetch and display user data
function fetchUserData() {
    const userTable = document.querySelector('table tbody');
    const userContainer = document.querySelector('.user-container'); // Tempat untuk menambah tombol
    
    // Clear existing rows
    userTable.innerHTML = '';
    
    // Reference to the 'users' node in the database
    const usersRef = database.ref('users');
    
    // Fetch user data from Realtime Database
    usersRef.once('value')
      .then((snapshot) => {
        let userCount = 0;

        snapshot.forEach((childSnapshot) => {
          userCount++;
          const userId = childSnapshot.key;
          const user = childSnapshot.val();
          
          const row = document.createElement('tr');
          
          // Create cells and add data
          if (userCount <= 5) {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${userId}</td>
              <td>${user.firstName || ''} ${user.lastName || ''}</td>
              <td>${user.phone || ''}</td>
              <td>${user.email || ''}</td>
              <td>${user.referral || ''}</td>
              <td>${user.city || ''}</td>
              <td><button class="delete-btn" data-id="${userId}">Delete</button></td>
            `;
            userTable.appendChild(row);
          }
        });

        // Tambahkan tombol jika user lebih dari 5
        let existingButton = document.querySelector('.go-to-student-btn');
        if (userCount > 5 && !existingButton) {
            const button = document.createElement('button');
            button.textContent = "Go to Student Page";
            button.classList.add('go-to-student-btn');
            button.onclick = () => {
                window.location.href = "adminstudent.html";
            };
            userContainer.appendChild(button);
        }
        
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
    usersRef.on('child_added', function() {
        fetchUserData(); // Refresh the entire table
    });

    usersRef.on('child_changed', function() {
        fetchUserData();
    });

    usersRef.on('child_removed', function() {
        fetchUserData();
    });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchUserData();
    // Uncomment the line below if you want real-time updates
    // setupRealTimeUpdates();
});
