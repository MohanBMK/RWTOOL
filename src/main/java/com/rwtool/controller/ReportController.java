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
import java.util.HashMap;
import java.util.Map;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    @Value("${app.storage.local.baseDir:}")
    private String localBaseDir;

    /**
     * Get report metadata by ID
     * @param id - report ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getReport(@PathVariable String id) {
        Map<String, Object> meta = new HashMap<>();
        meta.put("id", id);
        meta.put("message", "Report metadata endpoint");
        return ResponseEntity.ok(meta);
    }

    /**
     * Presign endpoint for viewing PDF files
     * This returns a URL that can be used to stream/view the PDF
     * @param id - report ID (not used in current implementation, but kept for future use)
     * @param body - request body containing folder and fileName
     */
    @PostMapping("/{id}/presign")
    public ResponseEntity<Map<String, Object>> presignView(
            @PathVariable String id,
            @RequestBody Map<String, Object> body) {

        Map<String, Object> res = new HashMap<>();

        try {
            // Extract folder and fileName from request body
            String folder = (String) body.get("folder");
            String fileName = (String) body.get("fileName");

            if (folder == null || fileName == null) {
                res.put("message", "Missing folder or fileName in request");
                return ResponseEntity.badRequest().body(res);
            }

            // Construct the preview URL that points to our streaming endpoint (URL-encode params)
            String previewUrl = String.format(
                    "http://localhost:8080/reports/stream?folder=%s&fileName=%s",
                    URLEncoder.encode(folder, StandardCharsets.UTF_8),
                    URLEncoder.encode(fileName, StandardCharsets.UTF_8)
            );

            res.put("url", previewUrl);
            return ResponseEntity.ok(res);

        } catch (Exception e) {
            res.put("message", "Error generating preview URL: " + e.getMessage());
            return ResponseEntity.internalServerError().body(res);
        }
    }

    /**
     * Stream PDF file for inline viewing
     * This endpoint serves the actual PDF file with inline disposition
     * @param folder - folder name
     * @param fileName - file name
     */
    @GetMapping("/stream")
    public ResponseEntity<Resource> streamFile(
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

            // Determine content type
            String contentType = "application/pdf";
            if (!fileName.toLowerCase().endsWith(".pdf")) {
                contentType = "application/octet-stream";
            }

            // Use inline disposition for preview (not attachment)
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
}