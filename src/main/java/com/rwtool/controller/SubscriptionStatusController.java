package subscriptionStatus.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/subscriptions")
@CrossOrigin(origins = "http://localhost:3000")
public class SubscriptionStatusController {

    @Autowired
    private JdbcTemplate jdbcTemplate;


    @GetMapping
    public List<Map<String, Object>> getSubscriptionsByStatus(@RequestParam(required = false) String status) {
        if (status == null || status.isEmpty()) {
            String sql = "SELECT * FROM SubscriptionStatus";
            return jdbcTemplate.queryForList(sql);
        } else {
            String sql = "SELECT * FROM SubscriptionStatus WHERE LOWER(status) = LOWER(?)";
            return jdbcTemplate.queryForList(sql, status);
        }
    }
}