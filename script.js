// Global Variables
let currentUser = null;
let currentStudent = null;
let volunteerApplications = [];
let events = [];
let studentNotifications = [];

// Sample Events Data
const sampleEvents = [
    {
        id: 1,
        name: "Annual Tech Fest 2025",
        date: "2025-03-15",
        time: "09:00 AM - 06:00 PM",
        description: "Join us for the biggest technology festival of the year! Help manage booths, assist participants, and coordinate activities.",
        category: "Technical",
        volunteersNeeded: 20,
        isUpcoming: true
    },
    {
        id: 2,
        name: "Cultural Night",
        date: "2025-02-28",
        time: "06:00 PM - 10:00 PM",
        description: "Experience diverse cultures through performances, food, and art. Volunteers needed for stage management and guest coordination.",
        category: "Cultural",
        volunteersNeeded: 15,
        isUpcoming: true
    },
    {
        id: 3,
        name: "Career Fair 2025",
        date: "2025-04-10",
        time: "10:00 AM - 04:00 PM",
        description: "Connect students with potential employers. Assist with booth setup, registration, and information dissemination.",
        category: "Career",
        volunteersNeeded: 25,
        isUpcoming: true
    },
    {
        id: 4,
        name: "Green Campus Initiative",
        date: "2025-03-22",
        time: "08:00 AM - 12:00 PM",
        description: "Help make our campus more environmentally friendly through tree planting and awareness campaigns.",
        category: "Environment",
        volunteersNeeded: 30,
        isUpcoming: true
    },
    {
        id: 5,
        name: "Sports Tournament",
        date: "2025-02-15",
        time: "07:00 AM - 06:00 PM",
        description: "Annual inter-college sports competition. Volunteers needed for event coordination, crowd management, and athlete assistance.",
        category: "Sports",
        volunteersNeeded: 18,
        isUpcoming: true
    },
    {
        id: 6,
        name: "Orientation Week",
        date: "2025-08-20",
        time: "09:00 AM - 05:00 PM",
        description: "Welcome new students to campus life. Help with registration, campus tours, and information sessions.",
        category: "Academic",
        volunteersNeeded: 40,
        isUpcoming: true
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
    loadApplications();
    loadStudentNotifications();
    checkLoginStatus();
    initializePage();
});

// Load events from localStorage or use sample data
function loadEvents() {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
        events = JSON.parse(storedEvents);
    } else {
        events = sampleEvents;
        localStorage.setItem('events', JSON.stringify(events));
    }
}

// Load applications from localStorage
function loadApplications() {
    const storedApplications = localStorage.getItem('volunteerApplications');
    if (storedApplications) {
        volunteerApplications = JSON.parse(storedApplications);
    }
}

// Load student notifications from localStorage
function loadStudentNotifications() {
    const storedNotifications = localStorage.getItem('studentNotifications');
    if (storedNotifications) {
        studentNotifications = JSON.parse(storedNotifications);
    }
}

// Save applications to localStorage
function saveApplications() {
    localStorage.setItem('volunteerApplications', JSON.stringify(volunteerApplications));
}

// Save events to localStorage
function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

// Check if user is logged in
function checkLoginStatus() {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
        currentUser = JSON.parse(loggedInUser);
    }
    
    const loggedInStudent = localStorage.getItem('currentStudent');
    if (loggedInStudent) {
        currentStudent = JSON.parse(loggedInStudent);
    }
    
    // Redirect to login if trying to access admin panel without authentication
    if (window.location.pathname.includes('admin.html') && !currentUser) {
        window.location.href = 'login.html';
    }
}

// Initialize page-specific functionality
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'index.html':
        case '':
            loadUpcomingEvents();
            break;
        case 'events.html':
            loadAllEvents();
            setupVolunteerForm();
            break;
        case 'login.html':
            setupLoginForm();
            break;
        case 'admin.html':
            if (currentUser) {
                loadAdminDashboard();
                updateAddEventForm();
            }
            break;
        case 'student-portal.html':
            setupStudentPortal();
            break;
    }
    
    // Check for notifications
    checkNotifications();
}

// Load upcoming events for home page
function loadUpcomingEvents() {
    const upcomingEventsGrid = document.getElementById('upcomingEventsGrid');
    if (!upcomingEventsGrid) return;
    
    const upcomingEvents = events.filter(event => event.isUpcoming).slice(0, 3);
    
    if (upcomingEvents.length === 0) {
        upcomingEventsGrid.innerHTML = '<p class="no-events">No upcoming events available.</p>';
        return;
    }
    
    upcomingEventsGrid.innerHTML = upcomingEvents.map(event => {
        const volunteerStats = getVolunteerStats(event.id);
        const isFull = volunteerStats.remaining === 0;
        
        return `
        <div class="event-card-advanced">
            <div class="event-card-header">
                <div class="event-date-badge-large">${formatDate(event.date)}</div>
                <div class="event-category-tag-advanced">${event.category}</div>
            </div>
            
            <div class="event-card-content">
                <h3 class="event-title-advanced">${event.name}</h3>
                <p class="event-time-advanced">🕒 ${event.time}</p>
                <p class="event-description-advanced">${event.description}</p>
            </div>
            
            <div class="volunteer-section-advanced">
                <div class="volunteer-stats-row">
                    ${isFull ? 
                        '<div class="volunteer-full-status">🚫 All Positions Filled</div>' :
                        `
                        <div class="volunteer-stat-item">
                            <span class="stat-number">${volunteerStats.selected}</span>
                            <span class="stat-label">Selected</span>
                        </div>
                        <div class="volunteer-stat-item">
                            <span class="stat-number">${volunteerStats.remaining}</span>
                            <span class="stat-label">Available</span>
                        </div>
                        <div class="volunteer-stat-item">
                            <span class="stat-number">${volunteerStats.total}</span>
                            <span class="stat-label">Total Needed</span>
                        </div>
                        `
                    }
                </div>
            </div>
            
            <div class="event-card-footer">
                <a href="events.html" class="btn-card ${isFull ? 'btn-disabled-card' : 'btn-primary-card'}">
                    ${isFull ? '❌ Positions Full' : '🚀 Apply Now'}
                </a>
            </div>
        </div>
        `;
    }).join('');
}

