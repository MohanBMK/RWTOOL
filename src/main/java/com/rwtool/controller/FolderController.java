
package com.rwtool.controller;

import com.rwtool.service.FolderService;
import com.rwtool.service.UserGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

        import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/folders")
@CrossOrigin(origins = "http://localhost:3000")
public class FolderController {

    @Autowired
    private FolderService folderService;

    @Autowired
    private UserGroupService userGroupService;

    /**
     * Get all folders in the reports directory
     * Used by admin in UserGroupAccess to select folders
     */
    @GetMapping
    public ResponseEntity<List<String>> listReportFolders() {
        try {
            List<String> folders = folderService.listReportFolders();
            return ResponseEntity.ok(folders);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Get files from a specific folder
     */
    @GetMapping("/{folderName}/files")
    public ResponseEntity<List<Map<String, Object>>> listFilesInFolder(@PathVariable String folderName) {
        try {
            List<Map<String, Object>> files = folderService.listFilesInFolder(folderName);
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Get all files accessible by a user (based on their group memberships)
     * Used by DownloadReportComponent to show only files user has access to
     */
    @GetMapping("/user/{email}/files")
    public ResponseEntity<List<Map<String, Object>>> getUserAccessibleFiles(@PathVariable String email) {
        try {
            // Get user's accessible folders
            List<String> folders = userGroupService.getUserAccessibleFolders(email);

            // Get all files from those folders
            List<Map<String, Object>> files = folderService.listFilesFromFolders(folders);

            return ResponseEntity.ok(files);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}