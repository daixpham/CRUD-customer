package org.example.service;

import org.example.model.Address;
import org.example.model.Customer;
import org.example.repository.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerService customerService;

    private Customer customer;
    private Address address;

    @BeforeEach
    void setUp() {
        address = new Address("Main Street", "1", "Hamburg", "20095", "Germany");
        customer = new Customer("John", "Doe", "Some info", "DE123456789", address);
        customer.setId("test-id-123");
    }

    // -------------------------------------------------------------------------
    // createCustomer
    // -------------------------------------------------------------------------
    @Nested
    @DisplayName("createCustomer()")
    class CreateCustomer {

        @Test
        @DisplayName("should save and return the customer")
        void shouldSaveAndReturnCustomer() {
            when(customerRepository.save(customer)).thenReturn(customer);

            Customer result = customerService.createCustomer(customer);

            assertThat(result).isEqualTo(customer);
            verify(customerRepository, times(1)).save(customer);
        }
    }

    // -------------------------------------------------------------------------
    // getAllCustomers
    // -------------------------------------------------------------------------
    @Nested
    @DisplayName("getAllCustomers()")
    class GetAllCustomers {

        @Test
        @DisplayName("should return all customers")
        void shouldReturnAllCustomers() {
            Customer second = new Customer("Jane", "Smith", null, null, address);
            when(customerRepository.findAll()).thenReturn(List.of(customer, second));

            List<Customer> result = customerService.getAllCustomers();

            assertThat(result).hasSize(2).containsExactly(customer, second);
            verify(customerRepository, times(1)).findAll();
        }

        @Test
        @DisplayName("should return empty list when no customers exist")
        void shouldReturnEmptyList() {
            when(customerRepository.findAll()).thenReturn(List.of());

            List<Customer> result = customerService.getAllCustomers();

            assertThat(result).isEmpty();
        }
    }

    // -------------------------------------------------------------------------
    // getCustomerById
    // -------------------------------------------------------------------------
    @Nested
    @DisplayName("getCustomerById()")
    class GetCustomerById {

        @Test
        @DisplayName("should return customer when found")
        void shouldReturnCustomerWhenFound() {
            when(customerRepository.findById("test-id-123")).thenReturn(Optional.of(customer));

            Optional<Customer> result = customerService.getCustomerById("test-id-123");

            assertThat(result).isPresent().contains(customer);
        }

        @Test
        @DisplayName("should return empty Optional when not found")
        void shouldReturnEmptyWhenNotFound() {
            when(customerRepository.findById("unknown-id")).thenReturn(Optional.empty());

            Optional<Customer> result = customerService.getCustomerById("unknown-id");

            assertThat(result).isEmpty();
        }
    }

    // -------------------------------------------------------------------------
    // deleteCustomer
    // -------------------------------------------------------------------------
    @Nested
    @DisplayName("deleteCustomer()")
    class DeleteCustomer {

        @Test
        @DisplayName("should delete and return true when customer exists")
        void shouldDeleteAndReturnTrue() {
            when(customerRepository.existsById("test-id-123")).thenReturn(true);

            boolean result = customerService.deleteCustomer("test-id-123");

            assertThat(result).isTrue();
            verify(customerRepository, times(1)).deleteById("test-id-123");
        }

        @Test
        @DisplayName("should return false and not delete when customer does not exist")
        void shouldReturnFalseWhenNotFound() {
            when(customerRepository.existsById("unknown-id")).thenReturn(false);

            boolean result = customerService.deleteCustomer("unknown-id");

            assertThat(result).isFalse();
            verify(customerRepository, never()).deleteById(any());
        }
    }

    // -------------------------------------------------------------------------
    // updateCustomer
    // -------------------------------------------------------------------------
    @Nested
    @DisplayName("updateCustomer()")
    class UpdateCustomer {

        @Test
        @DisplayName("should update firstName and lastName")
        void shouldUpdateFirstAndLastName() {
            Customer updates = new Customer("Jane", "Smith", null, null, null);

            when(customerRepository.findById("test-id-123")).thenReturn(Optional.of(customer));
            when(customerRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

            Optional<Customer> result = customerService.updateCustomer("test-id-123", updates);

            assertThat(result).isPresent();
            assertThat(result.get().getFirstName()).isEqualTo("Jane");
            assertThat(result.get().getLastName()).isEqualTo("Smith");
        }

        @Test
        @DisplayName("should update freeTextInformation when provided")
        void shouldUpdateFreeTextInformation() {
            Customer updates = new Customer(null, null, "Updated info", null, null);

            when(customerRepository.findById("test-id-123")).thenReturn(Optional.of(customer));
            when(customerRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

            Optional<Customer> result = customerService.updateCustomer("test-id-123", updates);

            assertThat(result).isPresent();
            assertThat(result.get().getFreeTextInformation()).contains("Updated info");
        }

        @Test
        @DisplayName("should not overwrite freeTextInformation when not provided (null)")
        void shouldNotOverwriteFreeTextWhenNull() {
            Customer updates = new Customer("Jane", null, null, null, null);

            when(customerRepository.findById("test-id-123")).thenReturn(Optional.of(customer));
            when(customerRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

            Optional<Customer> result = customerService.updateCustomer("test-id-123", updates);

            assertThat(result).isPresent();
            assertThat(result.get().getFreeTextInformation()).contains("Some info");
        }

        @Test
        @DisplayName("should update vatNumber when provided")
        void shouldUpdateVatNumber() {
            Customer updates = new Customer(null, null, null, "ATU12345678", null);

            when(customerRepository.findById("test-id-123")).thenReturn(Optional.of(customer));
            when(customerRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

            Optional<Customer> result = customerService.updateCustomer("test-id-123", updates);

            assertThat(result).isPresent();
            assertThat(result.get().getVatNumber()).contains("ATU12345678");
        }

        @Test
        @DisplayName("should not overwrite vatNumber when not provided (null)")
        void shouldNotOverwriteVatNumberWhenNull() {
            Customer updates = new Customer("Jane", null, null, null, null);

            when(customerRepository.findById("test-id-123")).thenReturn(Optional.of(customer));
            when(customerRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

            Optional<Customer> result = customerService.updateCustomer("test-id-123", updates);

            assertThat(result).isPresent();
            assertThat(result.get().getVatNumber()).contains("DE123456789");
        }

        @Test
        @DisplayName("should update address fields partially")
        void shouldUpdateAddressFieldsPartially() {
            Address partialAddress = new Address(null, null, "Berlin", "10115", null);
            Customer updates = new Customer(null, null, null, null, partialAddress);

            when(customerRepository.findById("test-id-123")).thenReturn(Optional.of(customer));
            when(customerRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

            Optional<Customer> result = customerService.updateCustomer("test-id-123", updates);

            assertThat(result).isPresent();
            Address updatedAddress = result.get().getAddress();
            assertThat(updatedAddress.getCity()).isEqualTo("Berlin");
            assertThat(updatedAddress.getPostalCode()).isEqualTo("10115");
            // unchanged fields stay
            assertThat(updatedAddress.getStreet()).isEqualTo("Main Street");
            assertThat(updatedAddress.getCountry()).isEqualTo("Germany");
        }

        @Test
        @DisplayName("should set address when existing address is null")
        void shouldSetAddressWhenExistingIsNull() {
            Customer noAddressCustomer = new Customer("John", "Doe", null, null, null);
            noAddressCustomer.setId("no-addr-id");

            Address newAddress = new Address("New St", "5", "Munich", "80331", "Germany");
            Customer updates = new Customer(null, null, null, null, newAddress);

            when(customerRepository.findById("no-addr-id")).thenReturn(Optional.of(noAddressCustomer));
            when(customerRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

            Optional<Customer> result = customerService.updateCustomer("no-addr-id", updates);

            assertThat(result).isPresent();
            assertThat(result.get().getAddress()).isEqualTo(newAddress);
        }

        @Test
        @DisplayName("should return empty Optional when customer not found")
        void shouldReturnEmptyWhenNotFound() {
            when(customerRepository.findById("unknown-id")).thenReturn(Optional.empty());

            Optional<Customer> result = customerService.updateCustomer("unknown-id", new Customer());

            assertThat(result).isEmpty();
            verify(customerRepository, never()).save(any());
        }
    }
}