// Load all events for events page
function loadAllEvents() {
    const allEventsGrid = document.getElementById('allEventsGrid');
    if (!allEventsGrid) return;
    
    if (events.length === 0) {
        allEventsGrid.innerHTML = '<p class="no-events">No events available.</p>';
        return;
    }
    
    allEventsGrid.innerHTML = events.map(event => {
        const volunteerStats = getVolunteerStats(event.id);
        const isFull = volunteerStats.remaining === 0;
        
        return `
        <div class="event-card">
            <div class="event-header">
                <div class="event-info">
                    <h3 class="event-title">${event.name}</h3>
                    <p class="event-time">${event.time}</p>
                </div>
                <div class="event-date-badge">${formatDate(event.date)}</div>
            </div>
            
            <div class="event-body">
                <p class="event-description">${event.description}</p>
            </div>
            
            <div class="volunteer-section">
                <div class="volunteer-counts">
                    ${isFull ? 
                        '<div class="volunteer-full-banner">🚫 VOLUNTEER POSITIONS FULL</div>' :
                        `
                        <div class="volunteer-count-item selected">
                            <span class="count-icon">👥</span>
                            <span class="count-number">${volunteerStats.selected}</span>
                            <span class="count-label">selected</span>
                        </div>
                        <div class="volunteer-count-item remaining">
                            <span class="count-icon">📋</span>
                            <span class="count-number">${volunteerStats.remaining}</span>
                            <span class="count-label">remaining</span>
                        </div>
                        `
                    }
                </div>
            </div>
            
            <div class="event-footer">
                <div class="event-category-tag">${event.category}</div>
                <button class="btn ${isFull ? 'btn-disabled' : 'btn-primary'}" 
                        onclick="${isFull ? '' : `openVolunteerModal(${event.id})`}" 
                        ${isFull ? 'disabled' : ''}>
                    ${isFull ? 'Positions Full' : 'Request to Volunteer'}
                </button>
            </div>
        </div>
        `;
    }).join('');
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
}

// Open volunteer application modal
function openVolunteerModal(eventId) {
    const modal = document.getElementById('volunteerModal');
    const eventIdInput = document.getElementById('eventId');
    
    if (modal && eventIdInput) {
        eventIdInput.value = eventId;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('volunteerModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Reset form
        const form = document.getElementById('volunteerForm');
        if (form) {
            form.reset();
        }
    }
}

// Setup volunteer form submission
function setupVolunteerForm() {
    const form = document.getElementById('volunteerForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const eventId = parseInt(formData.get('eventId'));
        const event = events.find(e => e.id === eventId);
        
        if (!event) {
            showNotification('Event not found!', 'error');
            return;
        }
        
        // Check if event is full
        const volunteerStats = getVolunteerStats(eventId);
        if (volunteerStats.isFull) {
            showNotification('Sorry, all volunteer positions for this event are already filled!', 'warning');
            closeModal();
            return;
        }
        
        // Create application object
        const application = {
            id: Date.now(),
            eventId: eventId,
            eventName: event.name,
            name: formData.get('name'),
            rollNo: formData.get('rollNo'),
            department: formData.get('department'),
            email: formData.get('email'),
            skills: formData.get('skills') || 'Not specified',
            availability: formData.get('availability'),
            motivation: formData.get('motivation') || 'Not specified',
            status: 'Pending',
            appliedDate: new Date().toISOString(),
            studentNotified: false
        };
        
        // Check if already applied
        const existingApplication = volunteerApplications.filter(
            app => app.email === application.email && app.eventId === eventId
        );
        
        if (existingApplication.length > 0) {
            showNotification('You have already applied for this event!', 'warning');
            return;
        }
        
        // Add to applications
        volunteerApplications.push(application);
        saveApplications();
        
        // Refresh event displays to update volunteer counts
        loadAllEvents();
        loadUpcomingEvents();
        loadEventsManagement();
        
        // Close modal and show success message
        closeModal();
        showNotification('Your volunteer request has been submitted successfully!', 'success');
        
        // Log to console (simulating backend)
        console.log('New Volunteer Application:', application);
    });
}

// Setup login form
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple validation (demo purposes)
        if (username === 'admin' && password === 'admin123') {
            currentUser = {
                username: username,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showNotification('Login successful! Redirecting to admin panel...', 'success');
            
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
        } else {
            showNotification('Invalid username or password!', 'error');
        }
    });
}

// Load admin dashboard
function loadAdminDashboard() {
    updateStatistics();
    loadApplicationsTable();
    loadEventsManagement();
    // Default to events tab
    showTab('events');
}

// Show tab function for admin dashboard
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }
    
    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // Fallback for default tab
        const defaultButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
        if (defaultButton) {
            defaultButton.classList.add('active');
        }
    }
    
    // Update statistics for applications tab
    if (tabName === 'applications') {
        updateApplicationTabStatistics();
        // Small delay to ensure content is visible before loading
        setTimeout(() => {
            loadApplicationsTable();
        }, 100);
    } else if (tabName === 'events') {
        // Reload events when switching to events tab
        setTimeout(() => {
            loadEventsManagement();
        }, 100);
    }
}

