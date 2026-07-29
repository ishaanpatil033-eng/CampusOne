package com.campusone.controller;

import com.campusone.dto.request.CreatePrintQOrderRequest;
import com.campusone.dto.response.ApiResponse;
import com.campusone.dto.response.PrintQOrderResponse;
import com.campusone.entity.OrderStatus;
import com.campusone.service.PrintQOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/printq")
@RequiredArgsConstructor
public class PrintQOrderController {

    private final PrintQOrderService service;

    @GetMapping("/orders/me")
    public ResponseEntity<ApiResponse<List<PrintQOrderResponse>>> getMyOrders(
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        String uid = (String) claims.get("uid");
        return ResponseEntity.ok(ApiResponse.success(service.getUserOrders(uid)));
    }

    @PostMapping("/orders")
    public ResponseEntity<ApiResponse<PrintQOrderResponse>> createOrder(
            @RequestBody @Valid CreatePrintQOrderRequest request,
            @RequestAttribute("firebaseClaims") Map<String, Object> claims
    ) {
        String uid  = (String) claims.get("uid");
        String name = (String) claims.getOrDefault("name", "Anonymous");
        PrintQOrderResponse created = service.createOrder(request, uid, name);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Print job submitted successfully", created));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<PrintQOrderResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status
    ) {
        return ResponseEntity.ok(ApiResponse.success("Status updated", service.updateStatus(id, status)));
    }
}
