// Function to fetch and display course data
function fetchCourseData() {
    const courseTable = document.querySelector('table tbody');
    
    // Clear existing rows
    courseTable.innerHTML = '';
    
    // Reference to the 'courses' node in the database
    const coursesRef = database.ref('courses');
    
    // Fetch course data from Realtime Database
    coursesRef.once('value')
        .then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const courseId = childSnapshot.key;
                const course = childSnapshot.val();

                const row = document.createElement('tr');

                // Create table row with data
                row.innerHTML = `
                    <td>${courseId}</td>
                    <td>${course.name || ''}</td>
                    <td>${course.description || ''}</td>
                    <td>${course.price || ''}</td>
                    <td>
                        <button onclick="window.open('${course.thumbnailUrl || '#'}', '_blank')" class="view-btn">
                            Thumbnail
                        </button>
                    </td>
                    <td>
                        <button onclick="window.open('${course.videoCoreUrl || '#'}', '_blank')" class="view-btn">
                            Video Core
                        </button>
                    </td>
                    <td>
                        <button onclick="window.open('${course.videoHeaderUrl || '#'}', '_blank')" class="view-btn">
                            Video Header
                        </button>
                    </td>
                    <td>
                        <button class="edit-btn" data-id="${courseId}">Edit</button>
                        <button class="delete-btn" data-id="${courseId}">Delete</button>
                    </td>
                `;

                courseTable.appendChild(row);
            });

            // Add event listeners to delete and edit buttons
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const courseId = e.target.getAttribute('data-id');
                    deleteCourse(courseId);
                });
            });

            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const courseId = e.target.getAttribute('data-id');
                    editCourse(courseId);
                });
            });

        })
        .catch((error) => {
            console.error("Error fetching course data: ", error);
        });
}

// Function to edit a course
function editCourse(courseId) {
    const courseRef = database.ref('courses/' + courseId);

    courseRef.once('value').then((snapshot) => {
        const course = snapshot.val();
        if (!course) return alert('Course not found!');

        // Prompt user for new values
        const newName = prompt("Enter new name:", course.name);
        const newDescription = prompt("Enter new description:", course.description);
        const newPrice = prompt("Enter new price:", course.price);
        const newThumbnail = prompt("Enter new thumbnail URL:", course.thumbnailUrl);
        const newVideoCore = prompt("Enter new Video Core URL:", course.videoCoreUrl);
        const newVideoHeader = prompt("Enter new Video Header URL:", course.videoHeaderUrl);

        // Update data in Firebase
        courseRef.update({
            name: newName,
            description: newDescription,
            price: newPrice,
            thumbnailUrl: newThumbnail,
            videoCoreUrl: newVideoCore,
            videoHeaderUrl: newVideoHeader
        }).then(() => {
            alert("Course updated successfully!");
            fetchCourseData(); // Refresh table
        }).catch((error) => {
            console.error("Error updating course: ", error);
            alert("Failed to update course!");
        });
    });
}

// Function to delete a course
function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        database.ref('courses/' + courseId).remove()
            .then(() => {
                alert('Course deleted successfully');
                fetchCourseData(); // Refresh table
            })
            .catch((error) => {
                console.error("Error deleting course: ", error);
                alert('Failed to delete course');
            });
    }
}

// If you want real-time updates
function setupRealTimeUpdates() {
    const coursesRef = database.ref('courses');

    // Listen for changes
    coursesRef.on('child_added', function() {
        fetchCourseData(); // Refresh the entire table
    });

    coursesRef.on('child_changed', function() {
        fetchCourseData();
    });

    coursesRef.on('child_removed', function() {
        fetchCourseData();
    });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchCourseData();
    // Uncomment the line below if you want real-time updates
    // setupRealTimeUpdates();
});
