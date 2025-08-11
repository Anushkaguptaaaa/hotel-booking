This is a comprehensive hotel booking platform enabling travelers to reserve rooms seamlessly, while hotel owners can efficiently manage their property listings and bookings. The tech stack combines React for the frontend, Node/Express for the backend, MongoDB for persistent data, and integrates modern services for authentication, payments, and media management.

Core Functionality
User Side:

Users can browse hotels and rooms, check availability, and book rooms for specific dates and number of guests.
Payment integration is supported (with options like “Pay at Hotel” and Stripe online payments).
Users have a profile section to view and manage their bookings, including details like room type, hotel address, number of guests, amount paid, and check-in/check-out dates.

Hotel Owner Side:

Owners can register their hotel, list rooms with amenities and images, and set room prices.
A dashboard provides insights into total bookings, revenue, recent reservations, and room management.
Owners can update the status of bookings and view booking analytics.
Tech Stack
Frontend:

Built with React.js (see client/), using modern hooks and context for state management.
UI components are styled with Tailwind CSS and custom classes.
Toast notifications for user feedback (via react-hot-toast).
Responsive design supports desktop and mobile layouts.
Backend:

Node.js with Express.js for API endpoints (see server/controllers/).
MongoDB with Mongoose for data modeling (hotels, rooms, bookings, users).
Authentication uses Clerk (as noted in README).
Stripe integration for payment processing.
Cloudinary for image uploads (room photos).
Nodemailer for email notifications (used in booking flows).
Other Features:

Booking availability checks to prevent double reservations.
Admin scripts for database management and booking updates.
Dashboard analytics for hotel owners (recent bookings, total revenue, room count, etc.).

Summary
This is a comprehensive hotel booking platform enabling travelers to reserve rooms seamlessly, while hotel owners can efficiently manage their property listings and bookings. The tech stack combines React for the frontend, Node/Express for the backend, MongoDB for persistent data, and integrates modern services for authentication, payments, and media management.

