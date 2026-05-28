// Toast Utility
const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '<i class="fas fa-check-circle" style="color:var(--accent)"></i>' : '<i class="fas fa-exclamation-circle" style="color:var(--danger)"></i>';
    
    toast.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.8rem;">
            ${icon}
            <span>${message}</span>
        </div>
        <span style="cursor:pointer; font-weight:bold; margin-left:1rem; opacity:0.7;" onclick="this.parentElement.remove()">&times;</span>
    `;
    container.appendChild(toast);
    setTimeout(() => { if(toast.parentElement) toast.remove(); }, 4000);
};

document.addEventListener('DOMContentLoaded', async () => {
    const session = DB.getSession();
    
    // Auth Guard
    if (!session) {
        window.location.href = 'index.html';
        return;
    }

    // Setup Profile Dropdown & Icon
    let navIcon = '<i class="fas fa-user"></i>';
    if (session.role === 'ADMIN') navIcon = '<i class="fas fa-user-shield"></i>';
    if (session.role === 'ORGANIZER') navIcon = '<i class="fas fa-clipboard-list"></i>';
    
    if (session.profileImage) {
        document.getElementById('nav-profile-icon').innerHTML = `<img src="${session.profileImage}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
    } else {
        document.getElementById('nav-profile-icon').innerHTML = navIcon;
    }
    
    const badgeHtml = `<span class="badge ${session.role === 'ADMIN' ? 'badge-danger' : session.role === 'ORGANIZER' ? 'badge-warning' : 'badge-primary'} role-badge-header">${session.role}</span>`;
    document.getElementById('dropdown-name').innerHTML = `${session.name} ${badgeHtml}`;
    document.getElementById('dropdown-email').innerText = session.email;

    // Toggle Dropdown
    const profileTrigger = document.getElementById('nav-profile-trigger');
    const profileDropdown = document.getElementById('profile-dropdown');

    profileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (profileDropdown.style.display === 'none') {
            profileDropdown.style.display = 'block';
            profileTrigger.style.background = 'rgba(88, 166, 255, 0.1)';
        } else {
            profileDropdown.style.display = 'none';
            profileTrigger.style.background = 'transparent';
        }
    });

    // Close dropdown on outside click
    window.addEventListener('click', () => {
        if(profileDropdown.style.display === 'block') {
            profileDropdown.style.display = 'none';
            profileTrigger.style.background = 'transparent';
        }
    });

    // Sidebar Mobile Toggle Logic
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.add('open');
        });
    }
    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    // History Modal Logic
    if (session.role === 'USER') {
        const historyItem = document.getElementById('sidebar-history-item');
        if (historyItem) historyItem.style.display = 'block';
        
        const btnHistory = document.getElementById('sidebar-btn-history');
        if (btnHistory) {
            btnHistory.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('history-modal').classList.add('active');
                if(sidebar) sidebar.classList.remove('open');
            });
        }
        
        const historyClose = document.getElementById('history-close');
        if (historyClose) {
            historyClose.addEventListener('click', () => {
                document.getElementById('history-modal').classList.remove('active');
            });
        }

        const paymentHistoryItem = document.getElementById('sidebar-payment-history-item');
        if (paymentHistoryItem) paymentHistoryItem.style.display = 'block';

        const btnPaymentHistory = document.getElementById('sidebar-btn-payment-history');
        if (btnPaymentHistory) {
            btnPaymentHistory.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('payment-history-modal').classList.add('active');
                if(sidebar) sidebar.classList.remove('open');
            });
        }

        const paymentHistoryClose = document.getElementById('payment-history-close');
        if (paymentHistoryClose) {
            paymentHistoryClose.addEventListener('click', () => {
                document.getElementById('payment-history-modal').classList.remove('active');
            });
        }
    } else {
        const paymentHistoryItem = document.getElementById('sidebar-payment-history-item');
        if (paymentHistoryItem) paymentHistoryItem.style.display = 'block';

        const btnPaymentHistory = document.getElementById('sidebar-btn-payment-history');
        if (btnPaymentHistory) {
            if (session.role === 'ORGANIZER') {
                btnPaymentHistory.innerHTML = '<i class="fas fa-file-invoice-dollar" style="width: 20px; text-align: center;"></i> Earnings History';
                document.getElementById('payment-history-title').innerText = "Earnings History";
            } else if (session.role === 'ADMIN') {
                btnPaymentHistory.innerHTML = '<i class="fas fa-file-invoice-dollar" style="width: 20px; text-align: center;"></i> Global Transactions';
                document.getElementById('payment-history-title').innerText = "Global Transactions";
            }

            btnPaymentHistory.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('payment-history-modal').classList.add('active');
                if(sidebar) sidebar.classList.remove('open');
            });
        }

        const paymentHistoryClose = document.getElementById('payment-history-close');
        if (paymentHistoryClose) {
            paymentHistoryClose.addEventListener('click', () => {
                document.getElementById('payment-history-modal').classList.remove('active');
            });
        }
    }

    // Logout (Main & Sidebar)
    const logoutAction = () => {
        DB.logout();
        window.location.href = 'index.html';
    };
    const btnLogoutNav = document.getElementById('btn-logout');
    if(btnLogoutNav) btnLogoutNav.addEventListener('click', logoutAction);
    
    const sidebarBtnLogout = document.getElementById('sidebar-btn-logout');
    if(sidebarBtnLogout) sidebarBtnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        logoutAction();
    });

    // Settings (Main & Sidebar)
    const settingsAction = () => {
        document.getElementById('profile-dropdown').style.display = 'none';
        document.getElementById('nav-profile-trigger').style.background = 'transparent';
        if (session.profileImage) {
            document.getElementById('edit-profile-preview').innerHTML = `<img src="${session.profileImage}" style="width:100%; height:100%; object-fit:cover;">`;
        } else {
            document.getElementById('edit-profile-preview').innerHTML = '<i class="fas fa-user"></i>';
        }
        document.getElementById('edit-profile-name').value = session.name || '';
        document.getElementById('edit-profile-email').value = session.email || '';
        document.getElementById('edit-profile-phone').value = session.phone || '';
        document.getElementById('edit-profile-password').value = '';
        document.getElementById('edit-profile-modal').classList.add('active');
    };
    
    const btnEditProfile = document.getElementById('btn-edit-profile');
    if (btnEditProfile) btnEditProfile.addEventListener('click', settingsAction);

    const sidebarBtnSettings = document.getElementById('sidebar-btn-settings');
    if(sidebarBtnSettings) sidebarBtnSettings.addEventListener('click', (e) => {
        e.preventDefault();
        settingsAction();
        if(sidebar) sidebar.classList.remove('open');
    });

    // Sidebar Role Logic
    if (session.role === 'ORGANIZER' || session.role === 'ADMIN') {
        const createItem = document.getElementById('sidebar-create-event-item');
        if(createItem) createItem.style.display = 'block';
        
        const sidebarBtnCreate = document.getElementById('sidebar-btn-create');
        if(sidebarBtnCreate) {
            sidebarBtnCreate.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('create-event-modal').classList.add('active');
                sidebar.classList.remove('open');
            });
        }
    }

    if (session.role === 'ADMIN') {
        const adminUserItem = document.getElementById('sidebar-admin-user-item');
        if (adminUserItem) adminUserItem.style.display = 'block';

        const sidebarBtnAddUser = document.getElementById('sidebar-btn-add-user');
        if (sidebarBtnAddUser) {
            sidebarBtnAddUser.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof openUserModal === 'function') openUserModal();
                sidebar.classList.remove('open');
            });
        }
    }

    const contentDiv = document.getElementById('dashboard-content');
    const actionsDiv = document.getElementById('dashboard-actions');
    const dashboardTitle = document.getElementById('dashboard-title');
    const dashboardSubtitle = document.getElementById('dashboard-subtitle');
    
    const isEventCompleted = (dateStr, timeStr) => {
        const eventDateTime = new Date(`${dateStr}T${timeStr}`);
        return eventDateTime < new Date();
    };

    window.updateEvStatus = async (eventId, status) => {
        const ok = await DB.updateEventStatus(eventId, status);
        if (ok) {
            showToast(`Event marked as ${status}`, 'success');
            if (session.role === 'ADMIN') await renderAdminDashboard();
            if (session.role === 'ORGANIZER') await renderOrganizerDashboard();
            if (session.role === 'USER') await renderUserDashboard();
        } else {
            showToast('Failed to update status', 'error');
        }
    };

    // USER VIEW
    
    const renderUserDashboard = async () => {
        dashboardTitle.innerText = "Discover Events";
        dashboardSubtitle.innerText = "Browse and book your spots for upcoming events.";
        actionsDiv.innerHTML = ``;
        
        let events = await DB.getAllEvents();
        events = events.filter(e => e.status === 'APPROVED' || !e.status);
        if (window.currentSearchQuery) {
            events = events.filter(e => e.title.toLowerCase().includes(window.currentSearchQuery) || e.location.toLowerCase().includes(window.currentSearchQuery));
        }
        const myBookings = await DB.getUserBookings(session.id);
        const bookedEventIds = myBookings.filter(b => b.status !== 'CANCELLED').map(b => b.event ? b.event.id : b.eventId);

        let html = `<div class="dashboard-grid">`;
        
        if (events.length === 0) {
            html += `<div style="grid-column: 1/-1; text-align: center; padding: 3rem;"><i class="fas fa-calendar-times text-muted" style="font-size:3rem; margin-bottom:1rem;"></i><p class="text-muted">No events currently available.</p></div>`;
        } else {
            events.forEach(ev => {
                const isBooked = bookedEventIds.includes(ev.id);
                const isCompleted = isEventCompleted(ev.date, ev.time);
                html += `
                    <div class="glass-card event-card">
                        <div class="event-card-body">
                            <h4>${ev.title}</h4>
                            <p class="event-card-description">${ev.desc}</p>
                            <p class="event-card-meta"><i class="fas fa-calendar-alt"></i> ${ev.date} at ${ev.time}</p>
                            <p class="event-card-meta"><i class="fas fa-map-marker-alt"></i> ${ev.location}</p>
                            <p class="event-card-meta" style="color: var(--primary); font-weight: 500;"><i class="fas fa-user-tie"></i> Host: ${ev.organizer ? ev.organizer.name : 'Administrator'}</p>
                        </div>
                        <div class="event-meta">
                            <div class="badge-group">
                                <span class="badge badge-primary" style="font-size: 0.85rem; padding: 0.4rem 0.75rem;">${ev.capacity} Seats</span>
                                <span class="badge ${ev.isFree ? 'badge-success' : 'badge-warning'}" style="font-size: 0.85rem; padding: 0.4rem 0.75rem;">${ev.isFree ? 'Free' : '$' + parseFloat(ev.price).toFixed(2)}</span>
                            </div>
                            <div class="badge-group">
                                ${isCompleted ? `<span class="badge badge-warning" style="font-size: 0.85rem; padding: 0.4rem 0.75rem;"><i class="fas fa-check-double" style="margin-right: 0.3rem;"></i> Completed</span>` : ''}
                                ${!isCompleted && isBooked ? `<span class="badge badge-success" style="font-size: 0.85rem; padding: 0.4rem 0.75rem;"><i class="fas fa-check" style="margin-right: 0.3rem;"></i> Booked</span>` : ''}
                            </div>
                        </div>
                        <div class="event-actions">
                            ${!isCompleted && !isBooked ? `<button class="btn btn-primary btn-sm" onclick="bookEvent(${ev.id}, ${ev.isFree}, ${ev.price || 0})"><i class="fas fa-ticket-alt" style="margin-right: 0.5rem;"></i> Book Spot</button>` : ''}
                            ${ev.galleryImages && ev.galleryImages.length > 0 ? `<button class="btn btn-outline btn-sm" onclick="openGallery(${ev.id})"><i class="fas fa-images" style="margin-right: 0.5rem;"></i> View Gallery</button>` : ''}
                        </div>
                    </div>
                `;
            });
        }
        html += `</div>`;
        contentDiv.innerHTML = html;

        // Populate Booking History Modal
        const historyTbody = document.getElementById('history-table-body');
        if (myBookings.length === 0) {
            historyTbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted" style="padding:2rem;">You haven\'t booked any events yet.</td></tr>';
        } else {
            historyTbody.innerHTML = myBookings.map(b => {
                const isCompleted = isEventCompleted(b.event.date, b.event.time);
                let actionBtn = '';
                if (b.status === 'CANCELLED') {
                    actionBtn = `<span class="badge badge-danger" style="font-size: 0.75rem;">Cancelled</span>`;
                } else if (isCompleted) {
                    actionBtn = `<span class="badge badge-warning" style="font-size: 0.75rem;">Completed</span>`;
                } else {
                    actionBtn = `<button class="btn btn-danger" onclick="cancelBooking(${b.id})" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;"><i class="fas fa-times" style="margin-right: 0.5rem;"></i> Cancel</button>`;
                }
                return `
                <tr>
                    <td data-label="Event Details"><div style="font-weight:600;">${b.event.title}</div></td>
                    <td data-label="Scheduled Date">${b.event.date} at ${b.event.time}</td>
                    <td data-label="Location">${b.event.location}</td>
                    <td data-label="Action">${actionBtn}</td>
                </tr>
                `;
            }).join('');
        }

        // Populate Payment History Modal
        const paymentHistoryThead = document.getElementById('payment-history-thead');
        paymentHistoryThead.innerHTML = `
            <tr style="border-bottom: 1px solid var(--border);">
                <th style="padding: 1rem; text-align: center; color: var(--text-muted); min-width: 200px;">Event</th>
                <th style="padding: 1rem; text-align: center; color: var(--text-muted); white-space: nowrap;">Transaction Date</th>
                <th style="padding: 1rem; text-align: center; color: var(--text-muted); white-space: nowrap;">Amount Paid</th>
                <th style="padding: 1rem; text-align: center; color: var(--text-muted); white-space: nowrap;">Status</th>
            </tr>
        `;

        const paymentHistoryTbody = document.getElementById('payment-history-table-body');
        const paidBookings = myBookings.filter(b => !b.event.isFree && b.status !== 'CANCELLED');
        
        if (paidBookings.length === 0) {
            paymentHistoryTbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted" style="padding:2rem;">No payment history found.</td></tr>';
        } else {
            paymentHistoryTbody.innerHTML = paidBookings.map(b => {
                return `
                <tr>
                    <td data-label="Event">
                        <div>
                            <div style="font-weight:600;">${b.event.title}</div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);"><i class="fas fa-map-marker-alt"></i> ${b.event.location}</div>
                        </div>
                    </td>
                    <td data-label="Transaction Date" style="white-space: nowrap;">${b.event.date}</td>
                    <td data-label="Amount Paid" style="font-weight:bold; color:var(--success); white-space: nowrap;">$${parseFloat(b.event.price).toFixed(2)}</td>
                    <td data-label="Status" style="white-space: nowrap;"><span class="badge badge-success"><i class="fas fa-check-circle" style="margin-right:0.2rem;"></i> Success</span></td>
                </tr>
                `;
            }).join('');
        }
    };

    let pendingPaymentEventId = null;

    window.bookEvent = async (eventId, isFree, price) => {
        if (isFree || isFree === undefined) {
            const res = await DB.bookEvent(eventId, session.id);
            if(res.success) {
                showToast('Ticket booked successfully!', 'success');
                await renderUserDashboard();
            } else {
                showToast(res.message, 'error');
            }
        } else {
            pendingPaymentEventId = eventId;
            document.getElementById('payment-amount').innerText = '$' + parseFloat(price).toFixed(2);
            document.getElementById('payment-modal').classList.add('active');
        }
    };

    window.cancelBooking = async (bookingId) => {
        if(confirm("Are you sure you want to cancel your ticket for this event?")) {
            await DB.cancelBooking(bookingId);
            showToast('Event booking cancelled.', 'success');
            await renderUserDashboard();
        }
    };


    
    // ORGANIZER VIEW



    const renderOrganizerDashboard = async () => {
        dashboardTitle.innerText = "My Event Listings";
        dashboardSubtitle.innerText = "Manage the events you are hosting.";
        actionsDiv.innerHTML = `<button class="btn btn-success" id="btn-create-event"><i class="fas fa-plus" style="margin-right: 0.5rem;"></i> Publish Event</button>`;
        
        document.getElementById('btn-create-event').addEventListener('click', () => {
            document.getElementById('create-event-modal').classList.add('active');
        });

        const allEvents = await DB.getAllEvents();
        let myEvents = allEvents.filter(e => (e.organizer && e.organizer.id === session.id) || e.organizerId === session.id);
        
        if (window.currentSearchQuery) {
            myEvents = myEvents.filter(e => e.title.toLowerCase().includes(window.currentSearchQuery) || e.location.toLowerCase().includes(window.currentSearchQuery));
        }

        let totalRevenue = 0;
        const eventsWithAttendees = await Promise.all(myEvents.map(async (ev) => {
            const attendeesRows = await DB.getEventAttendees(ev.id);
            const activeAttendees = attendeesRows.filter(a => a.status !== 'CANCELLED');
            if (!ev.isFree) totalRevenue += (activeAttendees.length * (ev.price || 0));
            return { ...ev, activeAttendees };
        }));

        let html = `
            <div style="display:flex; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap;">
                <div class="glass-card" style="flex:1; min-width:200px; padding: 1.5rem; text-align: center; border-bottom: 3px solid var(--success);">
                    <h3 style="color:var(--text-muted); font-size:1rem; margin-bottom:0.5rem;">Total Revenue Generated</h3>
                    <div style="font-size:2rem; font-weight:700; color:var(--success);">$${totalRevenue.toFixed(2)}</div>
                </div>
                <div class="glass-card" style="flex:1; min-width:200px; padding: 1.5rem; text-align: center; border-bottom: 3px solid var(--primary);">
                    <h3 style="color:var(--text-muted); font-size:1rem; margin-bottom:0.5rem;">Events Organized</h3>
                    <div style="font-size:2rem; font-weight:700; color:var(--primary);">${myEvents.length}</div>
                </div>
            </div>
            <div class="dashboard-grid">`;
        if(eventsWithAttendees.length === 0) {
            html += `<div style="grid-column: 1/-1; text-align: center; padding: 3rem;"><i class="fas fa-folder-open text-muted" style="font-size:3rem; margin-bottom:1rem;"></i><p class="text-muted">You haven't listed any events yet.</p></div>`;
        } else {
            for (const item of eventsWithAttendees) {
                const ev = item;
                const activeAttendees = item.activeAttendees;
                const isCompleted = isEventCompleted(ev.date, ev.time) || ev.status === 'COMPLETED';
                let statusBadge = '';
                const evStatus = ev.status || 'APPROVED';
                if (isCompleted) statusBadge = `<span class="badge badge-warning">Completed</span>`;
                else if (evStatus === 'PENDING') statusBadge = `<span class="badge badge-warning">Pending</span>`;
                else if (evStatus === 'APPROVED') statusBadge = `<span class="badge badge-success">Approved</span>`;
                else if (evStatus === 'REJECTED') statusBadge = `<span class="badge badge-danger">Rejected</span>`;

                html += `
                    <div class="glass-card event-card">
                        <div class="event-card-body">
                            <div class="event-card-heading">
                                <h4>${ev.title}</h4>
                                ${statusBadge}
                            </div>
                            <p class="event-card-description" style="color:var(--text-muted);">${ev.desc}</p>
                            <p class="event-card-meta"><i class="fas fa-calendar"></i> ${ev.date} at ${ev.time}</p>
                            <p class="event-card-meta"><i class="fas fa-chart-pie"></i> ${activeAttendees.length} / ${ev.capacity} spots filled</p>
                            <p class="event-card-meta"><i class="fas fa-tag"></i> ${ev.isFree ? 'Free Event' : 'Price: $' + parseFloat(ev.price).toFixed(2)}</p>
                            ${!ev.isFree ? `<p class="event-card-meta" style="color:var(--success);"><i class="fas fa-dollar-sign"></i> Revenue: $${(activeAttendees.length * ev.price).toFixed(2)}</p>` : ''}
                        </div>
                        <div class="event-meta">
                            <button class="btn btn-outline btn-sm" onclick="viewAttendees(${ev.id})"><i class="fas fa-users" style="margin-right: 0.5rem;"></i> Attendees</button>
                            <button class="btn btn-outline btn-sm" onclick="openGallery(${ev.id})"><i class="fas fa-images" style="margin-right: 0.5rem;"></i> Gallery</button>
                            ${!isCompleted && evStatus === 'APPROVED' ? `<button class="btn btn-success btn-sm" onclick="updateEvStatus(${ev.id}, 'COMPLETED')"><i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i> Mark Completed</button>` : ''}
                            ${evStatus === 'COMPLETED' && !isEventCompleted(ev.date, ev.time) ? `<button class="btn btn-primary btn-sm" onclick="updateEvStatus(${ev.id}, 'APPROVED')"><i class="fas fa-undo" style="margin-right: 0.5rem;"></i> Mark Active</button>` : ''}
                            <button class="btn btn-danger btn-sm" onclick="deleteEvent(${ev.id}, 'org')"><i class="fas fa-trash-alt" style="margin-right: 0.5rem;"></i> Delete</button>
                        </div>
                    </div>
                `;
            }
        }
        html += `</div>`;
        contentDiv.innerHTML = html;

        // Populate Organizer Payment History Modal
        const paymentHistoryThead = document.getElementById('payment-history-thead');
        paymentHistoryThead.innerHTML = `
            <tr style="border-bottom: 1px solid var(--border);">
                <th style="padding: 1rem; text-align: center; color: var(--text-muted); min-width: 200px;">Event</th>
                <th style="padding: 1rem; text-align: center; color: var(--text-muted); min-width: 150px;">Attendee</th>
                <th style="padding: 1rem; text-align: center; color: var(--text-muted); white-space: nowrap;">Transaction Date</th>
                <th style="padding: 1rem; text-align: center; color: var(--text-muted); white-space: nowrap;">Revenue</th>
                <th style="padding: 1rem; text-align: center; color: var(--text-muted); white-space: nowrap;">Status</th>
            </tr>
        `;

        const paymentHistoryTbody = document.getElementById('payment-history-table-body');
        let paymentRowsHtml = '';
        
        eventsWithAttendees.forEach(item => {
            if (!item.isFree) {
                item.activeAttendees.forEach(attendee => {
                    paymentRowsHtml += `
                    <tr>
                        <td data-label="Event">
                            <div style="font-weight:600;">${item.title}</div>
                        </td>
                        <td data-label="Attendee">
                            <div>
                                <div style="font-weight:500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;">${attendee.user ? attendee.user.name : 'Unknown User'}</div>
                                <div style="font-size: 0.8rem; color: var(--text-muted); word-break: break-all;">${attendee.user ? attendee.user.email : ''}</div>
                            </div>
                        </td>
                        <td data-label="Transaction Date" style="white-space: nowrap;">${item.date}</td>
                        <td data-label="Revenue" style="font-weight:bold; color:var(--success); white-space: nowrap;">$${parseFloat(item.price).toFixed(2)}</td>
                        <td data-label="Status" style="white-space: nowrap;"><span class="badge badge-success"><i class="fas fa-check-circle" style="margin-right:0.2rem;"></i> Success</span></td>
                    </tr>
                    `;
                });
            }
        });

        if (paymentRowsHtml === '') {
            paymentHistoryTbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted" style="padding:2rem;">No earnings history found.</td></tr>';
        } else {
            paymentHistoryTbody.innerHTML = paymentRowsHtml;
        }
    };

    window.viewAttendees = async (eventId) => {
        const attendees = await DB.getEventAttendees(eventId);
        const tbody = document.getElementById('attendees-table-body');
        if (attendees.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted" style="padding:2rem;">No attendees registered yet.</td></tr>`;
        } else {
            tbody.innerHTML = attendees.map(a => `
                <tr>
                    <td data-label="Attendee Name"><div style="font-weight:500;">${a.user.name}</div></td>
                    <td data-label="Contact Info">
                        <div>
                            <div style="color:var(--text-main); font-size: 0.85rem;">${a.user.email}</div>
                            <div style="color:var(--text-muted); font-size: 0.8rem;">${a.user.phone || a.phone || 'N/A'}</div>
                        </div>
                    </td>
                    <td data-label="Organization" style="font-size: 0.85rem; color:var(--text-muted);">${a.company || 'N/A'}</td>
                    <td data-label="Status">
                        ${a.status === 'CANCELLED' 
                            ? `<span class="badge badge-danger" style="font-size: 0.7rem;">Cancelled</span>`
                            : `<span class="badge badge-success" style="font-size: 0.7rem;">Booked</span>`
                        }
                    </td>
                </tr>
            `).join('');
        }
        document.getElementById('attendees-modal').classList.add('active');
    };

    window.deleteEvent = async (eventId, role) => {
        if(confirm("Permanently delete this event? All associated bookings will be cancelled.")) {
            await DB.deleteEvent(eventId);
            showToast('Event successfully deleted.', 'success');
            if (role === 'org') await renderOrganizerDashboard();
            else await renderAdminDashboard();
        }
    };

    let currentGalleryEventId = null;

    window.openGallery = async (eventId) => {
        currentGalleryEventId = eventId;
        const allEvents = await DB.getAllEvents();
        const ev = allEvents.find(e => e.id === eventId);
        if (!ev) return;

        document.getElementById('gallery-title').innerText = `Gallery: ${ev.title}`;
        
        const form = document.getElementById('gallery-form');
        if (form) {
            form.style.display = (session.role === 'ORGANIZER' || session.role === 'ADMIN') ? 'flex' : 'none';
        }

        renderGalleryGrid(ev.galleryImages || []);
        document.getElementById('gallery-modal').classList.add('active');
    };

    const renderGalleryGrid = (images) => {
        const grid = document.getElementById('gallery-grid');
        if (!images || images.length === 0) {
            const msg = (session.role === 'ORGANIZER' || session.role === 'ADMIN') ? 'No photos yet. Add some below!' : 'No photos available for this event.';
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);"><i class="fas fa-image" style="font-size: 3rem; margin-bottom: 1rem;"></i><p>${msg}</p></div>`;
            return;
        }

        grid.innerHTML = images.map(imgUrl => `
            <div style="position: relative; border-radius: 8px; overflow: hidden; aspect-ratio: 1; background: #000;">
                <img src="${imgUrl}" alt="Event Photo" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9; transition: 0.3s ease;">
                ${(session.role === 'ORGANIZER' || session.role === 'ADMIN') ? `<button onclick="removeGalleryImage('${imgUrl}')" style="position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(255,50,50,0.8); color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; display: flex; align-items: center; justify-content: center;" title="Remove Photo"><i class="fas fa-trash"></i></button>` : ''}
            </div>
        `).join('');
    };

    window.removeGalleryImage = async (imgUrl) => {
        if (!confirm("Remove this photo from the gallery?")) return;
        const res = await DB.removeGalleryImage(currentGalleryEventId, imgUrl);
        if (res.success) {
            showToast("Photo removed successfully", "success");
            renderGalleryGrid(res.data.galleryImages);
        } else {
            showToast("Failed to remove photo", "error");
        }
    };

    const galleryForm = document.getElementById('gallery-form');
    if (galleryForm) {
        galleryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const urlInput = document.getElementById('gallery-image-url');
            const fileInput = document.getElementById('gallery-file');
            const imgUrl = urlInput.value.trim();
            const file = fileInput.files[0];

            if (!imgUrl && !file) {
                showToast("Please provide either an image URL or upload a file", "error");
                return;
            }

            let res;
            if (file) {
                // Handle physical file upload
                res = await DB.uploadGalleryImage(currentGalleryEventId, file);
            } else {
                // Handle URL
                res = await DB.addGalleryImage(currentGalleryEventId, imgUrl);
            }

            if (res.success) {
                showToast("Photo added to gallery!", "success");
                urlInput.value = '';
                fileInput.value = '';
                renderGalleryGrid(res.data.galleryImages);
            } else {
                showToast(res.message || "Failed to add photo", "error");
            }
        });
    }


    
    // ADMIN VIEW
  

    const renderAdminDashboard = async () => {
        dashboardTitle.innerText = "System Administration";
        dashboardSubtitle.innerText = "Manage users and all events across the platform.";
        actionsDiv.innerHTML = ``;
        
        const users = await DB.getUsers();
        let events = await DB.getAllEvents();
        
        if (window.currentSearchQuery) {
            events = events.filter(e => e.title.toLowerCase().includes(window.currentSearchQuery) || e.location.toLowerCase().includes(window.currentSearchQuery));
        }

        let globalRevenue = 0;
        await Promise.all(events.map(async (ev) => {
            if (!ev.isFree) {
                const attendeesRows = await DB.getEventAttendees(ev.id);
                const activeAttendees = attendeesRows.filter(a => a.status !== 'CANCELLED');
                globalRevenue += (activeAttendees.length * (ev.price || 0));
            }
        }));

        let html = `
            <div style="display:flex; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap;">
                <div class="glass-card" style="flex:1; min-width:200px; padding: 1.5rem; text-align: center; border-bottom: 3px solid var(--success);">
                    <h3 style="color:var(--text-muted); font-size:1rem; margin-bottom:0.5rem;">Global Platform Revenue</h3>
                    <div style="font-size:2rem; font-weight:700; color:var(--success);">$${globalRevenue.toFixed(2)}</div>
                </div>
                <div class="glass-card" style="flex:1; min-width:200px; padding: 1.5rem; text-align: center; border-bottom: 3px solid var(--primary);">
                    <h3 style="color:var(--text-muted); font-size:1rem; margin-bottom:0.5rem;">Total System Events</h3>
                    <div style="font-size:2rem; font-weight:700; color:var(--primary);">${events.length}</div>
                </div>
                <div class="glass-card" style="flex:1; min-width:200px; padding: 1.5rem; text-align: center; border-bottom: 3px solid var(--warning);">
                    <h3 style="color:var(--text-muted); font-size:1rem; margin-bottom:0.5rem;">Total Users</h3>
                    <div style="font-size:2rem; font-weight:700; color:var(--warning);">${users.length}</div>
                </div>
            </div>
            
            <div style="display:flex; flex-direction: column; gap: 2rem;">
                
                <!-- Users Table -->
                <div class="glass-card" style="flex: 1; min-width: 280px; padding: 1.5rem;">
                    <div style="display:flex; justify-content: space-between; align-items:center; flex-wrap:wrap; gap:1rem;" class="mb-4">
                        <h3 style="margin: 0; font-size: 1.2rem;"><i class="fas fa-users-cog" style="color:var(--primary); margin-right:0.5rem;"></i> System Users</h3>
                        <button class="btn btn-primary" onclick="openUserModal()" style="padding: 0.4rem 1rem; font-size: 0.85rem;"><i class="fas fa-user-plus" style="margin-right: 0.5rem;"></i> Add User</button>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead><tr><th>Name / Email</th><th>Role</th><th>Action</th></tr></thead>
                            <tbody>
                                ${users.map(u => `
                                    <tr>
                                        <td data-label="Name / Email">
                                            <div style="display:flex; align-items:center; gap:0.8rem;">
                                                <div style="width: 32px; height: 32px; min-width: 32px; min-height: 32px; flex-shrink: 0; border-radius: 50%; background: var(--border); overflow: hidden; display:flex; justify-content:center; align-items:center;">
                                                    ${u.profileImage ? `<img src="${u.profileImage}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fas fa-user text-muted"></i>`}
                                                </div>
                                                <div>
                                                    <div style="font-weight: 500;">${u.name}</div>
                                                    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem;">${u.email} | ${u.phone || 'No Phone'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td data-label="Role"><span class="badge ${u.role==='ADMIN'?'badge-danger':u.role==='ORGANIZER'?'badge-warning':'badge-primary'}">${u.role}</span></td>
                                        <td data-label="Action" style="white-space: nowrap;">
                                            <div style="display: flex; gap: 0.5rem; align-items: center; justify-content: flex-end;">
                                                <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size:0.8rem;" onclick="openUserModal(${u.id})"><i class="fas fa-edit" style="margin-right: 0.4rem;"></i> Edit</button>
                                                ${u.id !== session.id ? `<button class="btn btn-danger" style="padding: 0.3rem 0.6rem; font-size:0.8rem;" onclick="deleteUser(${u.id})"><i class="fas fa-trash" style="margin-right: 0.4rem;"></i> Drop</button>` : `<span style="font-size:0.8rem; color:var(--text-muted); font-style:italic;">You</span>`}
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Events Table -->
                <div class="glass-card" style="flex: 1; min-width: 280px; padding: 1.5rem;">
                    <h3 class="mb-4" style="font-size: 1.2rem;"><i class="fas fa-calendar-week" style="color:var(--secondary); margin-right:0.5rem;"></i> Global Events</h3>
                    <div class="table-container">
                        <table>
                            <thead><tr><th>Event Title</th><th>Date & Time</th><th>Action</th></tr></thead>
                            <tbody>
                                ${events.length === 0 ? `<tr><td colspan="3" class="text-muted text-center" style="padding:2rem;">No events in the system.</td></tr>` : events.map(e => {
                                    const isCompleted = isEventCompleted(e.date, e.time);
                                    let statusText = e.status || 'APPROVED';
                                    if (isCompleted) statusText = 'COMPLETED';
                                    
                                    let statusBtnHtml = '';
                                    if (statusText === 'PENDING') {
                                        statusBtnHtml = `
                                            <div style="display: flex; gap: 0.5rem; align-items: center;">
                                                <button class="badge badge-warning" style="border:none; cursor:pointer;" onclick="updateEvStatus(${e.id}, 'APPROVED')" title="Click to Approve">PENDING</button>
                                                <button class="badge badge-danger" style="border:none; cursor:pointer;" onclick="updateEvStatus(${e.id}, 'REJECTED')" title="Click to Reject">REJECT</button>
                                            </div>
                                        `;
                                    } else if (statusText === 'APPROVED') {
                                        statusBtnHtml = `<button class="badge badge-success" style="border:none; cursor:pointer;" onclick="updateEvStatus(${e.id}, 'PENDING')" title="Click to mark Pending">APPROVED</button>`;
                                    } else if (statusText === 'REJECTED') {
                                        statusBtnHtml = `<button class="badge badge-danger" style="border:none; cursor:pointer;" onclick="updateEvStatus(${e.id}, 'PENDING')" title="Click to mark Pending">REJECTED</button>`;
                                    } else if (statusText === 'COMPLETED') {
                                        statusBtnHtml = `<button class="badge badge-secondary" style="border:none; cursor:pointer;" ${!isEventCompleted(e.date, e.time) ? `onclick="updateEvStatus(${e.id}, 'APPROVED')"` : 'disabled'} title="Restore to Active">COMPLETED</button>`;
                                    }

                                    return `
                                    <tr>
                                        <td data-label="Event Title">
                                            <div>
                                                <div style="font-weight:500;">${e.title}</div>
                                                <div style="font-size:0.75rem; color:var(--text-muted);">${e.location}</div>
                                                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.2rem;">${e.isFree ? 'Free' : '$' + parseFloat(e.price).toFixed(2)}</div>
                                                <div style="font-size:0.75rem; color:var(--secondary); margin-top:0.2rem;"><i class="fas fa-user-tie"></i> Host: ${e.organizer ? e.organizer.name : 'Administrator'}</div>
                                                <div style="font-size:0.75rem; margin-top:0.4rem;">${statusBtnHtml}</div>
                                            </div>
                                        </td>
                                        <td data-label="Date & Time" style="white-space: nowrap;">${e.date} at ${e.time}</td>
                                        <td data-label="Action" style="white-space: nowrap;">
                                            <div style="display: flex; gap: 0.5rem; align-items: center; justify-content: flex-end;">
                                                <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size:0.8rem;" onclick="viewAttendees(${e.id})"><i class="fas fa-users" style="margin-right: 0.4rem;"></i> Attendees</button>
                                                <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size:0.8rem;" onclick="openGallery(${e.id})"><i class="fas fa-images" style="margin-right: 0.4rem;"></i> Gallery</button>
                                                <button class="btn btn-danger" style="padding: 0.3rem 0.6rem; font-size:0.8rem;" onclick="deleteEvent(${e.id}, 'admin')"><i class="fas fa-trash" style="margin-right: 0.4rem;"></i> Drop</button>
                                            </div>
                                        </td>
                                    </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        contentDiv.innerHTML = html;

        // Populate Admin Payment History Modal
        const paymentHistoryThead = document.getElementById('payment-history-thead');
        paymentHistoryThead.innerHTML = `
            <tr style="border-bottom: 1px solid var(--border);">
                <th style="padding: 1rem; text-align: center; color: var(--text-muted); min-width: 200px;">Event</th>
                <th style="padding: 1rem; text-align: center; color: var(--text-muted); min-width: 150px;">Attendee</th>
                <th style="padding: 1rem; text-align: center; color: var(--text-muted); white-space: nowrap;">Transaction Date</th>
                <th style="padding: 1rem; text-align: center; color: var(--text-muted); white-space: nowrap;">Amount Paid</th>
                <th style="padding: 1rem; text-align: center; color: var(--text-muted); white-space: nowrap;">Status</th>
            </tr>
        `;

        const paymentHistoryTbody = document.getElementById('payment-history-table-body');
        let paymentRowsHtml = '';

        await Promise.all(events.map(async (ev) => {
            if (!ev.isFree) {
                const attendeesRows = await DB.getEventAttendees(ev.id);
                const activeAttendees = attendeesRows.filter(a => a.status !== 'CANCELLED');
                
                activeAttendees.forEach(attendee => {
                    paymentRowsHtml += `
                    <tr>
                        <td data-label="Event">
                            <div style="font-weight:600;">${ev.title}</div>
                        </td>
                        <td data-label="Attendee">
                            <div>
                                <div style="font-weight:500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;">${attendee.user ? attendee.user.name : 'Unknown User'}</div>
                                <div style="font-size: 0.8rem; color: var(--text-muted); word-break: break-all;">${attendee.user ? attendee.user.email : ''}</div>
                            </div>
                        </td>
                        <td data-label="Transaction Date" style="white-space: nowrap;">${ev.date}</td>
                        <td data-label="Amount Paid" style="font-weight:bold; color:var(--success); white-space: nowrap;">$${parseFloat(ev.price).toFixed(2)}</td>
                        <td data-label="Status" style="white-space: nowrap;"><span class="badge badge-success"><i class="fas fa-check-circle" style="margin-right:0.2rem;"></i> Success</span></td>
                    </tr>
                    `;
                });
            }
        }));

        if (paymentRowsHtml === '') {
            paymentHistoryTbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted" style="padding:2rem;">No platform transactions found.</td></tr>';
        } else {
            paymentHistoryTbody.innerHTML = paymentRowsHtml;
        }
    };

    window.deleteUser = async (userId) => {
        if(confirm("Remove this user permanently?")) {
            await DB.deleteUser(userId);
            showToast('User removed system-wide.', 'success');
            await renderAdminDashboard();
        }
    };

    window.openUserModal = async (id = null) => {
        const form = document.getElementById('user-form');
        if (form) form.reset();
        document.getElementById('user-modal-title').innerText = id ? 'Edit User Credentials' : 'Add New System User';
        document.getElementById('user-id').value = id || '';
        
        if (id) {
            const users = await DB.getUsers();
            const user = users.find(u => u.id === id);
            if (user) {
                document.getElementById('user-name').value = user.name;
                document.getElementById('user-email').value = user.email;
                const phoneEl = document.getElementById('user-phone');
                if(phoneEl) phoneEl.value = user.phone || '';
                document.getElementById('user-password').value = user.password;
                document.getElementById('user-role').value = user.role;
            }
        }
        document.getElementById('user-modal').classList.add('active');
    };


    
    // MODAL LOGIC (Global)
    

    document.getElementById('create-event-close').addEventListener('click', () => {
        document.getElementById('create-event-modal').classList.remove('active');
    });

    const galleryClose = document.getElementById('gallery-close');
    if (galleryClose) {
        galleryClose.addEventListener('click', () => {
            document.getElementById('gallery-modal').classList.remove('active');
        });
    }
    
    const evTypeDropdown = document.getElementById('ev-type');
    if (evTypeDropdown) {
        evTypeDropdown.addEventListener('change', (e) => {
            const priceContainer = document.getElementById('ev-price-container');
            if (e.target.value === 'PAID') {
                priceContainer.style.display = 'block';
                document.getElementById('ev-price').required = true;
            } else {
                priceContainer.style.display = 'none';
                document.getElementById('ev-price').required = false;
            }
        });
    }

    document.getElementById('attendees-close').addEventListener('click', () => {
        document.getElementById('attendees-modal').classList.remove('active');
    });
    const userModalClose = document.getElementById('user-modal-close');
    if (userModalClose) {
        userModalClose.addEventListener('click', () => {
            document.getElementById('user-modal').classList.remove('active');
        });
    }
    const editProfileClose = document.getElementById('edit-profile-close');
    if (editProfileClose) {
        editProfileClose.addEventListener('click', () => {
            document.getElementById('edit-profile-modal').classList.remove('active');
        });
    }
    const paymentClose = document.getElementById('payment-close');
    if (paymentClose) {
        paymentClose.addEventListener('click', () => {
            document.getElementById('payment-modal').classList.remove('active');
        });
    }

    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btn-pay-submit');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';
            btn.disabled = true;

            setTimeout(async () => {
                const res = await DB.bookEvent(pendingPaymentEventId, session.id);
                btn.innerHTML = originalText;
                btn.disabled = false;
                
                if(res.success) {
                    showToast('Payment successful! Ticket booked.', 'success');
                    document.getElementById('payment-modal').classList.remove('active');
                    paymentForm.reset();
                    await renderUserDashboard();
                } else {
                    showToast(res.message, 'error');
                }
            }, 2000);
        });
    }

    let pendingProfileImage = session.profileImage || null;
    
    const fileInput = document.getElementById('edit-profile-image');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const MAX_SIZE = 250;
                        let width = img.width;
                        let height = img.height;

                        if (width > height) {
                            if (width > MAX_SIZE) {
                                height *= MAX_SIZE / width;
                                width = MAX_SIZE;
                            }
                        } else {
                            if (height > MAX_SIZE) {
                                width *= MAX_SIZE / height;
                                height = MAX_SIZE;
                            }
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        pendingProfileImage = canvas.toDataURL('image/jpeg', 0.8);
                        document.getElementById('edit-profile-preview').innerHTML = `<img src="${pendingProfileImage}" style="width:100%; height:100%; object-fit:cover;">`;
                    };
                    img.src = ev.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const editProfileForm = document.getElementById('edit-profile-form');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const newName = document.getElementById('edit-profile-name').value;
            const newPhone = document.getElementById('edit-profile-phone').value;
            const newPassword = document.getElementById('edit-profile-password').value || session.password;
            
            const res = await DB.updateUser(session.id, newName, session.email, newPassword, session.role, newPhone, pendingProfileImage);
            if (res.success) {
                showToast('Profile updated successfully!', 'success');
                document.getElementById('edit-profile-modal').classList.remove('active');
                setTimeout(() => window.location.reload(), 1000); 
            } else {
                showToast(res.message, 'error');
            }
        });
    }

    const accountSettingsForm = document.getElementById('account-settings-form');
    if (accountSettingsForm) {
        // Load initial state
        const notifSetting = localStorage.getItem('email_notifications') !== 'false'; // default true
        const notifCheckbox = document.getElementById('setting-notifications');
        if (notifCheckbox) notifCheckbox.checked = notifSetting;

        accountSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const checked = document.getElementById('setting-notifications').checked;
            localStorage.setItem('email_notifications', checked);
            showToast('Account settings saved successfully!', 'success');
            document.getElementById('account-settings-modal').classList.remove('active');
        });
    }

    const btnDeleteAccount = document.getElementById('btn-delete-account');
    if (btnDeleteAccount) {
        btnDeleteAccount.addEventListener('click', async () => {
            if (confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
                await DB.deleteUser(session.id);
                showToast("Account deleted successfully.", "success");
                setTimeout(() => {
                    DB.logout();
                    window.location.href = 'index.html';
                }, 1500);
            }
        });
    }



    document.getElementById('create-event-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('ev-title').value;
        const desc = document.getElementById('ev-desc').value;
        const date = document.getElementById('ev-date').value;
        const time = document.getElementById('ev-time').value;
        const loc = document.getElementById('ev-location').value;
        const cap = parseInt(document.getElementById('ev-capacity').value);
        
        const isFree = document.getElementById('ev-type').value === 'FREE';
        let price = 0.0;
        if (!isFree) {
            price = parseFloat(document.getElementById('ev-price').value) || 0.0;
        }

        await DB.createEvent(title, desc, date, time, loc, cap, isFree, price, session.id);
        
        showToast('Event published successfully!', 'success');
        document.getElementById('create-event-modal').classList.remove('active');
        document.getElementById('create-event-form').reset();
        
        if(session.role === 'ORGANIZER') await renderOrganizerDashboard();
        if(session.role === 'ADMIN') await renderAdminDashboard();
    });

    const userForm = document.getElementById('user-form');
    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('user-id').value;
            const name = document.getElementById('user-name').value;
            const email = document.getElementById('user-email').value;
            const phoneEl = document.getElementById('user-phone');
            const userPhone = phoneEl ? phoneEl.value : '';
            const password = document.getElementById('user-password').value;
            const role = document.getElementById('user-role').value;

            if (id) {
                // Keep the existing profile image if it exists when Admin updates user
                const users = await DB.getUsers();
                const existing = users.find(u => u.id === parseInt(id));
                const pImage = existing ? existing.profileImage : null;
                
                const res = await DB.updateUser(parseInt(id), name, email, password, role, userPhone, pImage);
                if (res.success) {
                    showToast('User profile updated!', 'success');
                    document.getElementById('user-modal').classList.remove('active');
                    await renderAdminDashboard();
                } else {
                    showToast(res.message, 'error');
                }
            } else {
                const res = await DB.register(name, email, password, role, userPhone);
                if (res.success) {
                    showToast('User added to the platform!', 'success');
                    document.getElementById('user-modal').classList.remove('active');
                    await renderAdminDashboard();
                } else {
                    showToast(res.message, 'error');
                }
            }
        });
    }

    window.currentSearchQuery = '';
    let searchTimeout;
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(async () => {
                window.currentSearchQuery = e.target.value.toLowerCase();
                if (session.role === 'USER') await renderUserDashboard();
                else if (session.role === 'ORGANIZER') await renderOrganizerDashboard();
                else if (session.role === 'ADMIN') await renderAdminDashboard();
            }, 300);
        });
    }

    // Bootstrapping the correct view
    if (session.role === 'USER') {
        await renderUserDashboard();
    } else if (session.role === 'ORGANIZER') {
        await renderOrganizerDashboard();
    } else if (session.role === 'ADMIN') {
        await renderAdminDashboard();
    }
});
