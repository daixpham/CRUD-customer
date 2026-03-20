package org.example.controller;

import jakarta.validation.Valid;
import org.example.config.CustomerFeatures;
import org.example.model.Customer;
import org.example.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @PostMapping
    public ResponseEntity<Object> createCustomer(@Valid @RequestBody Customer customer) {
        if (!CustomerFeatures.CREATE_CUSTOMER.isActive()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Feature 'Create Customer' is currently disabled"));
        }

        Customer saved = customerService.createCustomer(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Customer created successfully",
                "customer", saved
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getCustomerById(@PathVariable String id) {
        return customerService.getCustomerById(id)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Customer not found with id: " + id)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Object> updateCustomer(@PathVariable String id, @RequestBody Customer updates) {
        if (!CustomerFeatures.UPDATE_CUSTOMER.isActive()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Feature 'Update Customer' is currently disabled"));
        }

        return customerService.updateCustomer(id, updates)
                .<ResponseEntity<Object>>map(updated -> ResponseEntity.ok(Map.of(
                        "message", "Customer updated successfully",
                        "customer", updated
                )))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Customer not found with id: " + id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteCustomer(@PathVariable String id) {
        if (!CustomerFeatures.DELETE_CUSTOMER.isActive()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Feature 'Delete Customer' is currently disabled"));
        }

        if (customerService.deleteCustomer(id)) {
            return ResponseEntity.ok(Map.of("message", "Customer deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Customer not found with id: " + id));
    }
}

