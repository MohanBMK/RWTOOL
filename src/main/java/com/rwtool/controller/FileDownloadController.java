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
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000")
public class FileDownloadController {

    @Value("${app.storage.local.baseDir:}")
    private String localBaseDir;

    /**
     * Download a file from a specific folder
     * @param folder - folder name (e.g., "Finance", "Compliance")
     * @param fileName - file name
     */
    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFile(
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
            String contentType = "application/octet-stream";
            if (fileName.endsWith(".pdf")) {
                contentType = "application/pdf";
            } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
                contentType = "application/vnd.ms-excel";
            } else if (fileName.endsWith(".docx")) {
                contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            } else if (fileName.endsWith(".csv")) {
                contentType = "text/csv";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}