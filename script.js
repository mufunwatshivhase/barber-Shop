document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (event) {
        const targetId = this.getAttribute('href');

        if (!targetId || !targetId.startsWith('#') || targetId === '#') {
            return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate');
    elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (elementPosition < screenPosition) {
            element.classList.add('animate-in');
        }
    });
};

animateOnScroll();
window.addEventListener('scroll', animateOnScroll);

const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navbar = document.querySelector('.navbar');

const themeToggle = document.querySelector('.theme-toggle');
const appointmentPage = document.querySelector('.appointment-page');
const savedTheme = localStorage.getItem('fresh-fade-theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

const updateThemeToggle = () => {
    if (!themeToggle) {
        return;
    }

    const isDark = document.body.classList.contains('dark-theme');
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.querySelector('i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    themeToggle.querySelector('span').textContent = isDark ? 'Light' : 'Dark';

    if (appointmentPage) {
        appointmentPage.style.setProperty('background-color', isDark ? '#121212' : '#f8f9fa', 'important');
    }
};

if (themeToggle) {
    updateThemeToggle();
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('fresh-fade-theme', isDark ? 'dark' : 'light');
        updateThemeToggle();
    });
}

if (mobileMenuBtn && navbar) {
    mobileMenuBtn.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });

    document.querySelectorAll('.navbar a').forEach((link) => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
        });
    });
}

const contactForm = document.getElementById('contactForm');
const contactConfirmation = document.getElementById('contactConfirmation');
const newsletterForm = document.querySelector('.newsletter-form');
const newsletterConfirmation = document.getElementById('newsletterConfirmation');

if (contactForm && contactConfirmation) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        contactConfirmation.textContent = 'Thanks for contacting us. We will get back to you shortly.';
        contactForm.reset();
    });
}

if (newsletterForm && newsletterConfirmation) {
    newsletterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        newsletterConfirmation.textContent = 'You are subscribed to Fresh Fade Hub updates.';
        newsletterForm.reset();
    });
}

const form = document.getElementById('appointmentForm');
const hairstyleSelect = document.getElementById('hairstyle');
const barberSelect = document.getElementById('barber');
const appointmentPrice = document.getElementById('appointmentPrice');
const appointmentDate = document.getElementById('appointmentDate');
const appointmentTime = document.getElementById('appointmentTime');
const bookingConfirmation = document.querySelector('.booking-confirmation');
const calendarActions = document.querySelector('.calendar-actions');
const googleCalendarLink = document.getElementById('googleCalendarLink');
const downloadCalendar = document.getElementById('downloadCalendar');
let calendarDownloadUrl = null;

const calendarDateTime = (date, time) => `${date.replaceAll('-', '')}T${time.replace(':', '')}00`;

const escapeCalendarText = (value) => String(value)
    .replaceAll('\\', '\\\\')
    .replaceAll(';', '\\;')
    .replaceAll(',', '\\,')
    .replaceAll('\n', '\\n');

const buildCalendarEvent = (booking) => {
    const start = new Date(`${booking.date}T${booking.time}:00`);
    const end = new Date(start.getTime() + booking.duration * 60000);
    const endDate = end.toISOString().slice(0, 10);
    const endTime = end.toTimeString().slice(0, 5);
    const details = `Service: ${booking.service}\\nBarber: ${booking.barber}\\nPrice: ${booking.price}\\nCustomer: ${booking.name}\\nPhone: ${booking.phone}${booking.message ? `\\nNotes: ${booking.message}` : ''}`;

    return {
        start: calendarDateTime(booking.date, booking.time),
        end: calendarDateTime(endDate, endTime),
        title: `Fresh Fade Hub - ${booking.service}`,
        details,
        location: 'Fresh Fade Hub, Street, Gauteng, South Africa'
    };
};

if (hairstyleSelect && appointmentPrice) {
    hairstyleSelect.addEventListener('change', () => {
        const selectedOption = hairstyleSelect.options[hairstyleSelect.selectedIndex];
        appointmentPrice.value = selectedOption.dataset.price ? `R${selectedOption.dataset.price}` : '';
    });
}

if (appointmentDate) {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
    appointmentDate.min = localToday.toISOString().split('T')[0];
}

const promoModal = document.getElementById('promoModal');
const closePromo = document.getElementById('closePromo');
const promoBook = document.getElementById('promoBook');

