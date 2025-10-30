# Report Viewer Integration - Complete Documentation

## 🎯 Overview
Separated PDF/Report viewing functionality into a dedicated **ReportViewerController** for better code organization and maintainability.

---

## 📁 Project Structure

### Backend Controllers

#### 1. **ReportViewerController.java** (NEW)
**Path:** `src/main/java/com/rwtool/controller/ReportViewerController.java`
**Base URL:** `/api/reports`

**Endpoints:**
- `GET /api/reports/preview` - Stream reports for inline viewing
- `GET /api/reports/metadata` - Get report metadata (size, type, etc.)

**Purpose:** Handles all report viewing/preview operations

#### 2. **FileDownloadController.java** (EXISTING)
**Path:** `src/main/java/com/rwtool/controller/FileDownloadController.java`
**Base URL:** `/api/files`

**Endpoints:**
- `GET /api/files/download` - Download files as attachments

**Purpose:** Handles file downloads only

---

### Frontend Services

#### 3. **reportViewerService.js** (NEW)
**Path:** `src/services/reportViewerService.js`

**Methods:**
```javascript
// Get preview URL for iframe
getPreviewUrl(folder, fileName)

// Get report metadata
getReportMetadata(folder, fileName)

// Get download URL
getDownloadUrl(folder, fileName)
```

**Purpose:** Centralized API service for report viewing operations

---

### Frontend Components

#### 4. **PDFViewer.js** (UPDATED)
**Path:** `src/Pages/SubscriberPage/PDFViewer/PDFViewer.js`

**Props:**
- `fileName` - Name of the file
- `folderPath` - Folder/domain path
- `displayName` - Display name for UI
- `onBack` - Callback function for back navigation

**Features:**
- Loads PDFs using `reportViewerService.getPreviewUrl()`
- Downloads using `reportViewerService.getDownloadUrl()`
- Loading states
- Error handling
- Fullscreen support

#### 5. **DownloadReportComponent.js** (UPDATED)
**Path:** `src/Pages/SubscriberPage/DownloadReport/DownloadReportComponent.js`

**Integration:**
```javascript
// Preview button passes complete report object
onClick={() => setSelectedFile(r)}

// PDFViewer receives proper props
<PDFViewer 
    fileName={selectedFile.fileName} 
    folderPath={selectedFile.folderPath}
    displayName={selectedFile.title}
    onBack={() => setSelectedFile(null)} 
/>
```

---

## 🔄 Complete Workflow

### 1. User Journey
```
DownloadReportComponent
    ↓ (User clicks "Preview Report")
PDFViewer Component
    ↓ (Calls reportViewerService)
ReportViewerController (/api/reports/preview)
    ↓ (Streams file)
Browser displays PDF in iframe
```

### 2. API Flow
```
Frontend                    Service                     Backend
--------                    -------                     -------
PDFViewer.js  →  reportViewerService.js  →  ReportViewerController.java
                                            ↓
                                    File System (baseDir/reports/folder/file)
```

---

## 🚀 Benefits of Separation

### ✅ Better Organization
- **ReportViewerController** - Handles viewing/preview operations
- **FileDownloadController** - Handles download operations
- Clear separation of concerns

### ✅ Maintainability
- Each controller has a specific responsibility
- Easier to add new features (e.g., report annotations, watermarks)
- Service layer abstracts API calls

### ✅ Scalability
- Can add more report-specific features:
  - Report versioning
  - Report sharing
  - Report analytics
  - Access logging

### ✅ Testability
- Controllers can be tested independently
- Service layer can be mocked easily

---

## 📋 API Endpoints Summary

| Endpoint | Controller | Purpose | Content-Disposition |
|----------|-----------|---------|---------------------|
| `/api/reports/preview` | ReportViewerController | View in browser | `inline` |
| `/api/reports/metadata` | ReportViewerController | Get file info | N/A |
| `/api/files/download` | FileDownloadController | Download file | `attachment` |

---

## 🔧 Configuration Required

### application.properties
```properties
# Base directory for file storage
app.storage.local.baseDir=/path/to/storage

# File structure: {baseDir}/reports/{folder}/{fileName}
```

### CORS Configuration
Both controllers allow `http://localhost:3000` for development.

---

## 🎨 Frontend Integration

### Using the Service
```javascript
import reportViewerService from '../../../services/reportViewerService';

// Get preview URL
const previewUrl = reportViewerService.getPreviewUrl('Finance', 'report.pdf');

// Get download URL
const downloadUrl = reportViewerService.getDownloadUrl('Finance', 'report.pdf');

// Get metadata
const metadata = await reportViewerService.getReportMetadata('Finance', 'report.pdf');
```

---

## 🧪 Testing Checklist

- [ ] Backend running on `localhost:8080`
- [ ] `app.storage.local.baseDir` configured
- [ ] PDF files placed in `{baseDir}/reports/{folder}/` structure
- [ ] User has access permissions to folder
- [ ] Click "Preview Report" in DownloadReportComponent
- [ ] PDF loads in PDFViewer
- [ ] Download button works
- [ ] Back button returns to report list
- [ ] Fullscreen toggle works

---

## 🔮 Future Enhancements

### Potential Features
1. **Report Annotations** - Add comments/highlights to PDFs
2. **Report Sharing** - Share reports with other users
3. **Report History** - Track who viewed what and when
4. **Report Watermarking** - Dynamic watermarks with user info
5. **Report Conversion** - Convert between formats
6. **Report Thumbnails** - Generate preview thumbnails
7. **Report Search** - Full-text search within PDFs

---

## 📝 Notes

- **Security:** Both controllers use the same base directory and security model
- **Performance:** Files are streamed, not loaded into memory
- **Browser Support:** Uses native browser PDF viewer (no external libraries)
- **File Types:** Supports PDF, Excel, Word, CSV, and text files

---

## 🎉 Summary

✅ Created **ReportViewerController** for report viewing operations  
✅ Kept **FileDownloadController** for download operations  
✅ Added **reportViewerService** for centralized API calls  
✅ Updated **PDFViewer** to use new service  
✅ Clean separation of concerns  
✅ Scalable and maintainable architecture  

**Result:** Better organized, more maintainable, and ready for future enhancements! 🚀
