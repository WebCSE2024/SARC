# SARC BACKEND
## Overview
The Backend is for the SARC website of CSE society,IIT ISM Dhanbad. All the related logics can be found inside the SERVER folder.
The backend is built with NodeJs, ExpressJs, MongoDB as database and Redis as cache database, cloudinary as cloud storage for images and pdfs uploaded and docker . 

## User Types and Verification
There are 3-types of users Proffesors, Students and Alumni. For now we have taken some random user data (stored in "randomdata" folder) and also they are in MongoDB .
For now the user is set through "setUser", a middleware that can be replaced by a authentication middleware with CSES authentication and LinkedIn verification.

## Features
There are mostly 3 features as of now.

### Events
The events can be published by PROFESSORS(Admin). The events can be created by giving title, a description, registration URL, Person-in-charge and an event bg-image(optional). Event will be created with a   
eventid(not the mongoodb object-id). The events can be listed, the data about a particular event with its eventid can be extracted and can be deleted.

### Referrals
Referrals can be published by ALUMNI with informations like job-profile, company, deadline of application and eligibility. The referral will be created with a referral-id.  All the referral releted jobs like
list-down all referrals, apply referral(for students only), get-referraldetails with applicants(for the publisher), get-my-referrallist(for publisher) and delete referral(for publisher)can be done with request
to specified routes.

### Publications
Publications can be published by PROFESSORS. It is just a upload of the pdf and specify the number of pages to be displayed. The frontend will extract those pages, make a new-pdf (these can be done using
pdf-lib) and send to backend. All the above  discussed CRUD operations can be done with publications also with specified routes with the publication-id (if required).

## Custom classes for Errors and Responses
Custom classes ApiError and ApiResponse are created for the server in utils. ApiError is just a class extended from JS Error class and Error-handler middleware at the end catches all the error and convert 
them to a reponse to return. AsynchHandler is a higher-order function that does the async function jobs of try-catch. So no need of try-catch in the controllers.

# Routes


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




