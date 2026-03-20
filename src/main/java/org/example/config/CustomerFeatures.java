package org.example.config;

import org.togglz.core.Feature;
import org.togglz.core.annotation.EnabledByDefault;
import org.togglz.core.annotation.Label;

public enum CustomerFeatures implements Feature {

    @EnabledByDefault
    @Label("Create Customer")
    CREATE_CUSTOMER,

    @EnabledByDefault
    @Label("Update Customer")
    UPDATE_CUSTOMER,

    @EnabledByDefault
    @Label("Delete Customer")
    DELETE_CUSTOMER;
}

