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
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

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

    /**
     * Download multiple files as a single ZIP
     * Request body example: { "files": [ {"folder":"Finance","fileName":"a.pdf"}, {"folder":"HR","fileName":"b.pdf"} ], "zipName": "reports.zip" }
     */
    @PostMapping("/download/batch")
    public ResponseEntity<byte[]> downloadBatch(@RequestBody Map<String, Object> body) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, String>> files = (List<Map<String, String>>) body.get("files");
            String zipName = (String) body.getOrDefault("zipName", "reports.zip");

            if (files == null || files.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            try (ZipOutputStream zos = new ZipOutputStream(baos)) {
                for (Map<String, String> f : files) {
                    String folder = f.get("folder");
                    String fileName = f.get("fileName");
                    if (folder == null || fileName == null) continue;

                    Path filePath = Paths.get(localBaseDir)
                            .resolve("reports")
                            .resolve(folder)
                            .resolve(fileName)
                            .normalize();
                    Resource resource = new UrlResource(filePath.toUri());
                    if (!resource.exists() || !resource.isReadable()) continue;

                    ZipEntry entry = new ZipEntry(folder + "/" + fileName);
                    zos.putNextEntry(entry);
                    try (InputStream is = resource.getInputStream()) {
                        is.transferTo(zos);
                    }
                    zos.closeEntry();
                }
            }

            byte[] zipBytes = baos.toByteArray();
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + zipName + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                    .header(HttpHeaders.PRAGMA, "no-cache")
                    .header(HttpHeaders.EXPIRES, "0")
                    .body(zipBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}