// Update statistics for applications tab
function updateApplicationTabStatistics() {
    const totalElement = document.getElementById('totalApplicationsTab');
    const pendingElement = document.getElementById('pendingApplicationsTab');
    const approvedElement = document.getElementById('approvedApplicationsTab');
    const rejectedElement = document.getElementById('rejectedApplicationsTab');
    
    if (!totalElement) return;
    
    const stats = {
        total: volunteerApplications.length,
        pending: volunteerApplications.filter(app => app.status === 'Pending').length,
        approved: volunteerApplications.filter(app => app.status === 'Approved').length,
        rejected: volunteerApplications.filter(app => app.status === 'Rejected').length
    };
    
    totalElement.textContent = stats.total;
    pendingElement.textContent = stats.pending;
    approvedElement.textContent = stats.approved;
    rejectedElement.textContent = stats.rejected;
}

// Update dashboard statistics
function updateStatistics() {
    const totalElement = document.getElementById('totalApplications');
    const pendingElement = document.getElementById('pendingApplications');
    const approvedElement = document.getElementById('approvedApplications');
    const rejectedElement = document.getElementById('rejectedApplications');
    
    if (!totalElement) return;
    
    const stats = {
        total: volunteerApplications.length,
        pending: volunteerApplications.filter(app => app.status === 'Pending').length,
        approved: volunteerApplications.filter(app => app.status === 'Approved').length,
        rejected: volunteerApplications.filter(app => app.status === 'Rejected').length
    };
    
    totalElement.textContent = stats.total;
    pendingElement.textContent = stats.pending;
    approvedElement.textContent = stats.approved;
    rejectedElement.textContent = stats.rejected;
}

