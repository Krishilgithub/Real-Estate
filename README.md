# React Native Real Estate App

## Database Structure (Appwrite)

### Collections

1. **users**

   - Fields:
     - `$id` (string, auto-generated)
     - `name` (string)
     - `email` (string)
     - `prefs` (object)
       - `userType`: "buyer" | "seller" | "guest"
     - `createdAt` (datetime)
     - `updatedAt` (datetime)

2. **properties**

   - Fields:
     - `$id` (string, auto-generated)
     - `title` (string)
     - `description` (string)
     - `price` (number)
     - `location` (string)
     - `images` (array of strings)
     - `sellerId` (string, references users.$id)
     - `status` (string): "available" | "sold" | "pending"
     - `createdAt` (datetime)
     - `updatedAt` (datetime)

3. **bookings**
   - Fields:
     - `$id` (string, auto-generated)
     - `propertyId` (string, references properties.$id)
     - `buyerId` (string, references users.$id)
     - `sellerId` (string, references users.$id)
     - `startDate` (datetime)
     - `endDate` (datetime)
     - `status` (string): "pending" | "confirmed" | "cancelled"
     - `createdAt` (datetime)
     - `updatedAt` (datetime)

### Authentication Flow

1. **User Registration**

   - User selects role (buyer/seller/guest)
   - Google OAuth authentication
   - User preferences updated with role
   - Redirected to appropriate dashboard

2. **User Login**

   - Google OAuth authentication
   - Session creation
   - User role verification
   - Redirected to appropriate dashboard

3. **User Logout**
   - Session deletion
   - State reset
   - Redirect to sign-in page

### Data Flow

1. **Property Management**

   - Sellers can:
     - Create new properties
     - Update property details
     - View their listings
     - Manage bookings

2. **Booking System**

   - Buyers can:
     - View available properties
     - Make bookings
     - View booking history
   - Sellers can:
     - View incoming bookings
     - Accept/reject bookings
     - Manage property status

3. **User Roles**
   - **Buyer**
     - Can view properties
     - Can make bookings
     - Can view booking history
   - **Seller**
     - Can create properties
     - Can manage listings
     - Can handle bookings
   - **Guest**
     - Can view properties
     - Cannot make bookings
     - Limited access

### Security Rules

1. **Authentication**

   - All users must be authenticated
   - Guest users have limited access
   - Session management for security

2. **Authorization**

   - Sellers can only manage their own properties
   - Buyers can only manage their own bookings
   - Guests can only view public data

3. **Data Access**
   - Properties are publicly readable
   - Bookings are only visible to involved parties
   - User data is protected

### Error Handling

1. **Authentication Errors**

   - Session expiration
   - Invalid credentials
   - Missing permissions

2. **Data Validation**

   - Required fields
   - Data type validation
   - Relationship validation

3. **State Management**
   - Loading states
   - Error states
   - Success states

### API Endpoints

1. **Authentication**

   - POST /auth/login
   - POST /auth/logout
   - GET /auth/current-user

2. **Properties**

   - GET /properties
   - POST /properties
   - PUT /properties/:id
   - DELETE /properties/:id

3. **Bookings**
   - GET /bookings
   - POST /bookings
   - PUT /bookings/:id
   - DELETE /bookings/:id

### State Management

1. **Global Context**

   - User authentication state
   - User role management
   - Loading states
   - Error handling

2. **Local State**
   - Form data
   - UI states
   - Component-specific data

### Navigation Flow

1. **Authentication Routes**

   - /sign-in
   - /sign-up

2. **Main Routes**

   - / (Home)
   - /properties
   - /bookings
   - /profile

3. **Role-Specific Routes**
   - /seller/dashboard
   - /buyer/dashboard
   - /guest/home
