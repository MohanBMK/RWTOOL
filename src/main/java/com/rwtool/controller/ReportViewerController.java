package com.rwtool.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportViewerController {

    @Value("${app.storage.local.baseDir:}")
    private String localBaseDir;

    /**
     * Preview/Stream a PDF or other report file for inline viewing in browser
     * This endpoint is specifically for the PDFViewer component
     * @param folder - folder name (e.g., "Finance", "Compliance")
     * @param fileName - file name
     * @return Resource with inline content disposition for browser preview
     */
    @GetMapping("/preview")
    public ResponseEntity<Resource> previewReport(
            @RequestParam String folder,
            @RequestParam String fileName) {

        try {
            // Construct file path: baseDir/reports/folder/fileName
            Path filePath = Paths.get(localBaseDir)
                    .resolve("reports")
                    .resolve(folder)
                    .resolve(fileName)
                    .normalize();

            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // Determine content type for preview
            String contentType = determineContentType(fileName);

            // Use inline disposition for preview instead of attachment
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                    .header(HttpHeaders.PRAGMA, "no-cache")
                    .header(HttpHeaders.EXPIRES, "0")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get report metadata (optional - for future enhancements)
     * @param folder - folder name
     * @param fileName - file name
     * @return Report metadata like size, last modified, etc.
     */
    @GetMapping("/metadata")
    public ResponseEntity<?> getReportMetadata(
            @RequestParam String folder,
            @RequestParam String fileName) {

        try {
            Path filePath = Paths.get(localBaseDir)
                    .resolve("reports")
                    .resolve(folder)
                    .resolve(fileName)
                    .normalize();

            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // You can add more metadata here
            var metadata = new java.util.HashMap<String, Object>();
            metadata.put("fileName", fileName);
            metadata.put("folder", folder);
            metadata.put("size", resource.contentLength());
            metadata.put("contentType", determineContentType(fileName));
            metadata.put("exists", true);

            return ResponseEntity.ok(metadata);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Helper method to determine content type based on file extension
     */
    private String determineContentType(String fileName) {
        if (fileName.endsWith(".pdf")) {
            return "application/pdf";
        } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
            return "application/vnd.ms-excel";
        } else if (fileName.endsWith(".docx")) {
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else if (fileName.endsWith(".csv")) {
            return "text/csv";
        } else if (fileName.endsWith(".txt")) {
            return "text/plain";
        }
        return "application/octet-stream";
    }
}
