import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import type {Customer, Address} from "../types/Customer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface CustomerFormProps {
  initialData?: Customer;
  onSubmit: (data: Omit<Customer, "id">) => Promise<void>;
  onBack: () => void;
  submitLabel: string;
  title: string;
  loading?: boolean;
  serverErrors?: Record<string, string>;
}

const emptyAddress: Address = {
  street: "",
  houseNumber: "",
  city: "",
  postalCode: "",
  country: "",
};

const emptyCustomer: Omit<Customer, "id"> = {
  firstName: "",
  lastName: "",
  freeTextInformation: "",
  vatNumber: "",
  address: { ...emptyAddress },
};

export default function CustomerForm({
  initialData,
  onSubmit,
  onBack,
  submitLabel,
  title,
  loading = false,
  serverErrors = {},
}: CustomerFormProps) {
  const [form, setForm] = useState<Omit<Customer, "id">>(emptyCustomer);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        firstName: initialData.firstName ?? "",
        lastName: initialData.lastName ?? "",
        freeTextInformation: initialData.freeTextInformation ?? "",
        vatNumber: initialData.vatNumber ?? "",
        address: initialData.address ?? { ...emptyAddress },
      });
    }
  }, [initialData]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = "First name must not be blank";
    if (!form.lastName.trim()) errs.lastName = "Last name must not be blank";
    if ((form.freeTextInformation?.length ?? 0) > 100)
      errs.freeTextInformation = "Must not exceed 100 characters";
    if (!form.address.street.trim()) errs["address.street"] = "Street must not be blank";
    if (!form.address.houseNumber.trim()) errs["address.houseNumber"] = "House number must not be blank";
    if (!form.address.city.trim()) errs["address.city"] = "City must not be blank";
    if (!form.address.postalCode.trim()) errs["address.postalCode"] = "Postal code must not be blank";
    if (!form.address.country.trim()) errs["address.country"] = "Country must not be blank";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    if (field.startsWith("address.")) {
      const addrField = field.replace("address.", "") as keyof Address;
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [addrField]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...form,
      vatNumber: form.vatNumber?.trim() || undefined,
      freeTextInformation: form.freeTextInformation?.trim() || undefined,
    };
    await onSubmit(payload);
  };

  const allErrors = { ...errors, ...serverErrors };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: "auto", mt: 4 }}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack}>
          Back
        </Button>
        <Typography variant="h5">{title}</Typography>
      </Box>

      {allErrors.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {allErrors.general}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          {/* Personal info */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="First Name"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              error={!!allErrors.firstName}
              helperText={allErrors.firstName}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Last Name"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              error={!!allErrors.lastName}
              helperText={allErrors.lastName}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Free Text Information"
              value={form.freeTextInformation}
              onChange={(e) => handleChange("freeTextInformation", e.target.value)}
              error={!!allErrors.freeTextInformation}
              helperText={
                allErrors.freeTextInformation ??
                `${form.freeTextInformation?.length ?? 0}/100`
              }
              fullWidth
              multiline
              minRows={2}
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="VAT Number"
              value={form.vatNumber}
              onChange={(e) => handleChange("vatNumber", e.target.value)}
              error={!!allErrors.vatNumber}
              helperText={allErrors.vatNumber ?? "e.g. DE123456789, ATU12345678"}
              fullWidth
            />
          </Grid>

          {/* Address */}
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              Address
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              label="Street"
              value={form.address.street}
              onChange={(e) => handleChange("address.street", e.target.value)}
              error={!!allErrors["address.street"]}
              helperText={allErrors["address.street"]}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="House Number"
              value={form.address.houseNumber}
              onChange={(e) => handleChange("address.houseNumber", e.target.value)}
              error={!!allErrors["address.houseNumber"]}
              helperText={allErrors["address.houseNumber"]}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Postal Code"
              value={form.address.postalCode}
              onChange={(e) => handleChange("address.postalCode", e.target.value)}
              error={!!allErrors["address.postalCode"]}
              helperText={allErrors["address.postalCode"]}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="City"
              value={form.address.city}
              onChange={(e) => handleChange("address.city", e.target.value)}
              error={!!allErrors["address.city"]}
              helperText={allErrors["address.city"]}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Country"
              value={form.address.country}
              onChange={(e) => handleChange("address.country", e.target.value)}
              error={!!allErrors["address.country"]}
              helperText={allErrors["address.country"]}
              fullWidth
              required
            />
          </Grid>

          {/* Submit */}
          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : submitLabel}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

