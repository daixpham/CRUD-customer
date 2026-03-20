import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Snackbar, Box, CircularProgress } from "@mui/material";
import CustomerForm from "../components/CustomerForm";
import { customerService, parseApiError } from "../services/customerService";
import type { Customer } from "../types/Customer";

export default function EditCustomerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!id) return;
    customerService
      .getById(id)
      .then((res) => setCustomer(res.data))
      .catch(() => setFetchError("Customer not found"))
      .finally(() => setPageLoading(false));
  }, [id]);

  const handleSubmit = async (data: Omit<Customer, "id">) => {
    if (!id) return;
    setSubmitLoading(true);
    setServerErrors({});
    try {
      await customerService.update(id, data);
      setSuccess(true);
      setTimeout(() => navigate(`/customer/${id}`), 1500);
    } catch (err) {
      setServerErrors(parseApiError(err));
    } finally {
      setSubmitLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError || !customer) {
    return (
      <Box mt={4} mx="auto" maxWidth={700}>
        <Alert severity="error">{fetchError || "Customer not found"}</Alert>
      </Box>
    );
  }

  return (
    <>
      <CustomerForm
        title="Edit Customer"
        submitLabel="Save Changes"
        initialData={customer}
        onSubmit={handleSubmit}
        onBack={() => navigate(-1)}
        loading={submitLoading}
        serverErrors={serverErrors}
      />
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success" variant="filled">
          Customer updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
}

