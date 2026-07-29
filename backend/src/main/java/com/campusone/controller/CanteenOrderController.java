package com.campusone.controller;

import com.campusone.dto.request.CreateCanteenOrderRequest;
import com.campusone.dto.response.ApiResponse;
import com.campusone.dto.response.CanteenOrderResponse;
import com.campusone.entity.OrderStatus;
import com.campusone.service.CanteenOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/canteen")
@RequiredArgsConstructor
public class CanteenOrderController {

    private final CanteenOrderService service;

    @GetMapping("/orders/me")
    public ResponseEntity<ApiResponse<List<CanteenOrderResponse>>> getMyOrders(
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        String uid = (String) claims.get("uid");
        return ResponseEntity.ok(ApiResponse.success(service.getUserOrders(uid)));
    }

    @PostMapping("/orders")
    public ResponseEntity<ApiResponse<CanteenOrderResponse>> createOrder(
            @RequestBody @Valid CreateCanteenOrderRequest request,
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        String uid  = (String) claims.get("uid");
        String name = (String) claims.getOrDefault("name", "Anonymous");
        CanteenOrderResponse created = service.createOrder(request, uid, name);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order placed successfully", created));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<CanteenOrderResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status
    ) {
        // In a real app, ensure only ADMIN/STAFF can do this.
        return ResponseEntity.ok(ApiResponse.success("Status updated", service.updateStatus(id, status)));
    }
}
