# SARC Backend

## Overview
The SARC backend is designed for the CSE Society website of IIT (ISM) Dhanbad. All backend logic is implemented within the `SERVER` folder. The system is built using **Node.js**, **Express.js**, and **MongoDB** for database management. Additionally, **Redis** is used for caching, **Cloudinary** handles cloud storage for images and PDFs, and the application is containerized using **Docker** for seamless deployment.

## User Roles & Authentication

### User Types
The system supports three types of users:

- **Professors**
- **Students**
- **Alumni**

### Authentication
Currently, user data is stored in MongoDB, with sample datasets available in the `randomdata` folder. Authentication is handled through a middleware called `setUser`, which can be replaced with a robust authentication mechanism using **CSES authentication** and **LinkedIn verification**.

## Features

### Events
- **Created by:** Professors (Admins)
- Professors can publish events by providing:
  - Title
  - Description
  - Registration URL
  - Person-in-Charge (FIC)
  - Optional event background image
- Each event is assigned a **unique event ID** (not MongoDB’s ObjectId).
- Supported operations:
  - Create an event
  - Retrieve all events
  - Get event details by ID
  - Delete an event

### Referrals
- **Created by:** Alumni
- Alumni can publish job referrals with:
  - Job profile
  - Company
  - Application deadline
  - Eligibility criteria
- Supported operations:
  - List all referrals
  - Apply for referrals (students only)
  - Get referral details (for publisher)
  - Fetch publisher’s referrals
  - Delete referral (for publisher)

### Publications
- **Created by:** Professors
- Professors can upload **PDF publications**, specifying the number of pages to be displayed.
- The frontend extracts the specified pages using **PDF-lib**, generates a new PDF, and sends it to the backend.
- Supported operations:
  - Upload a publication
  - List all publications
  - Retrieve a publication
  - Delete a publication

## Error Handling & Custom Response Classes

### ApiError
- A custom error-handling class extending JavaScript's built-in `Error` class.
- Works with a centralized **Error Handler Middleware**, which catches and formats all errors before sending responses.

### ApiResponse
- A structured response format to ensure consistency across API responses.

### AsyncHandler
- A higher-order function to handle asynchronous operations without the need for repetitive `try-catch` blocks in controllers.


# Publication API Endpoints

## 1. Create a Publication

**Endpoint:** `POST /api/publications/create-publication`

**Headers:**

- `Authorization: Bearer <token>` (Required)

**Body Parameters (Form-Data):**

- `publication_pdf` (File, Required): The PDF file to upload.

**Response:**

```json
{
  "status": 200,
  "data": {
    "publicationID": "...",
    "publication-cloudinaryURL": "...",
    "publisher-details": "..."
  },
  "message": "Publication created successfully"
}
```

---

## 2. Get All Publications

**Endpoint:** `GET /api/publications/publication-list`

**Description:** Fetches a list of all available publications.

**Response:**

```json
{
  "status": 200,
  "data": [
    { 
      "publicationID": "...",
      "publication-cloudinaryURL": "...",
      "publisher-details": "..."
    }
  ],
  "message": "All publications fetched successfully"
}
```

---

## 3. Get Publication Details

**Endpoint:** `GET /api/publications/:publicationid`

**Description:** Fetches details of a specific publication.

**Path Parameters:**

- `publicationid` (String, Required): The unique ID of the publication.

**Response:**

```json
{
  "status": 200,
  "data": { 
    "publicationID": "...",
    "publication-cloudinaryURL": "...",
    "publisher-details": "..."
  },
  "message": "Publication details fetched successfully"
}
```

---

## 4. Delete a Publication

**Endpoint:** `DELETE /api/publications/delete/:publicationid`

**Description:** Allows a professor to delete their own publication.

**Headers:**

- `Authorization: Bearer <token>` (Required)

**Path Parameters:**

- `publicationid` (String, Required): The unique ID of the publication.

**Response:**

```json
{
  "status": 200,
  "data": null,
  "message": "Publication deleted successfully"
}
```

---

## 5. Get My Publications

**Endpoint:** `POST /api/publications/get-my-publications`

**Description:** Fetches all publications uploaded by the logged-in professor.

**Headers:**

- `Authorization: Bearer <token>` (Required)

**Response:**

```json
{
  "status": 200,
  "data": [
    { 
      "publicationID": "...",
      "publication-cloudinaryURL": "..."
    }
  ],
  "message": "Publication details fetched successfully"
}
```

# Referral API Endpoints

## Create a Referral

### Endpoint: `POST /api/referrals/create-referral`

### Headers:

- `Authorization: Bearer <token>` (Required)

### Body Parameters (JSON):

