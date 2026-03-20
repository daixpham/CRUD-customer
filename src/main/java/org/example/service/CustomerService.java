package org.example.service;

import org.example.model.Address;
import org.example.model.Customer;
import org.example.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(String id) {
        return customerRepository.findById(id);
    }

    public boolean deleteCustomer(String id) {
        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<Customer> updateCustomer(String id, Customer updates) {
        return customerRepository.findById(id).map(existing -> {
            if (updates.getFirstName() != null) {
                existing.setFirstName(updates.getFirstName());
            }
            if (updates.getLastName() != null) {
                existing.setLastName(updates.getLastName());
            }
            updates.getFreeTextInformation().ifPresent(existing::setFreeTextInformation);
            updates.getVatNumber().ifPresent(existing::setVatNumber);
            if (updates.getAddress() != null) {
                Address existingAddress = existing.getAddress();
                Address updatedAddress = updates.getAddress();

                if (existingAddress == null) {
                    existing.setAddress(updatedAddress);
                } else {
                    if (updatedAddress.getStreet() != null) {
                        existingAddress.setStreet(updatedAddress.getStreet());
                    }
                    if (updatedAddress.getHouseNumber() != null) {
                        existingAddress.setHouseNumber(updatedAddress.getHouseNumber());
                    }
                    if (updatedAddress.getCity() != null) {
                        existingAddress.setCity(updatedAddress.getCity());
                    }
                    if (updatedAddress.getPostalCode() != null) {
                        existingAddress.setPostalCode(updatedAddress.getPostalCode());
                    }
                    if (updatedAddress.getCountry() != null) {
                        existingAddress.setCountry(updatedAddress.getCountry());
                    }
                }
            }
            return customerRepository.save(existing);
        });
    }
}

