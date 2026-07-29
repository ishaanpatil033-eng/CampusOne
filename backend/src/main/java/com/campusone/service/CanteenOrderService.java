package com.campusone.service;

import com.campusone.dto.request.CreateCanteenOrderRequest;
import com.campusone.dto.response.CanteenOrderResponse;
import com.campusone.entity.OrderStatus;

import java.util.List;

public interface CanteenOrderService {
    List<CanteenOrderResponse> getUserOrders(String userUid);
    CanteenOrderResponse createOrder(CreateCanteenOrderRequest req, String userUid, String userName);
    CanteenOrderResponse updateStatus(Long id, OrderStatus status);
}
