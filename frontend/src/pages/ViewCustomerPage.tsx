import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Grid,
  Divider,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { customerService } from "../services/customerService";
import type { Customer } from "../types/Customer";

export default function ViewCustomerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteStep, setDeleteStep] = useState(0); // 0=closed, 1=first confirm, 2=second confirm
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    customerService
      .getById(id)
      .then((res) => setCustomer(res.data))
      .catch(() => setError("Customer not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await customerService.delete(id);
      navigate("/");
    } catch {
      setError("Failed to delete customer");
      setDeleteStep(0);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !customer) {
    return (
      <Box mt={4} mx="auto" maxWidth={700}>
        <Alert severity="error">{error || "Customer not found"}</Alert>
        <Button startIcon={<ArrowBackIcon />} sx={{ mt: 2 }} onClick={() => navigate("/")}>
          Back
        </Button>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: "auto", mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Customer Details</Typography>
        <Box display="flex" gap={1}>
          <Tooltip title="Back">
            <IconButton onClick={() => navigate("/")}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton color="primary" onClick={() => navigate(`/customer/${id}/edit`)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => setDeleteStep(1)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" color="text.secondary">
            First Name
          </Typography>
          <Typography variant="body1">{customer.firstName}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" color="text.secondary">
            Last Name
          </Typography>
          <Typography variant="body1">{customer.lastName}</Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="caption" color="text.secondary">
            Free Text Information
          </Typography>
          <Typography variant="body1">
            {customer.freeTextInformation || "—"}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="caption" color="text.secondary">
            VAT Number
          </Typography>
          <Typography variant="body1" component="div">
            {customer.vatNumber ? (
              <Chip label={customer.vatNumber} size="small" color="primary" variant="outlined" />
            ) : (
              "—"
            )}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>
            Address
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <Typography variant="caption" color="text.secondary">
            Street
          </Typography>
          <Typography variant="body1">{customer.address.street}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="caption" color="text.secondary">
            House Number
          </Typography>
          <Typography variant="body1">{customer.address.houseNumber}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Postal Code
          </Typography>
          <Typography variant="body1">{customer.address.postalCode}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="caption" color="text.secondary">
            City
          </Typography>
          <Typography variant="body1">{customer.address.city}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Country
          </Typography>
          <Typography variant="body1">{customer.address.country}</Typography>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Typography variant="caption" color="text.secondary">
          ID: {customer.id}
        </Typography>
      </Box>

      {/* First confirmation dialog */}
      <Dialog open={deleteStep === 1} onClose={() => setDeleteStep(0)}>
        <DialogTitle>Delete Customer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{customer.firstName} {customer.lastName}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteStep(0)}>Cancel</Button>
          <Button color="error" onClick={() => setDeleteStep(2)}>
            Yes, delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Second confirmation dialog */}
      <Dialog open={deleteStep === 2} onClose={() => setDeleteStep(0)}>
        <DialogTitle>Final Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action is <strong>irreversible</strong>. The customer <strong>{customer.firstName} {customer.lastName}</strong> and all associated data will be permanently removed. Are you absolutely sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteStep(0)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={20} /> : "Yes, permanently delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
