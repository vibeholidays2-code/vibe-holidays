# Gallery API Endpoints

## Public Endpoints

### GET /api/gallery
Get all gallery images with optional filtering and pagination.

**Query Parameters:**
- `category` (optional): Filter by category
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "url": "string",
      "category": "string",
      "caption": "string",
      "destination": "string",
      "order": 0,
      "createdAt": "date"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### GET /api/gallery/:category
Get all gallery images for a specific category.

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

## Protected Admin Endpoints

### POST /api/admin/gallery
Upload a new gallery image (requires authentication).

**Headers:**
- `Authorization: Bearer <token>`

**Body (multipart/form-data):**
- `image` (file, required): Image file (JPEG, PNG, GIF, WebP, max 5MB)
- `category` (string, required): Image category
- `caption` (string, optional): Image caption
- `destination` (string, optional): Destination name
- `order` (number, optional): Display order (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "url": "/uploads/filename.jpg",
    "category": "string",
    "caption": "string",
    "destination": "string",
    "order": 0,
    "createdAt": "date"
  },
  "message": "Image uploaded successfully"
}
```

### PUT /api/admin/gallery/:id
Update gallery image metadata (requires authentication).

**Headers:**
- `Authorization: Bearer <token>`

**Body (JSON):**
```json
{
  "category": "string",
  "caption": "string",
  "destination": "string",
  "order": 0
}
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Gallery image updated successfully"
}
```

### DELETE /api/admin/gallery/:id
Delete a gallery image (requires authentication).

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Gallery image deleted successfully"
}
```

## File Upload Configuration

- **Allowed file types:** JPEG, JPG, PNG, GIF, WebP
- **Maximum file size:** 5MB
- **Storage location:** `/uploads` directory
- **Filename format:** `originalname-timestamp-random.ext`

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "category",
      "message": "Category is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Gallery image not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An error occurred while processing your request."
}
```
