package com.rwtool.controller;

import com.rwtool.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:3000")
public class FavoritesController {

    private final FavoriteService favoriteService;

    public FavoritesController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    /**
     * List favorites for a user
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> listFavorites(@RequestParam String userId) {
        Set<String> favs = favoriteService.list(userId);
        // map back to objects of {folder, fileName}
        List<Map<String, String>> items = favs.stream().map(k -> {
            String[] parts = k.split("\\|", 2);
            Map<String, String> m = new HashMap<>();
            m.put("folder", parts.length > 0 ? parts[0] : "");
            m.put("fileName", parts.length > 1 ? parts[1] : "");
            return m;
        }).toList();
        Map<String, Object> res = new HashMap<>();
        res.put("favorites", items);
        return ResponseEntity.ok(res);
    }

    /**
     * Add a file to user's favorites
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> addFavorite(@RequestBody Map<String, Object> body) {
        String userId = (String) body.get("userId");
        String folder = (String) body.get("folder");
        String fileName = (String) body.get("fileName");
        Map<String, Object> res = new HashMap<>();
        if (userId == null || folder == null || fileName == null) {
            res.put("message", "Missing userId, folder or fileName");
            return ResponseEntity.badRequest().body(res);
        }
        favoriteService.add(userId, folder, fileName);
        res.put("status", "ok");
        return ResponseEntity.ok(res);
    }

    /**
     * Remove a file from user's favorites
     */
    @DeleteMapping
    public ResponseEntity<Map<String, Object>> removeFavorite(@RequestBody Map<String, Object> body) {
        String userId = (String) body.get("userId");
        String folder = (String) body.get("folder");
        String fileName = (String) body.get("fileName");
        Map<String, Object> res = new HashMap<>();
        if (userId == null || folder == null || fileName == null) {
            res.put("message", "Missing userId, folder or fileName");
            return ResponseEntity.badRequest().body(res);
        }
        favoriteService.remove(userId, folder, fileName);
        res.put("status", "ok");
        return ResponseEntity.ok(res);
    }
}