import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import CustomerForm from "../components/CustomerForm";
import { customerService, parseApiError } from "../services/customerService";
import type { Customer } from "../types/Customer";

export default function CreateCustomerPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: Omit<Customer, "id">) => {
    setLoading(true);
    setServerErrors({});
    try {
      const res = await customerService.create(data);
      setSuccess(true);
      setTimeout(() => navigate(`/customer/${res.data.customer.id}`), 1500);
    } catch (err) {
      setServerErrors(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomerForm
        title="Create Customer"
        submitLabel="Create Customer"
        onSubmit={handleSubmit}
        onBack={() => navigate(-1)}
        loading={loading}
        serverErrors={serverErrors}
      />
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success" variant="filled">
          Customer created successfully!
        </Alert>
      </Snackbar>
    </>
  );
}