const closePromotion = () => {
    if (!promoModal) {
        return;
    }

    promoModal.hidden = true;
    promoModal.style.display = 'none';
    localStorage.setItem('fresh-fade-promo-seen', 'true');
};

if (promoModal && closePromo) {
    if (!localStorage.getItem('fresh-fade-promo-seen')) {
        window.setTimeout(() => {
            promoModal.hidden = false;
            promoModal.style.display = 'flex';
            closePromo.focus();
        }, 1200);
    }

    closePromo.addEventListener('click', closePromotion);
    promoModal.addEventListener('click', (event) => {
        if (event.target === promoModal) {
            closePromotion();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !promoModal.hidden) {
            closePromotion();
        }
    });

    if (promoBook) {
        promoBook.addEventListener('click', closePromotion);
    }
}

const BARBER_CREDENTIALS = {
    email: 'barber@freshfadehub.co.za',
    password: 'barber123'
};

const ensureAppointments = () => {
    const saved = localStorage.getItem('fresh-fade-appointments');

    if (!saved) {
        localStorage.setItem('fresh-fade-appointments', JSON.stringify([
            {
                id: 'demo-1',
                name: 'Michael Johnson',
                email: 'michael@example.com',
                phone: '+27 82 123 4567',
                service: "Men's Haircut",
                barber: 'Thabo',
                price: 'R100',
                date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
                time: '10:00',
                duration: 60,
                message: 'Needs a clean fade.'
            },
            {
                id: 'demo-2',
                name: 'Rikhado Makhado',
                email: 'rikhado@example.com',
                phone: '+27 71 987 6543',
                service: 'Beard Grooming',
                barber: 'Mandla',
                price: 'R50',
                date: new Date(Date.now() + 172800000).toISOString().slice(0, 10),
                time: '14:30',
                duration: 45,
                message: 'Keep the beard shape trim.'
            }
        ]));
    }
};

const getAppointments = () => {
    ensureAppointments();
    try {
        return JSON.parse(localStorage.getItem('fresh-fade-appointments') || '[]');
    } catch (error) {
        return [];
    }
};

const saveAppointments = (appointments) => {
    localStorage.setItem('fresh-fade-appointments', JSON.stringify(appointments));
};

const getStoredBooking = () => {
    const booking = localStorage.getItem('fresh-fade-latest-booking');
    if (!booking) {
        return null;
    }

    try {
        return JSON.parse(booking);
    } catch (error) {
        return null;
    }
};

if (form && hairstyleSelect && barberSelect && appointmentPrice && appointmentDate && appointmentTime && bookingConfirmation) {
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const selectedOption = hairstyleSelect.options[hairstyleSelect.selectedIndex];
        const selectedDate = new Date(`${appointmentDate.value}T12:00:00`);
        const selectedMinutes = appointmentTime.value.split(':').reduce((total, part, index) => total + Number(part) * (index === 0 ? 60 : 1), 0);
        const openingMinutes = selectedDate.getDay() === 6 ? 600 : 540;
        const closingMinutes = selectedDate.getDay() === 6 ? 1020 : 1140;

        if (selectedDate.getDay() === 0) {
            bookingConfirmation.textContent = 'Please choose a Monday to Saturday appointment date.';
            return;
        }

        if (selectedMinutes < openingMinutes || selectedMinutes > closingMinutes) {
            bookingConfirmation.textContent = selectedDate.getDay() === 6
                ? 'Saturday appointments are available between 10:00 and 17:00.'
                : 'Appointments are available between 09:00 and 19:00.';
            return;
        }

        const booking = {
            id: `booking-${Date.now()}`,
            name: document.getElementById('customerName').value,
            email: document.getElementById('customerEmail').value,
            phone: document.getElementById('customerPhone').value,
            service: selectedOption.value,
            barber: barberSelect.value,
            price: appointmentPrice.value,
            date: appointmentDate.value,
            time: appointmentTime.value,
            duration: Number(selectedOption.dataset.duration || 60),
            message: document.getElementById('appointmentMessage').value
        };

        const existing = getAppointments();
        existing.push(booking);
        saveAppointments(existing);

        const calendarEvent = buildCalendarEvent(booking);
        const googleParameters = new URLSearchParams({
            action: 'TEMPLATE',
            text: calendarEvent.title,
            dates: `${calendarEvent.start}/${calendarEvent.end}`,
            details: calendarEvent.details,
            location: calendarEvent.location
        });

        const ics = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Fresh Fade Hub//Appointment//EN',
            'BEGIN:VEVENT',
            `UID:${Date.now()}-fresh-fade-hub@local`,
            `DTSTAMP:${calendarDateTime(new Date().toISOString().slice(0, 10), new Date().toTimeString().slice(0, 5))}`,
            `DTSTART:${calendarEvent.start}`,
            `DTEND:${calendarEvent.end}`,
            `SUMMARY:${escapeCalendarText(calendarEvent.title)}`,
            `DESCRIPTION:${escapeCalendarText(calendarEvent.details)}`,
            `LOCATION:${escapeCalendarText(calendarEvent.location)}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        if (calendarDownloadUrl) {
            URL.revokeObjectURL(calendarDownloadUrl);
        }

        calendarDownloadUrl = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
        downloadCalendar.href = calendarDownloadUrl;

        localStorage.setItem('fresh-fade-latest-booking', JSON.stringify(booking));
        bookingConfirmation.textContent = `Booking request received for ${booking.service} with ${booking.barber} on ${booking.date} at ${booking.time}.`;
        googleCalendarLink.href = `https://calendar.google.com/calendar/render?${googleParameters.toString()}`;
        calendarActions.hidden = false;
        form.reset();
        appointmentPrice.value = '';
    });
}

