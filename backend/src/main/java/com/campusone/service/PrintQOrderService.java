package com.campusone.service;

import com.campusone.dto.request.CreatePrintQOrderRequest;
import com.campusone.dto.response.PrintQOrderResponse;
import com.campusone.entity.OrderStatus;

import java.util.List;

public interface PrintQOrderService {
    List<PrintQOrderResponse> getUserOrders(String userUid);
    PrintQOrderResponse createOrder(CreatePrintQOrderRequest req, String userUid, String userName);
    PrintQOrderResponse updateStatus(Long id, OrderStatus status);
}
