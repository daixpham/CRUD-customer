package org.example.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Optional;

@Document(collection = "customers")
public class Customer {

    @Id
    private String id;

    @NotBlank(message = "First name must not be blank")
    private String firstName;

    @NotBlank(message = "Last name must not be blank")
    private String lastName;

    @Size(max = 100, message = "Free text information must not exceed 100 characters")
    private String freeTextInformation;

    @Pattern(
        regexp = "(?i)(?:(AT)\\s*(U\\d{8}))|(?:(BE)\\s*(0?\\d+))|(?:(CZ)\\s*(\\d{8,10}))|(?:(DE)\\s*(\\d{9}))|(?:(CY)\\s*(\\d{8}[A-Z]))|(?:(DK)\\s*(\\d{8}))|(?:(EE)\\s*(\\d{9}))|(?:(GR)\\s*(\\d{9}))|(?:(ES|NIF:?)\\s*([0-9A-Z]\\d{7}[0-9A-Z]))|(?:(FI)\\s*(\\d{8}))|(?:(FR)\\s*([0-9A-Z]{2}\\d{9}))|(?:(GB)\\s*((\\d{9}|\\d{12})|(GD|HA)\\d{3}))|(?:(HU)\\s*(\\d{8}))|(?:(IE)\\s*(\\d[A-Z0-9+*]\\d{5}[A-Z]))|(?:(IT)\\s*(\\d{11}))|(?:(LT)\\s*((\\d{9}|\\d{12})))|(?:(LU)\\s*(\\d{8}))|(?:(LV)\\s*(\\d{11}))|(?:(MT)\\s*(\\d{8}))|(?:(NL)\\s*(\\d{9}B\\d{2}))|(?:(PL)\\s*(\\d{10}))|(?:(PT)\\s*(\\d{9}))|(?:(SE)\\s*(\\d{12}))|(?:(SI)\\s*(\\d{8}))|(?:(SK)\\s*(\\d{10}))|(\\d{11})|(?:(CHE)(-|\\s*)(\\d{3}\\.\\d{3}\\.\\d{3}))|(?:(SM)\\s*(\\d{5}))",
        message = "VAT number must be a valid European VAT number"
    )
    private String vatNumber;

    @Valid
    @NotNull(message = "Address must not be null")
    private Address address;

    public Customer() {
    }

    public Customer(String firstName, String lastName, String freeTextInformation, String vatNumber, Address address) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.freeTextInformation = freeTextInformation;
        this.vatNumber = vatNumber;
        this.address = address;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Optional<String> getFreeTextInformation() {
        return Optional.ofNullable(freeTextInformation);
    }

    public void setFreeTextInformation(String freeTextInformation) {
        this.freeTextInformation = freeTextInformation;
    }

    public Optional<String> getVatNumber() {
        return Optional.ofNullable(vatNumber);
    }

    public void setVatNumber(String vatNumber) {
        this.vatNumber = (vatNumber != null && vatNumber.isBlank()) ? null : vatNumber;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "id='" + id + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", freeTextInformation='" + freeTextInformation + '\'' +
                ", vatNumber='" + vatNumber + '\'' +
                ", address=" + address +
                '}';
    }
}

