"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  TablePagination,
  Avatar,
  Snackbar,
  DialogContentText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import DescriptionIcon from "@mui/icons-material/Description";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { API_ENDPOINTS, getHeaders } from "@/config/api";
import { usePermissions } from "@/hooks/usePermissions";

// Styled components
const StyledCard = styled(Card)({
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
  overflow: "hidden",
});

const HeaderBox = styled(Box)({
  background: "#3097BA",
  padding: "24px",
  color: "white",
  borderRadius: "16px 16px 0 0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const FilePreviewBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  border: "1px solid #e0e0e0",
  borderRadius: "4px",
  marginTop: theme.spacing(1),
}));

export default function SuratMasuk() {
  const { canAdd, canEdit, canDelete, role } = usePermissions();
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [initialFormData, setInitialFormData] = useState(null);
  const [formData, setFormData] = useState({
    nomor: "",
    tanggal: null,
    perihal: "",
    asal: "",
    file: null,
    existingFile: "",
    existingTitle: "",
  });
  const [previewFile, setPreviewFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
  });
  const [noSuratValidation, setNoSuratValidation] = useState({
    isValid: null,
    message: "",
    isChecking: false,
  });

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("fetchData - Token tersedia:", token ? "Ya" : "Tidak");

      const headers = getHeaders();
      console.log("fetchData - Headers yang akan dikirim:", headers);

      const response = await fetch(API_ENDPOINTS.SURAT_MASUK_GET_ALL, {
        method: "GET",
        headers: headers,
      });

      console.log("fetchData - Response status:", response.status);
      console.log(
        "fetchData - Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("fetchData - Error response:", errorText);
        throw new Error("Gagal mengambil data surat masuk");
      }

      const result = await response.json();

      // Handle response format from backend
      if (result.status === "success" && result.data) {
        // Transform backend data to frontend format
        const transformedData = result.data.map((item) => ({
          id: item.id,
          nomor: item.no_surat,
          tanggal: item.tanggal_surat,
          perihal: item.perihal,
          asal: item.asal_surat,
          file: item.file_surat,
          status: item.status,
          tanggal_diterima: item.tanggal_diterima,
          created_at: item.created_at,
        }));
        setRows(transformedData);
      } else {
        setRows([]);
      }
      setError(null);
    } catch (err) {
      setError("Gagal mengambil data surat masuk");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  const resetForm = () => {
    setFormData({
      nomor: "",
      tanggal: null,
      perihal: "",
      asal: "",
      file: null,
      existingFile: "",
      existingTitle: "",
    });
    setPreviewFile(null);
    setExistingFile(null);
    setEditingId(null);
    setNoSuratValidation({ isValid: null, message: "", isChecking: false });
  };
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file" && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, file }));
      setPreviewFile(URL.createObjectURL(file));
      setExistingFile(null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Check nomor surat when it changes
      if (name === "nomor" && !editingId) {
        debouncedCheckNoSurat(value);
      }
    }
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, tanggal: date }));
  };

  // Fungsi untuk mengecek nomor surat
  const checkNoSurat = async (noSurat) => {
    if (!noSurat || noSurat.trim() === "") {
      setNoSuratValidation({ isValid: null, message: "", isChecking: false });
      return;
    }

    setNoSuratValidation({ isValid: null, message: "", isChecking: true });

    try {
      const response = await fetch(
        `${API_ENDPOINTS.SURAT_MASUK_CHECK_NO}?no_surat=${encodeURIComponent(
          noSurat
        )}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengecek nomor surat");
      }

      const result = await response.json();

      if (result.exists) {
        setNoSuratValidation({
          isValid: false,
          message: "Nomor surat sudah ada! Silakan gunakan nomor yang berbeda.",
          isChecking: false,
        });
      } else {
        setNoSuratValidation({
          isValid: true,
          message: "Nomor surat tersedia.",
          isChecking: false,
        });
      }
    } catch (error) {
      console.error("Error checking nomor surat:", error);
      setNoSuratValidation({
        isValid: null,
        message: "Gagal mengecek nomor surat. Silakan coba lagi.",
        isChecking: false,
      });
    }
  };

  // Debounced version untuk avoid spam API calls
  const [checkTimeout, setCheckTimeout] = useState(null);

  const debouncedCheckNoSurat = (noSurat) => {
    if (checkTimeout) {
      clearTimeout(checkTimeout);
    }

    const timeout = setTimeout(() => {
      checkNoSurat(noSurat);
    }, 500); // Wait 500ms after user stops typing

    setCheckTimeout(timeout);
  };
  const handleSave = async () => {
    if (
      !formData.nomor ||
      !formData.tanggal ||
      !formData.perihal ||
      !formData.asal
    ) {
      setSnackbar({
        open: true,
        message: "Semua field harus diisi!",
        severity: "error",
      });
      return;
    }

    // Check nomor surat validation for new entries (not when editing)
    if (!editingId && noSuratValidation.isValid === false) {
      setSnackbar({
        open: true,
        message: "Nomor surat sudah ada! Silakan gunakan nomor yang berbeda.",
        severity: "error",
      });
      return;
    } // If still checking nomor surat, wait for validation
    if (!editingId && noSuratValidation.isChecking) {
      setSnackbar({
        open: true,
        message: "Sedang mengecek nomor surat. Silakan tunggu sebentar.",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("no_surat", formData.nomor);
      formDataToSend.append("asal_surat", formData.asal);
      formDataToSend.append("perihal", formData.perihal);
      formDataToSend.append(
        "tanggal_surat",
        dayjs(formData.tanggal).format("YYYY-MM-DD") + "T00:00:00Z"
      );
      formDataToSend.append(
        "tanggal_diterima",
        dayjs(formData.tanggal).format("YYYY-MM-DD") + "T00:00:00Z"
      );
      formDataToSend.append("status", "Baru");

      // Add file if present
      if (formData.file) {
        formDataToSend.append("file_surat", formData.file);
      }

      const endpoint = editingId
        ? API_ENDPOINTS.SURAT_MASUK_UPDATE(editingId)
        : API_ENDPOINTS.SURAT_MASUK_ADD;

      const response = await fetch(endpoint, {
        method: editingId ? "PUT" : "POST",
        headers: getHeaders(true), // true for FormData
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menyimpan data");
      }

      const result = await response.json();
      if (result.status === "success") {
        setShowModal(false);
        resetForm();
        fetchData();
        setSnackbar({
          open: true,
          message: editingId
            ? "Data berhasil diupdate!"
            : "Data berhasil ditambahkan!",
          severity: "success",
        });
      } else {
        throw new Error(result.message || "Gagal menyimpan data");
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    const formattedData = {
      nomor: row.nomor,
      tanggal: dayjs(row.tanggal),
      perihal: row.perihal,
      asal: row.asal,
      file: null,
      existingFile: row.file,
      existingTitle: row.title,
    };

    setFormData(formattedData);
    setInitialFormData(formattedData);
    setEditingId(row.id);

    if (row.file) {
      setExistingFile(row.file);
      const backendBaseUrl = "http://localhost:8088";
      const filePath = row.file.startsWith(".")
        ? row.file.replace(".", "")
        : row.file;
      const previewUrl = `${backendBaseUrl}${filePath}`;
      setPreviewFile(previewUrl);
    } else {
      setExistingFile(null);
      setPreviewFile(null);
    }

    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialog({ open: false, id: null });
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        API_ENDPOINTS.SURAT_MASUK_DELETE(deleteDialog.id),
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );
      if (!response.ok) throw new Error("Gagal menghapus data");

      setSnackbar({
        open: true,
        message: "Data surat masuk telah dihapus.",
        severity: "success",
      });
      fetchData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Terjadi kesalahan saat menghapus.",
        severity: "error",
      });
    } finally {
      setLoading(false);
      handleDeleteDialogClose();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <StyledCard>
      {" "}
      <HeaderBox>
        <Typography variant="h6">Data Surat Masuk</Typography>
        {canAdd() && (
          <Button
            variant="outlined"
            startIcon={<MoveToInboxIcon />}
            sx={{
              backgroundColor: "#ffffff",
              color: "#3097BA",
              borderColor: "#3097BA",
              "&:hover": {
                backgroundColor: "#f0f0f0",
                borderColor: "#3097BA",
              },
            }}
            onClick={() => {
              setShowModal(true);
              setEditingId(null);
              setFormData({
                nomor: "",
                tanggal: null,
                perihal: "",
                asal: "",
                file: null,
                existingFile: "",
                existingTitle: "",
              });
              setPreviewFile(null);
              setExistingFile(null);
              setError(null);
            }}
          >
            Tambah Surat
          </Button>
        )}
      </HeaderBox>
      <CardContent>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Nomor Surat</strong>
                </TableCell>
                <TableCell>
                  <strong>Tanggal</strong>
                </TableCell>
                <TableCell>
                  <strong>Perihal</strong>
                </TableCell>
                <TableCell>
                  <strong>Asal</strong>
                </TableCell>{" "}
                <TableCell>
                  <strong>File</strong>
                </TableCell>
                {(canEdit() || canDelete()) && (
                  <TableCell>
                    <strong>Aksi</strong>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.nomor}</TableCell>
                    <TableCell>
                      {dayjs(row.tanggal).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell>{row.perihal}</TableCell>
                    <TableCell>{row.asal}</TableCell>{" "}
                    <TableCell>
                      {row.file && (
                        <Tooltip title="Lihat File">
                          <IconButton
                            component="a"
                            href={`http://localhost:8088${
                              row.file.startsWith("/")
                                ? row.file
                                : "/" + row.file
                            }`}
                            target="_blank"
                          >
                            <DescriptionIcon />
                          </IconButton>
                        </Tooltip>
                      )}{" "}
                    </TableCell>
                    {(canEdit() || canDelete()) && (
                      <TableCell>
                        {canEdit() && (
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleEdit(row)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {canDelete() && (
                          <Tooltip title="Hapus">
                            <IconButton
                              onClick={() => handleDeleteClick(row.id)}
                            >
                              <DeleteIcon color="error" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </CardContent>
      {/* Dialog Form */}{" "}
      <Dialog
        open={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingId ? "Edit Surat Masuk" : "Tambah Surat Masuk"}
        </DialogTitle>{" "}
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Nomor Surat"
            name="nomor"
            value={formData.nomor}
            onChange={handleInputChange}
            error={!editingId && noSuratValidation.isValid === false}
            helperText={
              !editingId && noSuratValidation.message
                ? noSuratValidation.message
                : editingId
                ? "Mode edit - validasi nomor dilewati"
                : ""
            }
            InputProps={{
              endAdornment: !editingId && noSuratValidation.isChecking && (
                <CircularProgress size={20} />
              ),
            }}
            sx={{
              "& .MuiFormHelperText-root": {
                color:
                  noSuratValidation.isValid === false
                    ? "error.main"
                    : noSuratValidation.isValid === true
                    ? "success.main"
                    : "text.secondary",
              },
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Tanggal"
              value={formData.tanggal}
              onChange={handleDateChange}
              slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
            />
          </LocalizationProvider>
          <TextField
            fullWidth
            margin="dense"
            label="Perihal"
            name="perihal"
            value={formData.perihal}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Asal Surat"
            name="asal"
            value={formData.asal}
            onChange={handleInputChange}
          />

          {/* Tombol Pilih File (selalu tampilkan "Pilih File") */}
          <Box sx={{ mt: 2 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<DescriptionIcon />}
              sx={{
                backgroundColor: "#ffffff",
                color: "#3097BA",
                borderColor: "#3097BA",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                  borderColor: "#3097BA",
                },
              }}
            >
              Pilih File
              <input
                type="file"
                name="file"
                hidden
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={handleInputChange}
              />
            </Button>

            {/* Tampilkan nama file jika sudah dipilih */}
            {(formData.file || existingFile) && (
              <Typography
                variant="body2"
                sx={{ mt: 1, color: "#3097BA", fontWeight: 500 }}
              >
                File terpilih:{" "}
                {formData.file?.name || existingFile?.split("/").pop()}
              </Typography>
            )}
          </Box>

          {/* Preview file jika ada */}
          {(previewFile || existingFile) && (
            <FilePreviewBox>
              <Avatar>
                <DescriptionIcon />
              </Avatar>
              <Typography variant="body2">
                {formData.file?.name || existingFile?.split("/").pop()}
              </Typography>{" "}
              <a
                href={
                  previewFile ||
                  `http://localhost:8088${
                    existingFile.startsWith("/")
                      ? existingFile
                      : "/" + existingFile
                  }`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="small">Lihat</Button>
              </a>
            </FilePreviewBox>
          )}
        </DialogContent>{" "}
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
            sx={{
              backgroundColor: "#3097BA",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#267d9d",
              },
              "&:active": {
                backgroundColor: "#267d9d",
              },
            }}
          >
            Batal
          </Button>

          <Button
            onClick={handleSave}
            variant="outlined"
            sx={{
              backgroundColor: "#3097BA",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#267d9d",
              },
              "&:active": {
                backgroundColor: "#267d9d",
              },
            }}
          >
            {editingId ? "Update" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Apakah Anda yakin?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Data yang dihapus tidak dapat dikembalikan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Batal</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Ya, Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </StyledCard>
  );
}
