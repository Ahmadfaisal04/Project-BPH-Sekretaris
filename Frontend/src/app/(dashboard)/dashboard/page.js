/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import {
  Box,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { Card } from '@/components/ui/card';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
// import SendIcon from '@mui/icons-material/Send';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import OutboxIcon from '@mui/icons-material/Outbox';

import { useState, useEffect } from 'react';
import { API_ENDPOINTS, getHeaders } from '@/config/api';

// Tema MUI
const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
});

// Styled Components
const StyledCard = styled(Card)`
  background: ${({ variant }) => {
    const gradients = {
      biru1: 'linear-gradient(135deg, #155A8A 0%, #083C65 100%)',
      biru2: '#3097BA',
      biru3: '#3097BA',
    };     
    return gradients[variant] || gradients.biru2;
  }};
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  color: white;
  position: relative;
  overflow: hidden;
  min-height: 140px;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%);
    opacity: 0.6;
    z-index: 1;
  }
`;

const IconWrapper = styled(Box)`
  position: absolute;
  right: 10px;
  bottom: 12px;
  opacity: 0.40;
  z-index: 0;
  color: rgba(255, 255, 255, 0.9);
`; 


const ContentWrapper = styled(Box)`
  position: relative;
  z-index: 2;
  padding: 24px;
`;

export default function Dashboard() {
  const [daftarSurat, setDaftarSurat] = useState([]);
  const [filteredDaftarSurat, setFilteredDaftarSurat] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalSuratMasuk, setTotalSuratMasuk] = useState(0);
  const [totalSuratKeluar, setTotalSuratKeluar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuratMasuk = async () => {
    const res = await fetch(API_ENDPOINTS.SURAT_MASUK_GET_ALL, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Gagal mengambil data surat masuk');
    return await res.json();
  };

  const fetchSuratKeluar = async () => {
    const res = await fetch(API_ENDPOINTS.SURAT_KELUAR_GET_ALL, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Gagal mengambil data surat keluar');
    return await res.json();
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Dashboard - Fetching data...");
        
        const [responseMasuk, responseKeluar] = await Promise.all([
          fetchSuratMasuk(),
          fetchSuratKeluar(),
        ]);

        console.log("Dashboard - Response Masuk:", responseMasuk);
        console.log("Dashboard - Response Keluar:", responseKeluar);

        // Extract data from API response structure
        const dataMasuk = responseMasuk?.data || responseMasuk || [];
        const dataKeluar = responseKeluar?.data || responseKeluar || [];

        console.log("Dashboard - Data Masuk processed:", dataMasuk);
        console.log("Dashboard - Data Keluar processed:", dataKeluar);

        // Ensure data is arrays
        const masukArray = Array.isArray(dataMasuk) ? dataMasuk : [];
        const keluarArray = Array.isArray(dataKeluar) ? dataKeluar : [];

        setDaftarSurat([
          ...masukArray.map(i => ({ ...i, jenisSurat: 'masuk' })),
          ...keluarArray.map(i => ({ ...i, jenisSurat: 'keluar' })),
        ]);
        setFilteredDaftarSurat([
          ...masukArray.map(i => ({ ...i, jenisSurat: 'masuk' })),
          ...keluarArray.map(i => ({ ...i, jenisSurat: 'keluar' })),
        ]);
        setTotalSuratMasuk(masukArray.length);
        setTotalSuratKeluar(keluarArray.length);

        console.log("Dashboard - Total Masuk:", masukArray.length);
        console.log("Dashboard - Total Keluar:", keluarArray.length);
      } catch (err) {
        console.error("Dashboard - Error fetching data:", err);
        setError(err.message || 'Gagal mengambil data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredDaftarSurat(
      daftarSurat.filter(item =>
        item.perihal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.jenisSurat?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tanggalSurat?.includes(searchQuery)
      )
    );
  }, [searchQuery, daftarSurat]);
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: { xs: 2, sm: 3, md: 4 } }}>
        
        {/* Error Display */}
        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: '#ffebee', borderRadius: 1 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {/* Loading Display */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Welcome */}
        <StyledCard variant="biru1">
          <ContentWrapper>
            <Typography variant="h3" fontWeight={700} fontSize={{ xs: '1.8rem', sm: '2.4rem' }} mb={2}>
              Persuratan Sekretaris COCONUT
            </Typography>
            <Typography variant="body1" sx={{ opacity: 10 }}>
              Kelola persuratan dengan lebih mudah
            </Typography>
          </ContentWrapper>
          <IconWrapper>
            <MarkEmailReadIcon sx={{ fontSize: 180 }} />
          </IconWrapper>
        </StyledCard>

        {/* Statistik Surat */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <StyledCard variant="biru2">
              <ContentWrapper>
                <Typography variant="h6">Total Surat Masuk</Typography>
                <Typography variant="h3" fontWeight={700}>
                  {loading ? '...' : totalSuratMasuk}
                </Typography>
              </ContentWrapper>
              <IconWrapper>
                <MoveToInboxIcon sx={{ fontSize: 150 }} />
              </IconWrapper>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledCard variant="biru3"> 
              <ContentWrapper>
                <Typography variant="h6">Total Surat Keluar</Typography>
                <Typography variant="h3" fontWeight={700}>
                  {loading ? '...' : totalSuratKeluar}
                </Typography>
              </ContentWrapper>
              <IconWrapper>
                <OutboxIcon sx={{ fontSize: 150 }} />
              </IconWrapper>
            </StyledCard>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