// Load applications table
function loadApplicationsTable() {
    const tableBody = document.getElementById('applicationsTableBody');
    const noDataMessage = document.getElementById('noApplicationsMessage');
    
    if (!tableBody) return;
    
    if (volunteerApplications.length === 0) {
        tableBody.innerHTML = '';
        if (noDataMessage) {
            noDataMessage.style.display = 'block';
        }
        return;
    }
    
    if (noDataMessage) {
        noDataMessage.style.display = 'none';
    }
    
    tableBody.innerHTML = volunteerApplications.map(app => `
        <tr>
            <td>#${app.id}</td>
            <td>${app.name}</td>
            <td>${app.rollNo}</td>
            <td>${app.department}</td>
            <td>${app.email}</td>
            <td>${app.eventName}</td>
            <td><span class="status-badge status-${app.status.toLowerCase()}">${app.status}</span></td>
            <td>${formatDate(app.appliedDate.split('T')[0])}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-secondary" onclick="viewApplication(${app.id})">📄 Details</button>
                    ${app.status === 'Pending' ? `
                        <button class="btn btn-sm btn-success" onclick="approveApplication(${app.id})">✅ Approve</button>
                        <button class="btn btn-sm btn-danger" onclick="rejectApplication(${app.id})">❌ Reject</button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// ===== EVENT MANAGEMENT FUNCTIONS =====

// Load events management for admin
function loadEventsManagement() {
    const eventsGrid = document.getElementById('eventsAdminGrid');
    if (!eventsGrid) return;
    
    if (events.length === 0) {
        eventsGrid.innerHTML = '<p class="no-events">No events created yet. Click "Add Event" to create your first event.</p>';
        return;
    }
    
    eventsGrid.innerHTML = events.map(event => {
        const volunteerStats = getVolunteerStats(event.id);
        return `
        <div class="event-admin-card">
            <div class="event-admin-header">
                <div>
                    <div class="event-admin-title">${event.name}</div>
                    <div class="event-admin-details">
                        <p><strong>📅 Date:</strong> ${formatDate(event.date)}</p>
                        <p><strong>🕒 Time:</strong> ${event.time}</p>
                        <p><strong>📍 Category:</strong> ${event.category}</p>
                        <p><strong>👥 Volunteers Needed:</strong> ${event.volunteersNeeded}</p>
                        <p><strong>📊 Volunteer Status:</strong> 
                            ${volunteerStats.isFull ? 
                                '<span class="volunteer-full">🎯 FULL</span>' :
                                `<span class="volunteer-progress">${volunteerStats.selected}/${volunteerStats.total} (${volunteerStats.remaining} remaining)</span>`
                            }
                        </p>
                    </div>
                </div>
                <div class="event-admin-date">
                    <span class="${event.isUpcoming ? 'event-status-active' : 'event-status-inactive'}">
                        ${event.isUpcoming ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
            <div class="event-admin-description">${event.description}</div>
            <div class="event-admin-footer">
                <div class="event-admin-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editEvent(${event.id})">✏️ Edit</button>
                    <button class="btn btn-sm ${event.isUpcoming ? 'btn-danger' : 'btn-success'}" 
                            onclick="toggleEventStatus(${event.id})">
                        ${event.isUpcoming ? '❌ Deactivate' : '✅ Activate'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEvent(${event.id})">🗑️ Delete</button>
                </div>
                <div class="volunteers-count">
                    <small>${getEventApplicationsCount(event.id)} applications</small>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// Get applications count for an event
function getEventApplicationsCount(eventId) {
    return volunteerApplications.filter(app => app.eventId === eventId).length;
}

// Get volunteer statistics for an event
function getVolunteerStats(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return { selected: 0, remaining: 0, total: 0, isFull: false };
    
    const selectedVolunteers = volunteerApplications.filter(
        app => app.eventId === eventId && app.status === 'Approved'
    ).length;
    
    const totalNeeded = event.volunteersNeeded;
    const remaining = Math.max(0, totalNeeded - selectedVolunteers);
    const isFull = selectedVolunteers >= totalNeeded;
    
    return {
        selected: selectedVolunteers,
        remaining: remaining,
        total: totalNeeded,
        isFull: isFull
    };
}

// Open add event modal
function openAddEventModal() {
    const modal = document.getElementById('addEventModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('eventDate');
        if (dateInput) dateInput.min = today;
    }
}

// Close add event modal
function closeAddEventModal() {
    const modal = document.getElementById('addEventModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset form
        const form = document.getElementById('addEventForm');
        if (form) form.reset();
    }
}

// Setup add event form
function setupAddEventForm() {
    const form = document.getElementById('addEventForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        
        // Create new event
        const newEvent = {
            id: Date.now(), // Simple ID generation
            name: formData.get('eventName'),
            date: formData.get('eventDate'),
            time: formData.get('eventTime'),
            description: formData.get('eventDescription'),
            category: formData.get('eventCategory'),
            volunteersNeeded: parseInt(formData.get('volunteersNeeded')),
            isUpcoming: formData.get('eventStatus') === 'true'
        };
        
        // Add to events array
        events.push(newEvent);
        saveEvents();
        
        // Refresh events management
        loadEventsManagement();
        
        // Update events page if it exists
        loadAllEvents();
        loadUpcomingEvents();
        
        // Close modal and show success
        closeAddEventModal();
        showNotification(`Event "${newEvent.name}" has been created successfully!`, 'success');
        
        console.log('New Event Created:', newEvent);
    });
}

// Edit event function
function editEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    // Fill form with existing data
    document.getElementById('eventName').value = event.name;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventTime').value = event.time;
    document.getElementById('eventDescription').value = event.description;
    document.getElementById('eventCategory').value = event.category;
    document.getElementById('volunteersNeeded').value = event.volunteersNeeded;
    document.getElementById('eventStatus').value = event.isUpcoming.toString();
    
    // Change form to edit mode
    const form = document.getElementById('addEventForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Update Event';
    
    // Store event ID for update
    form.dataset.editingId = eventId;
    
    openAddEventModal();
}

// Toggle event status (active/inactive)
function toggleEventStatus(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    event.isUpcoming = !event.isUpcoming;
    saveEvents();
    loadEventsManagement();
    loadAllEvents();
    loadUpcomingEvents();
    
    const status = event.isUpcoming ? 'activated' : 'deactivated';
    showNotification(`Event "${event.name}" has been ${status}.`, 'success');
}

// Delete event
function deleteEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    if (confirm(`Are you sure you want to delete the event "${event.name}"? This will also remove all related applications.`)) {
        // Remove event
        events = events.filter(e => e.id !== eventId);
        saveEvents();
        
        // Remove related applications
        volunteerApplications = volunteerApplications.filter(app => app.eventId !== eventId);
        saveApplications();
        
        // Refresh displays
        loadEventsManagement();
        loadApplicationsTable();
        updateStatistics();
        loadAllEvents();
        loadUpcomingEvents();
        
        showNotification(`Event "${event.name}" and all related applications have been deleted.`, 'warning');
    }
}

// Update form submission to handle both create and edit
function updateAddEventForm() {
    const form = document.getElementById('addEventForm');
    if (!form) return;
    
    form.removeEventListener('submit', arguments.callee); // Remove existing listener
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const editingId = form.dataset.editingId;
        
        if (editingId) {
            // Edit existing event
            const event = events.find(e => e.id === parseInt(editingId));
            if (event) {
                event.name = formData.get('eventName');
                event.date = formData.get('eventDate');
                event.time = formData.get('eventTime');
                event.description = formData.get('eventDescription');
                event.category = formData.get('eventCategory');
                event.volunteersNeeded = parseInt(formData.get('volunteersNeeded'));
                event.isUpcoming = formData.get('eventStatus') === 'true';
                
                saveEvents();
                showNotification(`Event "${event.name}" has been updated successfully!`, 'success');
            }
            
            // Reset form
            delete form.dataset.editingId;
            form.querySelector('button[type="submit"]').textContent = 'Create Event';
        } else {
            // Create new event
            const newEvent = {
                id: Date.now(),
                name: formData.get('eventName'),
                date: formData.get('eventDate'),
                time: formData.get('eventTime'),
                description: formData.get('eventDescription'),
                category: formData.get('eventCategory'),
                volunteersNeeded: parseInt(formData.get('volunteersNeeded')),
                isUpcoming: formData.get('eventStatus') === 'true'
            };
            
            events.push(newEvent);
            saveEvents();
            showNotification(`Event "${newEvent.name}" has been created successfully!`, 'success');
        }
        
        // Refresh all displays
        loadEventsManagement();
        loadAllEvents();
        loadUpcomingEvents();
        closeAddEventModal();
    });
}

// ===== END EVENT MANAGEMENT FUNCTIONS =====

// View application details
function viewApplication(applicationId) {
    console.log('Viewing application with ID:', applicationId);
    
    const application = volunteerApplications.find(app => app.id === applicationId);
    if (!application) {
        console.error('Application not found:', applicationId);
        showNotification('Application not found!', 'error');
        return;
    }
    
    console.log('Found application:', application);
    
    const modal = document.getElementById('applicationModal');
    const detailsContainer = document.getElementById('applicationDetails');
    
    if (!modal) {
        console.error('Application modal not found');
        showNotification('Modal not found!', 'error');
        return;
    }
    
    if (!detailsContainer) {
        console.error('Application details container not found');
        showNotification('Details container not found!', 'error');
        return;
    }
    
    detailsContainer.innerHTML = `
        <div class="application-details modal-details">
            <div class="detail-group">
                <h3>📋 Personal Information</h3>
                <p><strong>Name:</strong> ${application.name}</p>
                <p><strong>Roll Number:</strong> ${application.rollNo}</p>
                <p><strong>Department:</strong> ${application.department}</p>
                <p><strong>Email:</strong> ${application.email}</p>
            </div>
            
            <div class="detail-group">
                <h3>🎯 Event Information</h3>
                <p><strong>Event:</strong> ${application.eventName}</p>
                <p><strong>Applied Date:</strong> ${formatDate(application.appliedDate.split('T')[0])}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${application.status.toLowerCase()}">${application.status}</span></p>
            </div>
            
            <div class="detail-group">
                <h3>ℹ️ Additional Information</h3>
                <p><strong>Availability:</strong> ${application.availability}</p>
                <p><strong>Skills & Experience:</strong> ${application.skills}</p>
                <p><strong>Motivation:</strong> ${application.motivation}</p>
            </div>
            
            ${application.status === 'Pending' ? `
                <div class="detail-actions">
                    <button class="btn btn-success" onclick="approveApplication(${application.id}); closeApplicationModal();">✅ Approve Application</button>
                    <button class="btn btn-danger" onclick="rejectApplication(${application.id}); closeApplicationModal();">❌ Reject Application</button>
                </div>
            ` : ''}
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    console.log('Modal opened successfully');
}

// Close application modal
function closeApplicationModal() {
    console.log('Closing application modal');
    const modal = document.getElementById('applicationModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        console.log('Application modal closed');
    } else {
        console.error('Application modal not found when trying to close');
    }
}

// Approve application
function approveApplication(applicationId) {
    const application = volunteerApplications.find(app => app.id === applicationId);
    if (!application) return;
    
    // Check if event is already full before approving
    const volunteerStats = getVolunteerStats(application.eventId);
    if (volunteerStats.isFull) {
        showNotification('Cannot approve - all volunteer positions for this event are already filled!', 'warning');
        return;
    }
    
    application.status = 'Approved';
    application.statusChangeDate = new Date().toISOString();
    application.studentNotified = false; // Will trigger notification
    
    saveApplications();
    updateStatistics();
    loadApplicationsTable();
    loadEventsManagement(); // Refresh volunteer counts in admin
    loadAllEvents(); // Refresh volunteer counts in events page
    loadUpcomingEvents(); // Refresh volunteer counts in home page
    
    showNotification(`Application for ${application.name} has been approved!`, 'success');
    
    // Store notification for student
    storeStudentNotification(application, 'approved');
}

// Reject application
function rejectApplication(applicationId) {
    const application = volunteerApplications.find(app => app.id === applicationId);
    if (!application) return;
    
    application.status = 'Rejected';
    application.statusChangeDate = new Date().toISOString();
    application.studentNotified = false; // Will trigger notification
    
    saveApplications();
    updateStatistics();
    loadApplicationsTable();
    loadEventsManagement(); // Refresh volunteer counts in admin
    loadAllEvents(); // Refresh volunteer counts in events page
    loadUpcomingEvents(); // Refresh volunteer counts in home page
    
    showNotification(`Application for ${application.name} has been rejected.`, 'warning');
    
    // Store notification for student
    storeStudentNotification(application, 'rejected');
}

// Store notification for student
function storeStudentNotification(application, type) {
    const notifications = JSON.parse(localStorage.getItem('studentNotifications') || '[]');
    
    const notification = {
        id: Date.now(),
        studentEmail: application.email,
        eventName: application.eventName,
        type: type,
        message: type === 'approved' 
            ? `Congratulations! You have been selected as a volunteer for ${application.eventName}.`
            : `Your volunteer application for ${application.eventName} was not approved this time.`,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    notifications.push(notification);
    localStorage.setItem('studentNotifications', JSON.stringify(notifications));
}

// Check for notifications (for demonstration)
function checkNotifications() {
    const notifications = JSON.parse(localStorage.getItem('studentNotifications') || '[]');
    const unreadNotifications = notifications.filter(n => !n.read);
    
    // For demo purposes, show a random notification occasionally
    if (unreadNotifications.length > 0 && Math.random() < 0.3) {
        const notification = unreadNotifications[0];
        setTimeout(() => {
            showNotification(notification.message, notification.type === 'approved' ? 'success' : 'warning');
            // Mark as read
            notification.read = true;
            localStorage.setItem('studentNotifications', JSON.stringify(notifications));
        }, 2000);
    }
}

// Refresh applications
function refreshApplications() {
    loadApplications();
    updateStatistics();
    loadApplicationsTable();
    showNotification('Applications refreshed!', 'success');
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showNotification('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// Mobile menu toggle
function toggleMobileMenu() {
    const nav = document.querySelector('.nav ul');
    if (nav) {
        nav.classList.toggle('active');
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (!notification || !notificationText) return;
    
    // Remove existing classes
    notification.className = 'notification';
    
    // Add type class
    if (type === 'error') {
        notification.classList.add('error');
    } else if (type === 'warning') {
        notification.classList.add('warning');
    }
    
    notificationText.textContent = message;
    notification.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        closeNotification();
    }, 5000);
}

// Close notification
function closeNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.style.display = 'none';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const volunteerModal = document.getElementById('volunteerModal');
    const applicationModal = document.getElementById('applicationModal');
    const addEventModal = document.getElementById('addEventModal');
    
    if (event.target === volunteerModal) {
        closeModal();
    }
    
    if (event.target === applicationModal) {
        closeApplicationModal();
    }
    
    if (event.target === addEventModal) {
        closeAddEventModal();
    }
}

// Handle escape key to close modals
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
        closeApplicationModal();
        closeAddEventModal();
        closeNotification();
    }
});

// Add some sample applications for demo purposes
function addSampleApplications() {
    if (volunteerApplications.length === 0) {
        const sampleApps = [
            {
                id: 1001,
                eventId: 1,
                eventName: "Annual Tech Fest 2025",
                name: "John Doe",
                rollNo: "CS001",
                department: "Computer Science",
                email: "john.doe@college.edu",
                skills: "Web development, Event management",
                availability: "Full Day",
                motivation: "Passionate about technology and helping fellow students",
                status: "Pending",
                appliedDate: new Date(Date.now() - 86400000).toISOString(),
                studentNotified: false
            },
            {
                id: 1002,
                eventId: 2,
                eventName: "Cultural Night",
                name: "Jane Smith",
                rollNo: "BA002",
                department: "Business Administration",
                email: "jane.smith@college.edu",
                skills: "Public speaking, Coordination",
                availability: "Evening Only",
                motivation: "Love organizing cultural events",
                status: "Approved",
                appliedDate: new Date(Date.now() - 172800000).toISOString(),
                studentNotified: true,
                statusChangeDate: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 1003,
                eventId: 3,
                eventName: "Career Fair 2025",
                name: "Alice Johnson",
                rollNo: "IT003",
                department: "Information Technology",
                email: "alice.johnson@college.edu",
                skills: "Communication, Leadership",
                availability: "Full Day",
                motivation: "Want to help fellow students with career guidance",
                status: "Approved",
                appliedDate: new Date(Date.now() - 259200000).toISOString(),
                studentNotified: true,
                statusChangeDate: new Date(Date.now() - 172800000).toISOString()
            }
        ];
        
        volunteerApplications = sampleApps;
        saveApplications();
        
        // Add sample notifications
        const sampleNotifications = [
            {
                id: 2001,
                studentEmail: "jane.smith@college.edu",
                eventName: "Cultural Night",
                type: "approved",
                message: "Congratulations! You have been selected as a volunteer for Cultural Night.",
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                read: false
            },
            {
                id: 2002,
                studentEmail: "alice.johnson@college.edu",
                eventName: "Career Fair 2025",
                type: "approved",
                message: "Congratulations! You have been selected as a volunteer for Career Fair 2025.",
                timestamp: new Date(Date.now() - 172800000).toISOString(),
                read: false
            }
        ];
        
        studentNotifications = sampleNotifications;
        localStorage.setItem('studentNotifications', JSON.stringify(studentNotifications));
    }
}

// Initialize sample data on first load
if (localStorage.getItem('dataInitialized') !== 'true') {
    addSampleApplications();
    localStorage.setItem('dataInitialized', 'true');
}

// ===== STUDENT PORTAL FUNCTIONS =====

// Setup student portal
function setupStudentPortal() {
    if (currentStudent) {
        showStudentDashboard();
    } else {
        showStudentLogin();
    }
    
    setupStudentLoginForm();
}

// Setup student login form
function setupStudentLoginForm() {
    const form = document.getElementById('studentLoginForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('studentEmail').value.toLowerCase();
        
        // Find student applications
        const studentApps = volunteerApplications.filter(app => 
            app.email.toLowerCase() === email
        );
        
        if (studentApps.length === 0) {
            showNotification('No applications found for this email address. Please check your email or apply for events first.', 'warning');
            return;
        }
        
        // Create student session
        currentStudent = {
            email: email,
            name: studentApps[0].name,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentStudent', JSON.stringify(currentStudent));
        showStudentDashboard();
        showNotification('Welcome to your student portal!', 'success');
    });
}

// Show student login section
function showStudentLogin() {
    const loginSection = document.getElementById('studentLoginSection');
    const dashboardSection = document.getElementById('studentDashboard');
    
    if (loginSection) loginSection.style.display = 'block';
    if (dashboardSection) dashboardSection.style.display = 'none';
}

// Show student dashboard
function showStudentDashboard() {
    const loginSection = document.getElementById('studentLoginSection');
    const dashboardSection = document.getElementById('studentDashboard');
    
    if (loginSection) loginSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'block';
    
    loadStudentDashboard();
}

// Load student dashboard data
function loadStudentDashboard() {
    if (!currentStudent) return;
    
    // Update student info
    const studentNameEl = document.getElementById('studentName');
    const displayEmailEl = document.getElementById('displayEmail');
    
    if (studentNameEl) studentNameEl.textContent = currentStudent.name;
    if (displayEmailEl) displayEmailEl.textContent = currentStudent.email;
    
    // Load student statistics
    updateStudentStatistics();
    
    // Load student notifications
    loadStudentNotificationsDisplay();
    
    // Load student applications
    loadStudentApplications();
}

// Update student statistics
function updateStudentStatistics() {
    if (!currentStudent) return;
    
    const studentApps = volunteerApplications.filter(app => 
        app.email.toLowerCase() === currentStudent.email.toLowerCase()
    );
    
    const stats = {
        total: studentApps.length,
        pending: studentApps.filter(app => app.status === 'Pending').length,
        approved: studentApps.filter(app => app.status === 'Approved').length,
        upcoming: studentApps.filter(app => app.status === 'Approved' && new Date(app.eventDate || '2025-12-31') > new Date()).length
    };
    
    const totalEl = document.getElementById('studentTotalApplications');
    const pendingEl = document.getElementById('studentPendingApplications');
    const approvedEl = document.getElementById('studentApprovedApplications');
    const upcomingEl = document.getElementById('studentUpcomingEvents');
    
    if (totalEl) totalEl.textContent = stats.total;
    if (pendingEl) pendingEl.textContent = stats.pending;
    if (approvedEl) approvedEl.textContent = stats.approved;
    if (upcomingEl) upcomingEl.textContent = stats.upcoming;
    
    // Show/hide sections based on data
    const noDataMessage = document.getElementById('noStudentDataMessage');
    const approvedEventsSection = document.getElementById('approvedEventsSection');
    
    if (stats.total === 0) {
        if (noDataMessage) noDataMessage.style.display = 'block';
    } else {
        if (noDataMessage) noDataMessage.style.display = 'none';
        
        if (stats.approved > 0) {
            if (approvedEventsSection) approvedEventsSection.style.display = 'block';
            loadApprovedEvents();
        }
    }
}

// Load student notifications display
function loadStudentNotificationsDisplay() {
    if (!currentStudent) return;
    
    const container = document.getElementById('studentNotificationsContainer');
    if (!container) return;
    
    const studentNotifs = studentNotifications.filter(notif => 
        notif.studentEmail.toLowerCase() === currentStudent.email.toLowerCase()
    ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (studentNotifs.length === 0) {
        container.innerHTML = '<p class="no-notifications">No notifications yet.</p>';
        return;
    }
    
    container.innerHTML = studentNotifs.map(notif => `
        <div class="notification-item ${notif.read ? '' : 'unread'} ${notif.type === 'approved' ? '' : 'warning'}">
            <div class="notification-header">
                <div class="notification-title">
                    ${notif.type === 'approved' ? '🎉 Application Approved!' : '📋 Application Update'}
                </div>
                <div class="notification-time">${formatDate(notif.timestamp.split('T')[0])}</div>
            </div>
            <div class="notification-message">${notif.message}</div>
        </div>
    `).join('');
    
    // Mark notifications as read
    studentNotifs.forEach(notif => notif.read = true);
    localStorage.setItem('studentNotifications', JSON.stringify(studentNotifications));
}

// Load student applications
function loadStudentApplications() {
    if (!currentStudent) return;
    
    const container = document.getElementById('studentApplicationsContainer');
    if (!container) return;
    
    const studentApps = volunteerApplications.filter(app => 
        app.email.toLowerCase() === currentStudent.email.toLowerCase()
    ).sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
    
    if (studentApps.length === 0) {
        container.innerHTML = '<p class="no-applications">No applications found.</p>';
        return;
    }
    
    container.innerHTML = studentApps.map(app => `
        <div class="application-item">
            <div class="application-header">
                <div class="application-event">${app.eventName}</div>
                <div class="status-badge status-${app.status.toLowerCase()}">${app.status}</div>
            </div>
            <div class="application-details">
                <div class="detail-item">
                    <div class="detail-label">Applied Date</div>
                    <div class="detail-value">${formatDate(app.appliedDate.split('T')[0])}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Availability</div>
                    <div class="detail-value">${app.availability}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Department</div>
                    <div class="detail-value">${app.department}</div>
                </div>
                ${app.status === 'Approved' && app.statusChangeDate ? `
                <div class="detail-item">
                    <div class="detail-label">Approved Date</div>
                    <div class="detail-value">${formatDate(app.statusChangeDate.split('T')[0])}</div>
                </div>
                ` : ''}
            </div>
            ${app.skills !== 'Not specified' ? `
            <div class="application-skills">
                <strong>Skills:</strong> ${app.skills}
            </div>
            ` : ''}
        </div>
    `).join('');
}

// Load approved events for student
function loadApprovedEvents() {
    if (!currentStudent) return;
    
    const container = document.getElementById('approvedEventsGrid');
    if (!container) return;
    
    const approvedApps = volunteerApplications.filter(app => 
        app.email.toLowerCase() === currentStudent.email.toLowerCase() && 
        app.status === 'Approved'
    );
    
    if (approvedApps.length === 0) {
        container.innerHTML = '<p class="no-events">No approved volunteer positions yet.</p>';
        return;
    }
    
    container.innerHTML = approvedApps.map(app => {
        const event = events.find(e => e.id === app.eventId);
        return `
            <div class="approved-event-card">
                <div class="approved-event-title">${app.eventName}</div>
                <div class="approved-event-details">
                    ${event ? `
                        <p><strong>📅 Date:</strong> ${formatDate(event.date)}</p>
                        <p><strong>🕒 Time:</strong> ${event.time}</p>
                        <p><strong>📍 Category:</strong> ${event.category}</p>
                    ` : ''}
                    <p><strong>⏰ Your Availability:</strong> ${app.availability}</p>
                    <p><strong>✅ Approved:</strong> ${formatDate(app.statusChangeDate?.split('T')[0] || app.appliedDate.split('T')[0])}</p>
                </div>
                <div class="volunteer-badge">✨ Selected Volunteer</div>
            </div>
        `;
    }).join('');
}

// Refresh student data
function refreshStudentData() {
    loadStudentNotifications();
    loadApplications();
    loadStudentDashboard();
    showNotification('Student data refreshed!', 'success');
}

// Logout student
function logoutStudent() {
    localStorage.removeItem('currentStudent');
    currentStudent = null;
    showStudentLogin();
    showNotification('Logged out successfully!', 'success');
    
    // Clear form
    const emailInput = document.getElementById('studentEmail');
    if (emailInput) emailInput.value = '';
}

// Search and Filter Functions

// Search events on events page (student side)
function searchEvents() {
    const searchTerm = document.getElementById('eventSearchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchTerm) || 
                             event.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || event.category === categoryFilter;
        
        let matchesStatus = true;
        if (statusFilter) {
            const stats = getVolunteerStats(event.id);
            if (statusFilter === 'available') {
                matchesStatus = stats.remaining > 0;
            } else if (statusFilter === 'full') {
                matchesStatus = stats.remaining === 0;
            }
        }
        
        return matchesSearch && matchesCategory && matchesStatus;
    });
    
    displayFilteredEvents(filteredEvents);
}

// Filter events (called by category/status filters)
function filterEvents() {
    searchEvents(); // Reuse search logic with filters
}

// Display filtered events
function displayFilteredEvents(filteredEvents) {
    const container = document.getElementById('allEventsGrid');
    const noResultsMessage = document.getElementById('noResultsMessage');
    
    if (!container) return;
    
    if (filteredEvents.length === 0) {
        container.style.display = 'none';
        if (noResultsMessage) noResultsMessage.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    if (noResultsMessage) noResultsMessage.style.display = 'none';
    
    container.innerHTML = filteredEvents.map(event => {
        const stats = getVolunteerStats(event.id);
        const isFull = stats.remaining === 0;
        
        return `
            <div class="event-card">
                <div class="event-category">${event.category}</div>
                <h3>${event.name}</h3>
                <div class="event-meta">
                    <span>📅 ${formatDate(event.date)}</span>
                    <span>⏰ ${event.time}</span>
                </div>
                <p class="event-description">${event.description}</p>
                <div class="volunteer-stats ${isFull ? 'volunteer-full' : ''}">
                    ${isFull ? 
                        '<span class="full-text">🚫 VOLUNTEER POSITIONS FULL</span>' : 
                        `<span>👥 ${stats.selected} selected, ${stats.remaining} remaining</span>`
                    }
                </div>
                <div class="event-actions">
                    <button class="btn ${isFull ? 'btn-disabled' : 'btn-primary'}" 
                            onclick="${isFull ? '' : `openVolunteerModal(${event.id})`}"
                            ${isFull ? 'disabled' : ''}>
                        ${isFull ? 'Full' : 'Apply Now'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Search admin events
function searchAdminEvents() {
    const searchTerm = document.getElementById('adminEventSearchInput').value.toLowerCase();
    
    const filteredEvents = events.filter(event => {
        return event.name.toLowerCase().includes(searchTerm) || 
               event.description.toLowerCase().includes(searchTerm) ||
               event.category.toLowerCase().includes(searchTerm);
    });
    
    displayFilteredAdminEvents(filteredEvents);
}

// Display filtered admin events
function displayFilteredAdminEvents(filteredEvents) {
    const container = document.getElementById('eventsAdminGrid');
    const noResultsMessage = document.getElementById('noEventResultsMessage');
    
    if (!container) return;
    
    if (filteredEvents.length === 0) {
        container.style.display = 'none';
        if (noResultsMessage) noResultsMessage.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    if (noResultsMessage) noResultsMessage.style.display = 'none';
    
    container.innerHTML = filteredEvents.map(event => {
        const stats = getVolunteerStats(event.id);
        return `
            <div class="event-admin-card">
                <div class="event-admin-header">
                    <h3>${event.name}</h3>
                    <span class="event-category-badge">${event.category}</span>
                </div>
                <div class="event-admin-details">
                    <p><strong>📅 Date:</strong> ${formatDate(event.date)}</p>
                    <p><strong>⏰ Time:</strong> ${event.time}</p>
                    <p><strong>📝 Description:</strong> ${event.description}</p>
                    <div class="volunteer-stats">
                        <span>👥 ${stats.selected}/${event.volunteersNeeded} volunteers</span>
                        <span class="${stats.remaining === 0 ? 'volunteer-full' : ''}">
                            ${stats.remaining === 0 ? '🚫 Full' : `${stats.remaining} remaining`}
                        </span>
                    </div>
                </div>
                <div class="event-admin-actions">
                    <button class="btn btn-danger btn-sm" onclick="deleteEvent(${event.id})">🗑️ Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Search applications
function searchApplications() {
    const searchTerm = document.getElementById('applicationSearchInput').value.toLowerCase();
    const statusFilter = document.getElementById('applicationStatusFilter').value;
    
    const filteredApplications = volunteerApplications.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchTerm) || 
                             app.rollNo.toLowerCase().includes(searchTerm) ||
                             app.eventName.toLowerCase().includes(searchTerm) ||
                             app.email.toLowerCase().includes(searchTerm) ||
                             app.department.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || app.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    displayFilteredApplications(filteredApplications);
}

// Filter applications by status
function filterApplications() {
    searchApplications(); // Reuse search logic with status filter
}

// Display filtered applications
function displayFilteredApplications(filteredApplications) {
    const tableBody = document.getElementById('applicationsTableBody');
    const noApplicationsMessage = document.getElementById('noApplicationsMessage');
    const noResultsMessage = document.getElementById('noApplicationResultsMessage');
    const table = document.getElementById('applicationsTable');
    
    if (!tableBody) return;
    
    if (filteredApplications.length === 0) {
        table.style.display = 'none';
        noApplicationsMessage.style.display = 'none';
        if (noResultsMessage) noResultsMessage.style.display = 'block';
        return;
    }
    
    table.style.display = 'table';
    noApplicationsMessage.style.display = 'none';
    if (noResultsMessage) noResultsMessage.style.display = 'none';
    
    tableBody.innerHTML = filteredApplications.map(app => `
        <tr>
            <td>${app.id}</td>
            <td>${app.name}</td>
            <td>${app.rollNo}</td>
            <td>${app.department}</td>
            <td>${app.email}</td>
            <td>${app.eventName}</td>
            <td><span class="status-badge status-${app.status.toLowerCase()}">${app.status}</span></td>
            <td>${formatDate(app.appliedDate)}</td>
            <td class="actions">
                ${app.status === 'Pending' ? `
                    <button class="btn btn-success btn-sm" onclick="updateApplicationStatus(${app.id}, 'Approved')">✅ Approve</button>
                    <button class="btn btn-danger btn-sm" onclick="updateApplicationStatus(${app.id}, 'Rejected')">❌ Reject</button>
                ` : `
                    <button class="btn btn-info btn-sm" onclick="showApplicationDetails(${app.id})">👁️ View</button>
                `}
            </td>
        </tr>
    `).join('');
}