const barberLoginForm = document.getElementById('barberLoginForm');
const loginFeedback = document.getElementById('loginFeedback');

if (barberLoginForm && loginFeedback) {
    barberLoginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('barberEmail').value.trim();
        const password = document.getElementById('barberPassword').value.trim();

        if (email === BARBER_CREDENTIALS.email && password === BARBER_CREDENTIALS.password) {
            localStorage.setItem('fresh-fade-barber-auth', 'true');
            window.location.href = 'barber-dashboard.html';
            return;
        }

        loginFeedback.textContent = 'Invalid email or password. Please try again.';
        loginFeedback.style.color = '#d9534f';
    });
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('fresh-fade-barber-auth');
        window.location.href = 'barber-login.html';
    });
}

const dashboardBody = document.getElementById('appointmentsTableBody');
const totalBookings = document.getElementById('totalBookings');
const todayBookings = document.getElementById('todayBookings');
const upcomingBookings = document.getElementById('upcomingBookings');

const renderDashboard = () => {
    const isAuthenticated = localStorage.getItem('fresh-fade-barber-auth') === 'true';
    if (window.location.pathname.toLowerCase().endsWith('barber-dashboard.html') && !isAuthenticated) {
        window.location.href = 'barber-login.html';
        return;
    }

    if (!dashboardBody) {
        return;
    }

    const bookings = getAppointments();

    if (totalBookings) {
        totalBookings.textContent = String(bookings.length);
    }

    const today = new Date().toISOString().slice(0, 10);
    const upcoming = bookings.filter((booking) => booking.date >= today).length;

    if (todayBookings) {
        todayBookings.textContent = String(bookings.filter((booking) => booking.date === today).length);
    }

    if (upcomingBookings) {
        upcomingBookings.textContent = String(upcoming);
    }

    if (!bookings.length) {
        dashboardBody.innerHTML = '<tr><td colspan="7" class="empty-state">No appointments yet.</td></tr>';
        return;
    }

    dashboardBody.innerHTML = bookings.map((booking) => `
        <tr>
            <td>
                <strong>${booking.name}</strong><br>
                <span>${booking.email}</span>
            </td>
            <td>${booking.service}</td>
            <td>${booking.barber}</td>
            <td>${booking.date}</td>
            <td>${booking.time}</td>
            <td>${booking.phone}</td>
            <td>${booking.message || '—'}</td>
        </tr>
    `).join('');
};

if (window.location.pathname.toLowerCase().endsWith('barber-dashboard.html')) {
    renderDashboard();
}

const latestBooking = getStoredBooking();
if (latestBooking && window.location.pathname.toLowerCase().endsWith('barber-dashboard.html')) {
    const appointments = getAppointments();
    const alreadyExists = appointments.some((booking) => booking.id === latestBooking.id);
    if (!alreadyExists && latestBooking.id) {
        appointments.push(latestBooking);
        saveAppointments(appointments);
    }
    renderDashboard();
}