- `company_name` (String, Required): Name of the company.
- `deadline` (Date, Required): Application deadline.
- `eligibility` (String, Required): Eligibility criteria.
- `job_profile` (String, Required): Job profile for the referral.

### Response:

```json
{
  "status": 201,
  "data": {
    "company_name": "...",
    "job_profile": "...",
    "deadline": "...",
    "eligibility": "...",
    "referral_id": "..."
  },
  "message": "Referral created successfully"
}
```

---

## Get All Referrals

### Endpoint: `GET /api/referrals/referral-list`

### Description: Fetches a list of all available referrals.

### Response:

```json
{
  "status": 200,
  "data": [
    { 
      "company_name": "...",
      "job_profile": "...",
      "deadline": "...",
      "eligibility": "...",
      "referral_id": "..."
    }
  ],
  "message": "List of all referrals"
}
```

---

## Apply for a Referral

### Endpoint: `POST /api/referrals/apply/:referralId`

### Headers:

- `Authorization: Bearer <token>` (Required)

### Path Parameters:

- `referralId` (String, Required): The unique ID of the referral.

### Response:

```json
{
  "status": 200,
  "data": null,
  "message": "Applied successfully"
}
```

---

## Get Referral Details

### Endpoint: `GET /api/referrals/:referralId`

### Headers:

- `Authorization: Bearer <token>` (Required)

### Path Parameters:

- `referralId` (String, Required): The unique ID of the referral.

### Response:

```json
{
  "status": 200,
  "data": {
    "referral_id": "...",
    "company_name": "...",
    "job_profile": "...",
    "deadline": "...",
    "applicants": [
      {
        "full_name": "...",
        "linkedIn": "...",
        "email": "...",
        "grad_yr": "..."
      }
    ]
  },
  "message": "Data fetched successfully"
}
```

---

## Get My Referrals

### Endpoint: `GET /api/referrals/get-my-referral`

### Headers:

- `Authorization: Bearer <token>` (Required)

### Response:

```json
{
  "status": 200,
  "data": [
    { 
      "job_profile": "...",
      "deadline": "...",
      "company_name": "...",
      "eligibility": "...",
      "referral_id": "..."
    }
  ],
  "message": "Referral details fetched successfully"
}
```

---

## Delete a Referral

### Endpoint: `DELETE /api/referrals/delete/:refid`

### Headers:

- `Authorization: Bearer <token>` (Required)

### Path Parameters:

- `refid` (String, Required): The unique ID of the referral.

### Response:

```json
{
  "status": 200,
  "data": null,
  "message": "Referral deleted successfully"
}
```

# Event API Endpoints

## Create an Event

### Endpoint: `POST /api/events/create-event`

### Headers:

- `Authorization: Bearer <token>` (Required)
- `Content-Type: multipart/form-data`

### Body Parameters (Form Data):

- `title` (String, Required): Title of the event.
- `eventDate` (Date, Required): Date of the event.
- `reg_url` (String, Required): Registration URL.
- `description` (String, Required): Description of the event.
- `event_img` (File, Optional): Event image.

### Response:

```json
{
  "status": 201,
  "data": {
    "title": "...",
    "eventId": "...",
    "eventDate": "...",
    "reg_url": "...",
    "description": "...",
    "FIC": "...",
    "img_url": "..."
  },
  "message": "Event created successfully"
}
```

---

## Get All Events

### Endpoint: `GET /api/events/event-list`

### Description: Fetches a list of all available events.

### Response:

```json
{
  "status": 200,
  "data": [
    { 
      "title": "...",
      "eventDate": "...",
      "description": "...",
      "img_url": "...",
      "reg_url": "...",
      "eventId": "...",
      "FIC": {
        "full_name": "...",
        "email": "...",
        "linkedIn": "..."
      }
    }
  ],
  "message": "List of all events"
}
```

---

## Get Event Details

### Endpoint: `GET /api/events/get-event-data/:eventid`

### Path Parameters:

- `eventid` (String, Required): The unique ID of the event.

### Response:

```json
{
  "status": 200,
  "data": {
    "title": "...",
    "eventDate": "...",
    "description": "...",
    "img_url": "...",
    "reg_url": "...",
    "eventId": "...",
    "FIC": {
      "full_name": "...",
      "email": "...",
      "linkedIn": "..."
    }
  },
  "message": "Event details fetched successfully"
}
```

---

## Delete an Event

### Endpoint: `DELETE /api/events/delete-event/:eventid`

### Headers:

- `Authorization: Bearer <token>` (Required)

### Path Parameters:

- `eventid` (String, Required): The unique ID of the event.

### Response:

```json
{
  "status": 200,
  "data": null,
  "message": "Event deleted successfully"
}
```




