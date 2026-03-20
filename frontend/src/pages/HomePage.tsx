import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import { customerService } from "../services/customerService";
import type { Customer } from "../types/Customer";

export default function HomePage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    customerService
      .getAll()
      .then((res) => setCustomers(res.data))
      .catch(() => setError("Failed to load customers"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: "auto", mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Customers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/customer/new")}
        >
          New Customer
        </Button>
      </Box>

      <Divider />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!error && customers.length === 0 && (
        <Box textAlign="center" py={6}>
          <Typography color="text.secondary" gutterBottom>
            No customers found
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => navigate("/customer/new")}
          >
            Create your first customer
          </Button>
        </Box>
      )}

      {customers.length > 0 && (
        <List disablePadding>
          {customers.map((customer, index) => (
            <Box key={customer.id}>
              {index > 0 && <Divider />}
              <ListItemButton onClick={() => navigate(`/customer/${customer.id}`)}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`${customer.firstName} ${customer.lastName}`}
                  secondary={`${customer.address.street} ${customer.address.houseNumber}, ${customer.address.postalCode} ${customer.address.city}${customer.vatNumber ? ` · VAT: ${customer.vatNumber}` : ""}`}
                />
              </ListItemButton>
            </Box>
          ))}
        </List>
      )}
    </Paper>
  );
}
