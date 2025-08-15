"use client";
import { API_ENDPOINTS, getHeaders } from "@/config/api";
import CloseIcon from "@mui/icons-material/Close";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PrintIcon from "@mui/icons-material/Print";
import SaveIcon from "@mui/icons-material/Save";
import OutboxIcon from "@mui/icons-material/Outbox";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  styled,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

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

// Daftar opsi penandatangan
const penandatanganOptions = {
  "Ketua Umum": { namaLengkap: "MUHAMMAD SYARIF", nra: "13.24.008" },
};

// Fungsi untuk memformat tanggal ke format Indonesia
const formatTanggalIndonesia = (tanggal) => {
  if (!tanggal) return "...........................";
  const date = new Date(tanggal);
  if (isNaN(date.getTime())) return "...........................";
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
};

const safeString = (value) => {
  if (value == null) return "...........................";
  if (typeof value === "object") {
    return value.name ? String(value.name) : "...........................";
  }
  return String(value);
};

const safeFormString = (value) => {
  if (value == null) return "";
  if (typeof value === "object") {
    return value.name ? String(value.name) : "";
  }
  return String(value);
};

const suratTemplates = {
  "Surat Peringatan": {
    title: "Surat Peringatan",
    template: (data) => `
      <div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
          <div style="display: flex; align-items: center; justify-content: center;">
            <img src="logo.png" alt="COCONUT Logo" style="width: 70px; height: auto; margin-right: 20px;" />
            <div>
              <h2 style="margin: 0; font-size: 14pt;">COMPUTER CLUB ORIENTED NETWORK, UTILITY AND TECHNOLOGY (COCONUT)</h2>
              <p style="margin: 0; font-size: 10pt;">Jl. Monumen Emmy Saelan III No. 70 Karunrung, Kec. Rappocini, Makassar</p>
              <p style="margin: 0; font-size: 10pt;">Telp. 085240791254/0895801262897, Website: www.coconut.or.id, Email: hello@coconut.or.id</p>
            </div>
          </div>
        </div>
        <div style="margin-bottom: 20px; text-align: center;">
          <p style="font-weight: bold; font-size: 14pt; text-decoration: underline;">SURAT PERINGATAN I</p>
          <p style="margin: 5px 0; font-weight: bold;">Nomor: ${safeString(
            data.no_surat
          )}</p>
        </div>
        <div style="margin: 20px 0; text-align: justify;">
          <p style="margin-bottom: 10px;">Surat Peringatan ini ditujukan kepada :</p>
          <table style="margin-left: 40px; margin-bottom: 20px; font-size: 12pt;">
            <tr><td style="width: 120px;">Nama</td><td style="width: 20px;">:</td><td>${safeString(
              data.nama
            )}</td></tr>
            <tr><td>NRA</td><td>:</td><td>${safeString(data.nra)}</td></tr>
            <tr><td>Jabatan</td><td>:</td><td>${safeString(
              data.jabatan
            )}</td></tr>
          </table>
          <p style="margin-bottom: 10px;">Surat Peringatan ini dikeluarkan karena yang bersangkutan sudah terbukti melakukan kesalahan berupa :</p>
          <ol style="margin-left: 40px; margin-bottom: 10px;">
            ${data.kesalahan
              .split(",")
              .map((k, index) => `<li>${safeString(k.trim())}</li>`)
              .join("")}
          </ol>
          <p style="text-indent: 40px; margin-bottom: 10px;">
            Kami berharap dengan adanya surat peringatan ini dapat menjadi perhatian bagi yang bersangkutan. Kami juga berharap agar yang bersangkutan tidak mengulangi kesalahan di kemudian hari, demi menciptakan lingkungan organisasi yang kondusif dan patuh pada peraturan yang berlaku.
          </p>
          <p style="text-indent: 40px; margin-bottom: 10px;">
            Demikian surat teguran ini dikeluarkan, untuk dijadikan bahan perhatian dan perbaikan disiplin ke depannya. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.
          </p>
        </div>
        <div style="margin-top: 60px; text-align: right;">
          <p style="margin: 0;">Makassar, ${formatTanggalIndonesia(
            data.tanggal_pembuatan
          )}</p>
          <p style="margin: 10px 0; font-weight: bold;">KETUA UMUM</p>
          <p style="margin-top: 60px; font-weight: bold; text-decoration: underline;">${safeString(
            data.ttd_nama_lengkap
          )}</p>
          <p style="margin: 0;"><b>NRA. ${safeString(data.ttd_nra)}</b></p>
        </div>
      </div>
    `,
    formFields: [
      {
        name: "no_surat",
        label: "Nomor Surat",
        type: "text",
        placeholder: "Masukkan Nomor Surat",
        required: true,
      },
      {
        name: "nama",
        label: "Nama Penerima",
        type: "text",
        placeholder: "Masukkan Nama Penerima",
        required: true,
      },
      {
        name: "nra",
        label: "NRA Penerima",
        type: "text",
        placeholder: "Masukkan NRA Penerima",
        required: true,
      },
      {
        name: "jabatan",
        label: "Jabatan Penerima",
        type: "text",
        placeholder: "Masukkan Jabatan Penerima",
        required: true,
      },
      {
        name: "kesalahan",
        label: "Kesalahan",
        type: "textarea",
        placeholder: "",
        required: true,
      },
      {
        name: "tanggal_pembuatan",
        label: "Tanggal Pembuatan",
        type: "date",
        placeholder: "Pilih Tanggal Pembuatan",
        required: true,
      },
      {
        name: "ttd_nama",
        label: "Yang Bertandatangan",
        type: "select",
        placeholder: "Yang Bertandatangan",
        required: true,
        options: ["Ketua Umum"],
      },
      {
        name: "ttd_nra",
        label: "NRA Penandatangan",
        type: "text",
        placeholder: "NRA akan terisi otomatis",
        required: true,
        disabled: true,
      },
    ],
  },
  "Surat Keputusan": {
    title: "Surat Keputusan",
    template: (data) => `
      <div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
          <div style="display: flex; align-items: center; justify-content: center;">
            <img src="logo.png" alt="COCONUT Logo" style="width: 70px; height: auto; margin-right: 20px;" />
            <div>
              <h2 style="margin: 0; font-size: 14pt;">COMPUTER CLUB ORIENTED NETWORK, UTILITY AND TECHNOLOGY (COCONUT)</h2>
              <p style="margin: 0; font-size: 10pt;">Jl. Monumen Emmy Saelan III No. 70 Karunrung, Kec. Rappocini, Makassar</p>
              <p style="margin: 0; font-size: 10pt;">Telp. 085240791254/0895801262897, Website: www.coconut.or.id, Email: hello@coconut.or.id</p>
            </div>
          </div>
        </div>
        <div style="text-align: center; margin: 20px 0;">
          <p style="font-weight: bold; font-size: 14pt; text-decoration: underline;">SURAT KEPUTUSAN</p>
          <table style="font-size: 12pt; margin: 10px auto;">
            <tr><td style="width: 100px;">Nomor</td><td style="width: 20px;">:</td><td style="font-weight: bold;">${safeString(
              data.no_surat
            )}</td></tr>
            <tr><td>Lampiran</td><td>:</td><td>${
              safeString(data.lampiran) || "-"
            }</td></tr>
            <tr><td>Perihal</td><td>:</td><td style="font-weight: bold; text-decoration: underline;">${safeString(
              data.perihal
            )}</td></tr>
          </table>
          <p style="margin: 5px 0;">COMPUTER CLUB ORIENTED NETWORK, UTILITY AND TECHNOLOGY (COCONUT)</p>
          <p style="margin: 5px 0;">PERIODE ${safeString(data.periode)}</p>
        </div>
        <div style="margin: 20px 0; text-align: justify;">
          <p style="margin-bottom: 10px; text-align: center;">Bismillahirrahmanirrahim.</p>
          <p style="margin-bottom: 10px;">Dengan memohon petunjuk dan ridho Allah SWT. Dan setelah:</p>
          <p style="margin-bottom: 10px; font-weight: bold;">Menimbang:</p>
          <ol style="margin-left: 20px; margin-bottom: 10px;">
            <li>Bahwa untuk melaksanakan kegiatan ${safeString(
              data.nama_kegiatan
            )} maka perlu membentuk Panitia.</li>
            <li>Bahwa nama-nama tersebut dalam lampiran surat keputusan ini dipandang cakap dan mampu untuk menjadi panitia.</li>
          </ol>
          <p style="margin-bottom: 10px; font-weight: bold;">Mengingat:</p>
          <p style="margin-left: 20px; margin-bottom: 10px;">Program Kerja Badan Pengurus Harian Computer Club Oriented Network, Utility And Technology (COCONUT) Periode ${safeString(
            data.periode
          )}.</p>
          <p style="margin-bottom: 10px; font-weight: bold;">Memutuskan:</p>
          <ol style="margin-left: 20px; margin-bottom: 10px;">
            <li>Mengangkat nama-nama yang tercantum dalam lampiran surat keputusan ini sebagai Panitia Kegiatan ${safeString(
              data.nama_kegiatan
            )}.</li>
            <li>Dalam melaksanakan tugasnya panitia bertanggung jawab atas lancarnya kegiatan.</li>
            <li>Surat keputusan ini mulai berlaku pada tanggal ditetapkan.</li>
          </ol>
          <p style="margin-bottom: 10px;">Ditetapkan di : Makassar</p>
          <p style="margin-bottom: 10px;">Pada Tanggal : ${formatTanggalIndonesia(
            data.tanggal_pembuatan
          )}</p>
        </div>
        <div style="margin-top: 60px; text-align: right;">
          <p style="margin: 10px 0; font-weight: bold;">KETUA UMUM</p>
          <p style="margin-top: 60px; font-weight: bold; text-decoration: underline;">${safeString(
            data.ttd_nama_lengkap
          )}</p>
          <p style="margin: 0;">NRA. ${safeString(data.ttd_nra)}</p>
        </div>
        <div style="margin-top: 40px;">
          <table style="font-size: 12pt;">
            <tr><td style="width: 100px;">Lampiran</td><td style="width: 20px;">:</td><td>Surat Keputusan Panitia ${safeString(
              data.nama_kegiatan
            )}</td></tr>
            <tr><td>Nomor</td><td>:</td><td>${safeString(
              data.no_surat
            )}</td></tr>
            <tr><td>Tanggal</td><td>:</td><td>${formatTanggalIndonesia(
              data.tanggal_pembuatan
            )}</td></tr>
          </table>
          <p style="margin: 10px 0; font-weight: bold; text-align: center;">SUSUNAN PANITIA ${safeString(
            data.nama_kegiatan
          ).toUpperCase()}</p>
          <table style="width: 100%; font-size: 12pt; margin-bottom: 20px;">
            <tr><td style="width: 150px;">Ketua Pelaksana</td><td style="width: 20px;">:</td><td>${safeString(
              data.ketua_pelaksana
            )}</td><td>${
      data.ketua_pelaksana_nra
        ? `NRA. ${safeString(data.ketua_pelaksana_nra)}`
        : ""
    }</td></tr>
            <tr><td>Sekretaris</td><td>:</td><td>${safeString(
              data.sekretaris
            )}</td><td>${
      data.sekretaris_nra ? `NRA. ${safeString(data.sekretaris_nra)}` : ""
    }</td></tr>
            <tr><td>Bendahara</td><td>:</td><td>${safeString(
              data.bendahara
            )}</td><td>${
      data.bendahara_nra ? `NRA. ${safeString(data.bendahara_nra)}` : ""
    }</td></tr>
            <tr><td style="font-weight: bold;">Divisi Acara</td><td></td><td></td><td></td></tr>
            <tr><td>Koordinator</td><td>:</td><td>${safeString(
              data.acara_koordinator
            )}</td><td>${
      data.acara_koordinator_nra
        ? `NRA. ${safeString(data.acara_koordinator_nra)}`
        : ""
    }</td></tr>
            <tr><td>Anggota</td><td>:</td><td>${safeString(data.acara_anggota)
              .split(",")
              .join("<br/>")}</td><td></td></tr>
            <tr><td style="font-weight: bold;">Divisi Perlengkapan</td><td></td><td></td><td></td></tr>
            <tr><td>Koordinator</td><td>:</td><td>${safeString(
              data.perlengkapan_koordinator
            )}</td><td>${
      data.perlengkapan_koordinator_nra
        ? `NRA. ${safeString(data.perlengkapan_koordinator_nra)}`
        : ""
    }</td></tr>
            <tr><td>Anggota</td><td>:</td><td>${safeString(
              data.perlengkapan_anggota
            )
              .split(",")
              .join("<br/>")}</td><td></td></tr>
            <tr><td style="font-weight: bold;">Divisi Humas</td><td></td><td></td><td></td></tr>
            <tr><td>Koordinator</td><td>:</td><td>${safeString(
              data.humas_koordinator
            )}</td><td>${
      data.humas_koordinator_nra
        ? `NRA. ${safeString(data.humas_koordinator_nra)}`
        : ""
    }</td></tr>
            <tr><td>Anggota</td><td>:</td><td>${safeString(data.humas_anggota)
              .split(",")
              .join("<br/>")}</td><td></td></tr>
          </table>
          <p style="margin: 10px 0;">Ditetapkan di : Makassar</p>
          <p style="margin: 10px 0;">Pada Tanggal : ${formatTanggalIndonesia(
            data.tanggal_pembuatan
          )}</p>
          <p style="margin: 10px 0; text-align: right; font-weight: bold;">KETUA UMUM</p>
          <p style="margin-top: 60px; font-weight: bold; text-decoration: underline; text-align: right;">${safeString(
            data.ttd_nama_lengkap
          )}</p>
          <p style="margin: 0; text-align: right;"><b>NRA. ${safeString(
            data.ttd_nra
          )}</b></p>
        </div>
      </div>
    `,
    formFields: [
      {
        name: "no_surat",
        label: "Nomor Surat",
        type: "text",
        placeholder: "Masukkan Nomor Surat",
        required: true,
      },
      {
        name: "lampiran",
        label: "Lampiran",
        type: "text",
        placeholder: "Masukkan Lampiran (opsional)",
      },
      {
        name: "perihal",
        label: "Perihal",
        type: "text",
        placeholder: "Masukkan Perihal (contoh: Susunan Panitia)",
        required: true,
      },
      {
        name: "periode",
        label: "Periode",
        type: "text",
        placeholder: "Masukkan Periode (contoh: 2024-2025)",
        required: true,
      },
      {
        name: "nama_kegiatan",
        label: "Nama Kegiatan",
        type: "text",
        placeholder: "Masukkan Nama Kegiatan",
        required: true,
      },
      {
        name: "tanggal_pembuatan",
        label: "Tanggal Pembuatan",
        type: "date",
        placeholder: "Pilih Tanggal Pembuatan",
        required: true,
      },
      {
        name: "ketua_pelaksana",
        label: "Ketua Pelaksana",
        type: "text",
        placeholder: "Masukkan Nama Ketua Pelaksana",
        required: true,
      },
      {
        name: "ketua_pelaksana_nra",
        label: "NRA Ketua Pelaksana",
        type: "text",
        placeholder: "Masukkan NRA Ketua Pelaksana",
        required: true,
      },
      {
        name: "sekretaris",
        label: "Sekretaris",
        type: "text",
        placeholder: "Masukkan Nama Sekretaris",
        required: true,
      },
      {
        name: "sekretaris_nra",
        label: "NRA Sekretaris",
        type: "text",
        placeholder: "Masukkan NRA Sekretaris",
        required: true,
      },
      {
        name: "bendahara",
        label: "Bendahara",
        type: "text",
        placeholder: "Masukkan Nama Bendahara",
        required: true,
      },
      {
        name: "bendahara_nra",
        label: "NRA Bendahara",
        type: "text",
        placeholder: "Masukkan NRA Bendahara",
        required: true,
      },
      {
        name: "acara_koordinator",
        label: "Koordinator Divisi Acara",
        type: "text",
        placeholder: "Masukkan Nama Koordinator",
        required: true,
      },
      {
        name: "acara_koordinator_nra",
        label: "NRA Koordinator Divisi Acara",
        type: "text",
        placeholder: "Masukkan NRA Koordinator",
        required: true,
      },
      {
        name: "acara_anggota",
        label: "Anggota Divisi Acara",
        type: "textarea",
        placeholder: "Masukkan Nama Anggota (pisahkan dengan koma)",
        required: true,
      },
      {
        name: "perlengkapan_koordinator",
        label: "Koordinator Divisi Perlengkapan",
        type: "text",
        placeholder: "Masukkan Nama Koordinator",
        required: true,
      },
      {
        name: "perlengkapan_koordinator_nra",
        label: "NRA Koordinator Divisi Perlengkapan",
        type: "text",
        placeholder: "Masukkan NRA Koordinator",
        required: true,
      },
      {
        name: "perlengkapan_anggota",
        label: "Anggota Divisi Perlengkapan",
        type: "textarea",
        placeholder: "Masukkan Nama Anggota (pisahkan dengan koma)",
        required: true,
      },
      {
        name: "humas_koordinator",
        label: "Koordinator Divisi Humas",
        type: "text",
        placeholder: "Masukkan Nama Koordinator",
        required: true,
      },
      {
        name: "humas_koordinator_nra",
        label: "NRA Koordinator Divisi Humas",
        type: "text",
        placeholder: "Masukkan NRA Koordinator",
        required: true,
      },
      {
        name: "humas_anggota",
        label: "Anggota Divisi Humas",
        type: "textarea",
        placeholder: "Masukkan Nama Anggota (pisahkan dengan koma)",
        required: true,
      },
      {
        name: "ttd_nama",
        label: "Yang Bertandatangan",
        type: "select",
        placeholder: "Pilih Yang Bertandatangan",
        required: true,
        options: ["Ketua Umum"],
      },
      {
        name: "ttd_nra",
        label: "NRA Penandatangan",
        type: "text",
        placeholder: "Masukkan NRA Penandatangan",
        required: true,
      },
    ],
  },
  "Surat Izin Kegiatan": {
    title: "Surat Izin Kegiatan",
    template: (data) => `
      <div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
          <div style="display: flex; align-items: center; justify-content: center;">
            <img src="logo.png" alt="COCONUT Logo" style="width: 70px; height: auto; margin-right: 20px;" />
            <div>
              <h2 style="margin: 0; font-size: 14pt;">COMPUTER CLUB ORIENTED NETWORK, UTILITY AND TECHNOLOGY (COCONUT)</h2>
              <p style="margin: 0; font-size: 10pt;">Jl. Monumen Emmy Saelan III No. 70 Karunrung, Kec. Rappocini, Makassar</p>
              <p style="margin: 0; font-size: 10pt;">Telp. 085240791254/0895801262897, Website: www.coconut.or.id, Email: hello@coconut.or.id</p>
            </div>
          </div>
        </div>
        <div style="margin-bottom: 20px;">
          <table style="font-size: 12pt;">
            <tr><td style="width: 100px;">Nomor</td><td style="width: 20px;">:</td><td>${safeString(
              data.no_surat
            )}</td></tr>
            <tr><td>Lampiran</td><td>:</td><td>${
              safeString(data.lampiran) || "-"
            }</td></tr>
            <tr><td>Perihal</td><td>:</td><td style="font-weight: bold; text-decoration: underline;">Permohonan Izin Kegiatan</td></tr>
          </table>
        </div>
        <div style="margin: 20px 0;">
          <p style="margin: 0;">Kepada Yth.</p>
          <p style="margin: 5px 0;">${safeString(data.tujuan)}</p>
          <p style="margin: 5px 0;">Di Tempat</p>
        </div>
        <div style="margin: 20px 0; text-align: justify;">
          <p style="margin-bottom: 10px;">Assalamualaikum Wr. Wb,</p>
          <p style="margin-bottom: 10px;">Dengan Hormat,</p>
          <p style="text-indent: 40px; margin-bottom: 10px;">
            Sehubung dengan akan diadakannya kegiatan <strong>${safeString(
              data.nama_kegiatan
            )}</strong>, maka kami selaku 
            ${safeString(
              data.penyelenggara
            )} bermaksud memohon perizinan untuk melakukan kegiatan pada:
          </p>
          <table style="margin-left: 40px; margin-bottom: 20px; font-size: 12pt;">
            <tr><td style="width: 120px;">Hari/Tanggal</td><td style="width: 20px;">:</td><td>${
              data.tanggal_kegiatan
                ? formatTanggalIndonesia(data.tanggal_kegiatan)
                : "..........................."
            }</td></tr>
            <tr><td>Waktu</td><td>:</td><td>${safeString(data.waktu)}</td></tr>
            <tr><td>Tempat</td><td>:</td><td>${safeString(
              data.tempat
            )}</td></tr>
          </table>
          <p style="text-indent: 40px; margin-bottom: 10px;">
            Demikian surat ini kami sampaikan, atas perhatian dan bantuannya kami ucapkan terima kasih.
          </p>
          <p style="margin-bottom: 10px;">Wassalamualaikum Wr. Wb.</p>
        </div>
        <div style="margin-top: 60px; text-align: right;">
          <p style="margin: 0;">Makassar, ${formatTanggalIndonesia(
            data.tanggal_pembuatan
          )}</p>
          <p style="margin: 10px 0;">Mengetahui,</p>
          <p style="margin: 10px 0; font-weight: bold;">${safeString(
            data.ttd_jabatan
          )}</p>
          <p style="margin-top: 60px; font-weight: bold; text-decoration: underline;">${safeString(
            data.ttd_nama_lengkap
          )}</p>
          <p style="margin: 0;"><b>NRA. ${safeString(data.ttd_nra)}</b></p>
        </div>
      </div>
    `,
    formFields: [
      {
        name: "no_surat",
        label: "Nomor Surat",
        type: "text",
        placeholder: "Masukkan Nomor Surat",
        required: true,
      },
      {
        name: "lampiran",
        label: "Lampiran",
        type: "text",
        placeholder: "Masukkan Lampiran (opsional)",
      },
      {
        name: "tujuan",
        label: "Tujuan",
        type: "text",
        placeholder: "Masukkan Nama Tujuan",
        required: true,
      },
      {
        name: "nama_kegiatan",
        label: "Nama Kegiatan",
        type: "text",
        placeholder: "Masukkan Nama Kegiatan",
        required: true,
      },
      {
        name: "penyelenggara",
        label: "Penyelenggara",
        type: "text",
        placeholder: "Masukkan Penyelenggara",
        required: true,
      },
      {
        name: "tanggal_kegiatan",
        label: "Tanggal Kegiatan",
        type: "date",
        placeholder: "Pilih Tanggal Kegiatan",
        required: true,
      },
      {
        name: "waktu",
        label: "Waktu",
        type: "text",
        placeholder: "Masukkan Waktu Kegiatan (contoh: 14.30 – 18.00 WITA)",
        required: true,
      },
      {
        name: "tempat",
        label: "Tempat",
        type: "text",
        placeholder: "Masukkan Tempat Kegiatan",
        required: true,
      },
      {
        name: "tanggal_pembuatan",
        label: "Tanggal Pembuatan",
        type: "date",
        placeholder: "Pilih Tanggal Pembuatan",
        required: true,
      },
      {
        name: "ttd_nama",
        label: "Yang Bertandatangan",
        type: "select",
        placeholder: "Pilih Yang Bertandatangan",
        required: true,
        options: ["Ketua Umum"],
      },
      {
        name: "ttd_jabatan",
        label: "Jabatan Penandatangan",
        type: "text",
        placeholder: "Masukkan Jabatan Penandatangan",
        required: true,
      },
      {
        name: "ttd_nra",
        label: "NRA Penandatangan",
        type: "text",
        placeholder: "Masukkan NRA Penandatangan",
        required: true,
      },
    ],
  },
  "Surat Izin Sosialisasi": {
    title: "Surat Izin Sosialisasi",
    template: (data) => `
      <div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
          <div style="display: flex; align-items: center; justify-content: center;">
            <img src="logo.png" alt="COCONUT Logo" style="width: 70px; height: auto; margin-right: 20px;" />
            <div>
              <h2 style="margin: 0; font-size: 14pt;">COMPUTER CLUB ORIENTED NETWORK, UTILITY AND TECHNOLOGY (COCONUT)</h2>
              <p style="margin: 0; font-size: 10pt;">Jl. Monumen Emmy Saelan III No. 70 Karunrung, Kec. Rappocini, Makassar</p>
              <p style="margin: 0; font-size: 10pt;">Telp. 085240791254/0895801262897, Website: www.coconut.or.id, Email: hello@coconut.or.id</p>
            </div>
          </div>
        </div>
        <div style="margin-bottom: 20px;">
          <table style="font-size: 12pt;">
            <tr><td style="width: 100px;">Nomor</td><td style="width: 20px;">:</td><td>${safeString(
              data.no_surat
            )}</td></tr>
            <tr><td>Lampiran</td><td>:</td><td>${
              safeString(data.lampiran) || "-"
            }</td></tr>
            <tr><td>Perihal</td><td>:</td><td style="font-weight: bold; text-decoration: underline;">Permohonan Izin Sosialisasi</td></tr>
          </table>
        </div>
        <div style="margin: 20px 0;">
          <p style="margin: 0;">Kepada Yth.</p>
          <p style="margin: 5px 0;">${safeString(data.tujuan)}</p>
          <p style="margin: 5px 0;">${safeString(data.jabatan_tujuan)}</p>
          <p style="margin: 5px 0;">Di Tempat</p>
        </div>
        <div style="margin: 20px 0; text-align: justify;">
          <p style="margin-bottom: 10px;">Assalamualaikum Wr. Wb,</p>
          <p style="margin-bottom: 10px;">Dengan Hormat,</p>
          <p style="text-indent: 40px; margin-bottom: 10px;">
            Sehubung dengan akan diadakannya kegiatan <strong>${safeString(
              data.nama_kegiatan
            )}</strong>, maka kami selaku 
            ${safeString(
              data.penyelenggara
            )} bermaksud memohon perizinan untuk melakukan sosialisasi pada :
          </p>
          <table style="margin-left: 40px; margin-bottom: 20px; font-size: 12pt;">
            <tr><td style="width: 120px;">Hari/Tanggal</td><td style="width: 20px;">:</td><td>${
              data.tanggal_kegiatan
                ? formatTanggalIndonesia(data.tanggal_kegiatan)
                : "..........................."
            }</td></tr>
            <tr><td>Waktu</td><td>:</td><td>${safeString(data.waktu)}</td></tr>
            <tr><td>Tempat</td><td>:</td><td>${safeString(
              data.tempat
            )}</td></tr>
          </table>
          <p style="text-indent: 40px; margin-bottom: 10px;">
            Demikian surat ini kami sampaikan, atas perhatian dan bantuannya kami ucapkan terima kasih.
          </p>
          <p style="margin-bottom: 10px;">Wassalamualaikum Wr. Wb.</p>
        </div>
        <div style="margin-top: 60px;">
          <p style="margin: 0;">Makassar, ${formatTanggalIndonesia(
            data.tanggal_pembuatan
          )}</p>
          <table style="width: 100%; font-size: 12pt; margin-top: 20px;">
            <tr>
              <td style="width: 50%; text-align: center;">
                <p style="margin: 10px 0; font-weight: bold;">Ketua Panitia</p>
                <p style="margin-top: 60px; font-weight: bold; text-decoration: underline;">${safeString(
                  data.ketua_nama
                )}</p>
                <p style="margin: 5px 0;"><b>NRA. ${safeString(
                  data.ketua_nra
                )}</b></p>
              </td>
              <td style="width: 50%; text-align: center;">
                <p style="margin: 10px 0; font-weight: bold;">Sekretaris Panitia</p>
                <p style="margin-top: 60px; font-weight: bold; text-decoration: underline;">${safeString(
                  data.sekretaris_nama
                )}</p>
                <p style="margin: 5px 0"><b>NRA. ${safeString(
                  data.sekretaris_nra
                )}</b></p>
              </td>
            </tr>
          </table>
        </div>
      </div>
    `,
    formFields: [
      {
        name: "no_surat",
        label: "Nomor Surat",
        type: "text",
        placeholder: "Masukkan Nomor Surat",
        required: true,
      },
      {
        name: "lampiran",
        label: "Lampiran",
        type: "text",
        placeholder: "Masukkan Lampiran (opsional)",
      },
      {
        name: "tujuan",
        label: "Tujuan",
        type: "text",
        placeholder: "Masukkan Nama Tujuan",
        required: true,
      },
      {
        name: "jabatan_tujuan",
        label: "Jabatan Tujuan",
        type: "text",
        placeholder: "Masukkan Jabatan Tujuan",
        required: true,
      },
      {
        name: "nama_kegiatan",
        label: "Nama Kegiatan",
        type: "text",
        placeholder: "Masukkan Nama Kegiatan",
        required: true,
      },
      {
        name: "penyelenggara",
        label: "Penyelenggara",
        type: "text",
        placeholder: "Masukkan Penyelenggara",
        required: true,
      },
      {
        name: "tanggal_kegiatan",
        label: "Tanggal Kegiatan",
        type: "date",
        placeholder: "Pilih Tanggal Kegiatan",
        required: true,
      },
      {
        name: "waktu",
        label: "Waktu",
        type: "text",
        placeholder: "Masukkan Waktu Kegiatan (contoh: 13.00 – selesai WITA)",
        required: true,
      },
      {
        name: "tempat",
        label: "Tempat",
        type: "text",
        placeholder: "Masukkan Tempat Kegiatan",
        required: true,
      },
      {
        name: "tanggal_pembuatan",
        label: "Tanggal Pembuatan",
        type: "date",
        placeholder: "Pilih Tanggal Pembuatan",
        required: true,
      },
      {
        name: "ketua_nama",
        label: "Nama Ketua Panitia",
        type: "text",
        placeholder: "Masukkan Nama Ketua Panitia",
        required: true,
      },
      {
        name: "ketua_nra",
        label: "NRA Ketua Panitia",
        type: "text",
        placeholder: "Masukkan NRA Ketua Panitia",
        required: true,
      },
      {
        name: "sekretaris_nama",
        label: "Nama Sekretaris Panitia",
        type: "text",
        placeholder: "Masukkan Nama Sekretaris Panitia",
        required: true,
      },
      {
        name: "sekretaris_nra",
        label: "NRA Sekretaris Panitia",
        type: "text",
        placeholder: "Masukkan NRA Sekretaris Panitia",
        required: true,
      },
    ],
  },
  "Surat Pengantar": {
    title: "Surat Pengantar",
    template: (data) => `
      <div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
          <div style="display: flex; align-items: center; justify-content: center;">
            <img src="logo.png" alt="COCONUT Logo" style="width: 70px; height: auto; margin-right: 20px;" />
            <div>
              <h2 style="margin: 0; font-size: 14pt;">COMPUTER CLUB ORIENTED NETWORK, UTILITY AND TECHNOLOGY (COCONUT)</h2>
              <p style="margin: 0; font-size: 10pt;">Jl. Monumen Emmy Saelan III No. 70 Karunrung, Kec. Rappocini, Makassar</p>
              <p style="margin: 0; font-size: 10pt;">Telp. 085240791254/0895801262897, Website: www.coconut.or.id, Email: hello@coconut.or.id</p>
            </div>
          </div>
        </div>
        <div style="margin-bottom: 20px;">
          <table style="font-size: 12pt;">
            <tr><td style="width: 100px;">Nomor</td><td style="width: 20px;">:</td><td style="font-weight: bold;">${safeString(
              data.no_surat
            )}</td></tr>
            <tr><td>Lampiran</td><td>:</td><td>${
              safeString(data.lampiran) || "-"
            }</td></tr>
            <tr><td>Perihal</td><td>:</td><td style="font-weight: bold; text-decoration: underline;">Surat Pengantar</td></tr>
          </table>
        </div>
        <div style="margin: 20px 0;">
          <p style="margin: 0;">Kepada Yth.</p>
          <p style="margin: 5px 0;">${safeString(data.tujuan)}</p>
          <p style="margin: 5px 0;">Di Tempat</p>
        </div>
        <div style="margin: 20px 0; text-align: justify;">
          <p style="margin-bottom: 10px;">Assalamualaikum Wr. Wb,</p>
          <p style="margin-bottom: 10px;">Dengan Hormat,</p>
          <p style="text-indent: 40px; margin-bottom: 10px;">
            Sehubung dengan adanya kegiatan yakni <strong>${safeString(
              data.nama_kegiatan
            )}</strong> yang bertema 
            “${safeString(data.tema_kegiatan)}” guna ${safeString(
      data.tujuan_kegiatan
    )}, yang akan dilaksanakan pada:
          </p>
          <table style="margin-left: 40px; margin-bottom: 20px; font-size: 12pt;">
            <tr><td style="width: 120px;">Hari/Tanggal</td><td style="width: 20px;">:</td><td>${safeString(
              data.hari_tanggal
            )}</td></tr>
            <tr><td>Tempat</td><td>:</td><td>${safeString(
              data.tempat
            )}</td></tr>
          </table>
          <p style="text-indent: 40px; margin-bottom: 10px;">
            Demikian surat ini kami sampaikan, atas perhatian dan bantuannya kami ucapkan terima kasih.
          </p>
          <p style="margin-bottom: 10px;">Wassalamualaikum Wr. Wb.</p>
        </div>
        <div style="margin-top: 60px; text-align: right;">
          <p style="margin: 0;">Makassar, ${formatTanggalIndonesia(
            data.tanggal_pembuatan
          )}</p>
          <p style="margin: 10px 0;">Hormat Kami,</p>
          <p style="margin: 10px 0; font-weight: bold;">${safeString(
            data.ttd_jabatan
          )}</p>
          <p style="margin-top: 60px; font-weight: bold; text-decoration: underline;">${safeString(
            data.ttd_nama_lengkap
          )}</p>
          <p style="margin: 0;"><b>NRA. ${safeString(data.ttd_nra)}</b></p>
        </div>
      </div>
    `,
    formFields: [
      {
        name: "no_surat",
        label: "Nomor Surat",
        type: "text",
        placeholder: "Masukkan Nomor Surat",
        required: true,
      },
      {
        name: "lampiran",
        label: "Lampiran",
        type: "text",
        placeholder: "Masukkan Lampiran (opsional)",
      },
      {
        name: "tujuan",
        label: "Tujuan",
        type: "text",
        placeholder: "Masukkan Nama Tujuan",
        required: true,
      },
      {
        name: "nama_kegiatan",
        label: "Nama Kegiatan",
        type: "text",
        placeholder: "Masukkan Nama Kegiatan",
        required: true,
      },
      {
        name: "tema_kegiatan",
        label: "Tema Kegiatan",
        type: "text",
        placeholder: "Masukkan Tema Kegiatan",
        required: true,
      },
      {
        name: "tujuan_kegiatan",
        label: "Tujuan Kegiatan",
        type: "textarea",
        placeholder: "Masukkan Tujuan Kegiatan",
        required: true,
      },
      {
        name: "hari_tanggal",
        label: "Hari/Tanggal",
        type: "text",
        placeholder:
          "Masukkan Hari dan Tanggal (contoh: Senin - Sabtu, 5 Mei – 10 Mei 2025)",
        required: true,
      },
      {
        name: "tempat",
        label: "Tempat",
        type: "text",
        placeholder: "Masukkan Tempat Kegiatan",
        required: true,
      },
      {
        name: "tanggal_pembuatan",
        label: "Tanggal Pembuatan",
        type: "date",
        placeholder: "Pilih Tanggal Pembuatan",
        required: true,
      },
      {
        name: "ttd_nama",
        label: "Yang Bertandatangan",
        type: "select",
        placeholder: "Pilih Yang Bertandatangan",
        required: true,
        options: ["Ketua Umum"],
      },
      {
        name: "ttd_jabatan",
        label: "Jabatan Penandatangan",
        type: "text",
        placeholder: "Masukkan Jabatan Penandatangan",
        required: true,
      },
      {
        name: "ttd_nra",
        label: "NRA Penandatangan",
        type: "text",
        placeholder: "Masukkan NRA Penandatangan",
        required: true,
      },
    ],
  },
  "Surat Undangan": {
    title: "Surat Undangan",
    template: (data) => `
      <div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
          <div style="display: flex; align-items: center; justify-content: center;">
            <img src="logo.png" alt="COCONUT Logo" style="width: 70px; height: auto; margin-right: 20px;" />
            <div>
              <h2 style="margin: 0; font-size: 14pt;">COMPUTER CLUB ORIENTED NETWORK, UTILITY AND TECHNOLOGY (COCONUT)</h2>
              <p style="margin: 0; font-size: 10pt;">Jl. Monumen Emmy Saelan III No. 70 Karunrung, Kec. Rappocini, Makassar</p>
              <p style="margin: 0; font-size: 10pt;">Telp. 085240791254/0895801262897, Website: www.coconut.or.id, Email: hello@coconut.or.id</p>
            </div>
          </div>
        </div>
        <div style="margin-bottom: 20px;">
          <table style="font-size: 12pt;">
            <tr><td style="width: 100px;">Nomor</td><td style="width: 20px;">:</td><td style="font-weight: bold;">${safeString(
              data.no_surat
            )}</td></tr>
            <tr><td>Lampiran</td><td>:</td><td>${
              safeString(data.lampiran) || "-"
            }</td></tr>
            <tr><td>Perihal</td><td>:</td><td style="font-weight: bold; text-decoration: underline;">Undangan Menghadiri Kegiatan</td></tr>
          </table>
        </div>
        <div style="margin: 20px 0;">
          <p style="margin: 0;">Kepada</p>
          <p style="margin: 5px 0;">Yth. ${safeString(data.tujuan)}</p>
          <p style="margin: 5px 0;">Di Tempat</p>
        </div>
        <div style="margin: 20px 0; text-align: justify;">
          <p style="margin-bottom: 10px;">Assalamualaikum Wr. Wb,</p>
          <p style="margin-bottom: 10px;">Dengan Hormat,</p>
          <p style="text-indent: 40px; margin-bottom: 10px;">
            Sehubungan akan dilaksanakan kegiatan rutin COCONUT yakni <strong>${safeString(
              data.nama_kegiatan
            )}</strong> di mana kegiatan ini akan dilaksanakan pada:
          </p>
          <table style="margin-left: 40px; margin-bottom: 20px; font-size: 12pt;">
            <tr><td style="width: 120px;">Hari/Tanggal</td><td style="width: 20px;">:</td><td>${safeString(
              data.hari_tanggal
            )}</td></tr>
            <tr><td>Waktu</td><td>:</td><td>${safeString(data.waktu)}</td></tr>
            <tr><td>Tempat</td><td>:</td><td>${safeString(
              data.tempat
            )}</td></tr>
          </table>
          <p style="text-indent: 40px; margin-bottom: 10px;">
            Maka, dengan ini kami mengajukan permohonan agar kiranya Saudara/i dapat menghadiri kegiatan tersebut.
          </p>
          <p style="text-indent: 40px; margin-bottom: 10px;">
            Demikian surat ini kami sampaikan, atas perhatian dan bantuannya kami ucapkan terima kasih.
          </p>
          <p style="margin-bottom: 10px;">Wassalamualaikum Wr. Wb.</p>
        </div>
        <div style="margin-top: 60px;">
          <p style="margin: 0;">Makassar, ${formatTanggalIndonesia(
            data.tanggal_pembuatan
          )}</p>
          <table style="width: 100%; font-size: 12pt; margin-top: 20px;">
            <tr>
              <td style="width: 50%; text-align: center;">
                <p style="margin: 10px 0; font-weight: bold;">Ketua Panitia</p>
                <p style="margin-top: 60px; font-weight: bold; text-decoration: underline;">${safeString(
                  data.ketua_nama
                )}</p>
                <p style="margin: 5px 0;"><b>NRA. ${safeString(
                  data.ketua_nra
                )}</b></p>
              </td>
              <td style="width: 50%; text-align: center;">
                <p style="margin: 10px 0; font-weight: bold;">Sekretaris</p>
                <p style="margin-top: 60px; font-weight: bold; text-decoration: underline;">${safeString(
                  data.sekretaris_nama
                )}</p>
                <p style="margin: 5px 0;"><b>NRA. ${safeString(
                  data.sekretaris_nra
                )}</b></p>
              </td>
            </tr>
          </table>
          <p style="margin-top: 40px; text-align: right; font-weight: bold;">Mengetahui,</p>
          <table style="margin-left: auto; font-size: 12pt;">
            <tr>
              <td style="padding-right: 20px; font-weight: bold; text-decoration: underline;">${safeString(
                data.ttd_nama_lengkap
              )}</td>
              <td><b>NRA. ${safeString(data.ttd_nra)}</b></td>
            </tr>
          </table>
        </div>
      </div>
    `,
    formFields: [
      {
        name: "no_surat",
        label: "Nomor Surat",
        type: "text",
        placeholder: "Masukkan Nomor Surat",
        required: true,
      },
      {
        name: "lampiran",
        label: "Lampiran",
        type: "text",
        placeholder: "Masukkan Lampiran (opsional)",
      },
      {
        name: "tujuan",
        label: "Tujuan",
        type: "text",
        placeholder: "Masukkan Nama Tujuan",
        required: true,
      },
      {
        name: "nama_kegiatan",
        label: "Nama Kegiatan",
        type: "text",
        placeholder: "Masukkan Nama Kegiatan",
        required: true,
      },
      {
        name: "hari_tanggal",
        label: "Hari/Tanggal",
        type: "text",
        placeholder:
          "Masukkan Hari dan Tanggal (contoh: Jumat, 18 – 20 Oktober 2024)",
        required: true,
      },
      {
        name: "waktu",
        label: "Waktu",
        type: "text",
        placeholder: "Masukkan Waktu (contoh: 16:00 WITA – Selesai)",
        required: true,
      },
      {
        name: "tempat",
        label: "Tempat",
        type: "text",
        placeholder: "Masukkan Tempat Kegiatan",
        required: true,
      },
      {
        name: "tanggal_pembuatan",
        label: "Tanggal Pembuatan",
        type: "date",
        placeholder: "Pilih Tanggal Pembuatan",
        required: true,
      },
      {
        name: "ketua_nama",
        label: "Nama Ketua Panitia",
        type: "text",
        placeholder: "Masukkan Nama Ketua Panitia",
        required: true,
      },
      {
        name: "ketua_nra",
        label: "NRA Ketua Panitia",
        type: "text",
        placeholder: "Masukkan NRA Ketua Panitia",
        required: true,
      },
      {
        name: "sekretaris_nama",
        label: "Nama Sekretaris",
        type: "text",
        placeholder: "Masukkan Nama Sekretaris",
        required: true,
      },
      {
        name: "sekretaris_nra",
        label: "NRA Sekretaris",
        type: "text",
        placeholder: "Masukkan NRA Sekretaris",
        required: true,
      },
      {
        name: "ttd_nama",
        label: "Yang Bertandatangan",
        type: "select",
        placeholder: "Pilih Yang Bertandatangan",
        required: true,
        options: ["Ketua Umum"],
      },
      {
        name: "ttd_nra",
        label: "NRA Penandatangan",
        type: "text",
        placeholder: "Masukkan NRA Penandatangan",
        required: true,
      },
    ],
  },
};

export default function SuratKeluar() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPermohonan, setSelectedPermohonan] = useState(null);
  const [formData, setFormData] = useState({});
  const [previewContent, setPreviewContent] = useState("");
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [newRequestData, setNewRequestData] = useState({
    jenis_surat: "",
    keterangan: "",
  });
  const [viewContentOpen, setViewContentOpen] = useState(false);
  const [viewContent, setViewContent] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const pdfRef = useRef(null);

  const handleOpenForm = (permohonan) => {
    setSelectedPermohonan(permohonan);
    const template = suratTemplates[permohonan.jenis_surat];
    if (!template) {
      setError(`Template untuk ${permohonan.jenis_surat} tidak ditemukan`);
      return;
    }

    const formatDateSafely = (dateValue) => {
      if (!dateValue) return "";
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    };

    const formData = {};
    template.formFields.forEach((field) => {
      if (
        field.name === "tanggal_kegiatan" ||
        field.name === "tanggal_pembuatan"
      ) {
        formData[field.name] = formatDateSafely(permohonan[field.name]);
      } else {
        formData[field.name] = safeFormString(permohonan[field.name]);
      }
    });
    formData.jenis_surat = safeFormString(permohonan.jenis_surat);
    formData.keterangan = safeFormString(permohonan.keterangan);
    formData.status = safeFormString(permohonan.status) || "Diproses";
    formData.ttd_nama_lengkap =
      penandatanganOptions[formData.ttd_nama]?.namaLengkap || "";
    formData.ttd_nra =
      penandatanganOptions[formData.ttd_nama]?.nra || formData.ttd_nra || "";
    setFormData(formData);
  };

  const handleViewContent = (permohonan) => {
    const template = suratTemplates[permohonan.jenis_surat];
    if (!template) {
      setSnackbar({
        open: true,
        message: `Template untuk ${permohonan.jenis_surat} tidak ditemukan`,
        severity: "error",
      });
      return;
    }
    const content = template.template(permohonan);
    setViewContent(content);
    setViewContentOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedPermohonan(null);
    setFormData({});
    setPreviewContent("");
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };
    if (name === "ttd_nama") {
      updatedFormData.ttd_nama_lengkap =
        penandatanganOptions[value]?.namaLengkap || "";
      updatedFormData.ttd_nra =
        penandatanganOptions[value]?.nra || formData.ttd_nra || "";
    }
    setFormData(updatedFormData);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleNewRequestInputChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...newRequestData, [name]: value };
    if (name === "ttd_nama") {
      updatedData.ttd_nama_lengkap =
        penandatanganOptions[value]?.namaLengkap || "";
      updatedData.ttd_nra =
        penandatanganOptions[value]?.nra || newRequestData.ttd_nra || "";
    }
    setNewRequestData(updatedData);
  };

  const handleNewRequestFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setNewRequestData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const generatePreviewContent = (templateType, data) => {
    const template = suratTemplates[templateType];
    if (!template) {
      setSnackbar({
        open: true,
        message: `Template untuk ${templateType} tidak ditemukan`,
        severity: "error",
      });
      return null;
    }

    const requiredFields = template.formFields.filter((f) => f.required);
    for (let field of requiredFields) {
      if (!data[field.name]) {
        setSnackbar({
          open: true,
          message: `${field.label} wajib diisi.`,
          severity: "error",
        });
        return null;
      }
    }

    try {
      return template.template(data);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Gagal merender template surat.",
        severity: "error",
      });
      return null;
    }
  };
  const handleGenerateSurat = () => {
    if (!selectedPermohonan) {
      setSnackbar({
        open: true,
        message: "Pilih permohonan terlebih dahulu.",
        severity: "error",
      });
      return;
    }
    const content = generatePreviewContent(
      selectedPermohonan.jenis_surat,
      formData
    );
    if (content) {
      console.log("Setting view content, length:", content.length);
      setViewContent(content);
      setViewContentOpen(true);
      setSnackbar({
        open: true,
        message: "Isi surat berhasil dibuat. Silakan simpan atau print surat.",
        severity: "success",
      });
    }
  };
  const saveToArsip = async (printData, fileUrl) => {
    try {
      const arsipData = new FormData();
      arsipData.append("nomor", printData.no_surat);
      arsipData.append("tanggal", printData.tanggal_surat);
      arsipData.append("perihal", printData.perihal);
      arsipData.append("tipe", "Surat Keluar");
      arsipData.append("keterangan", `Surat keluar - ${printData.perihal}`);

      // Create HTML file for arsip
      const blob = new Blob(
        [
          `<!DOCTYPE html><html><head><title>${printData.perihal}</title><style>body{font-family:'Times New Roman',serif;font-size:12pt;line-height:1.5;margin:20px;}</style></head><body>${printData.content}</body></html>`,
        ],
        { type: "text/html" }
      );
      const file = new File([blob], `${printData.no_surat}_arsip.html`, {
        type: "text/html",
      });
      arsipData.append("file", file);

      const response = await fetch(API_ENDPOINTS.ARSIP_SURAT_ADD, {
        method: "POST",
        headers: getHeaders(true), // true for FormData
        body: arsipData,
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan ke arsip surat");
      }

      console.log("Surat berhasil disimpan ke arsip");
    } catch (error) {
      console.error("Error saving to arsip:", error);
      // Tidak throw error karena yang utama sudah tersimpan di surat keluar
    }
  };
  const handleSaveSurat = async () => {
    if (!viewContent) {
      setSnackbar({
        open: true,
        message: "Konten surat tidak tersedia",
        severity: "error",
      });
      return;
    }

    // Gunakan formData jika selectedPermohonan null (untuk surat baru)
    const currentData = selectedPermohonan || formData || newRequestData;
    const jenisS =
      currentData?.jenis_surat || formData?.jenis_surat || "Surat Umum";

    if (!currentData || !jenisS) {
      setSnackbar({
        open: true,
        message: "Data surat tidak lengkap. Silakan coba lagi.",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);

      // Generate content dengan data yang tersedia
      const content = generatePreviewContent(jenisS, {
        ...formData,
        ...currentData,
      });
      if (!content) {
        throw new Error("Gagal menghasilkan isi surat.");
      } // Format tanggal dengan benar
      const today = new Date().toISOString();
      const tanggalSurat =
        formData.tanggal_pembuatan || currentData.tanggal_pembuatan;
      const formattedTanggalSurat = tanggalSurat
        ? new Date(tanggalSurat).toISOString()
        : today;
      const formattedTanggalPembuatan = formData.tanggal_pembuatan
        ? new Date(formData.tanggal_pembuatan).toISOString()
        : today;

      const printData = {
        no_surat:
          formData.no_surat || currentData.no_surat || `SK-${Date.now()}`,
        perihal: formData.perihal || currentData.perihal || jenisS,
        tujuan_surat:
          formData.tujuan ||
          formData.nama_kegiatan ||
          currentData.tujuan ||
          "Internal",
        tanggal_surat: formattedTanggalSurat,
        tanggal_pembuatan: formattedTanggalPembuatan,
        status: "Terkirim",
        tipe_surat: jenisS,

        // Template specific fields based on current data
        ...(currentData.nama && { nama: currentData.nama }),
        ...(currentData.nra && { nra: currentData.nra }),
        ...(currentData.jabatan && { jabatan: currentData.jabatan }),
        ...(currentData.kesalahan && { kesalahan: currentData.kesalahan }),
        ...(currentData.periode && { periode: currentData.periode }),
        ...(currentData.nama_kegiatan && {
          nama_kegiatan: currentData.nama_kegiatan,
        }),
        ...(currentData.tanggal_kegiatan && {
          tanggal_kegiatan: currentData.tanggal_kegiatan
            ? new Date(currentData.tanggal_kegiatan).toISOString()
            : null,
        }),
        ...(currentData.waktu && { waktu: currentData.waktu }),
        ...(currentData.tempat && { tempat: currentData.tempat }),
        ...(currentData.ttd_nama && { ttd_nama: currentData.ttd_nama }),
        ...(currentData.ttd_nama_lengkap && {
          ttd_nama_lengkap: currentData.ttd_nama_lengkap,
        }),
        content: content,
      }; // Save to surat keluar using JSON format
      console.log("Sending data to backend:", printData);

      const response = await fetch(
        API_ENDPOINTS.SEKRETARIS.SURAT_KELUAR_CREATE,
        {
          method: "POST",
          headers: getHeaders(), // JSON headers, not FormData
          body: JSON.stringify(printData),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error response:", errorText);

        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      const savedData = await response.json();
      const fileUrl = savedData.data?.file_url || "#";

      // Simpan ke arsip surat setelah berhasil simpan ke surat keluar
      await saveToArsip(printData, fileUrl);

      // Update status permohonan hanya jika selectedPermohonan tersedia
      if (selectedPermohonan?.id) {
        await updatePermohonanStatus(selectedPermohonan.id, fileUrl);
      }

      setViewContentOpen(false);

      // Reset form data
      if (!selectedPermohonan) {
        setFormData({});
        setNewRequestData({ jenis_surat: "", keterangan: "" });
      }

      handleCloseForm();
      setSnackbar({
        open: true,
        message:
          "✅ Surat berhasil disimpan ke surat keluar dan arsip! Anda dapat melihatnya di halaman Arsip Surat.",
        severity: "success",
      });
    } catch (err) {
      setError("Gagal menyimpan surat: " + err.message);
      setSnackbar({
        open: true,
        message: "Gagal menyimpan surat: " + err.message,
        severity: "error",
      });
      console.error("Kesalahan di handleSaveSurat:", err);
    } finally {
      setLoading(false);
    }
  };
  const updatePermohonanStatus = async (id, fileUrl) => {
    const response = await fetch(
      API_ENDPOINTS.SEKRETARIS.PERMOHONAN_SURAT_UPDATE_STATUS(id),
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Selesai", file_url: fileUrl }),
      }
    );
    if (!response.ok) {
      throw new Error("Gagal memperbarui status permohonan");
    }
    // Status updated successfully, but we don't maintain a list anymore
  };
  const handlePrint = () => {
    if (!viewContent) {
      setSnackbar({
        open: true,
        message: "Silakan generate isi surat terlebih dahulu.",
        severity: "error",
      });
      return;
    }

    try {
      // Gunakan data yang tersedia untuk judul print
      const currentData = selectedPermohonan || formData || newRequestData;
      const jenisS =
        currentData?.jenis_surat || formData?.jenis_surat || "Surat";

      const printFrame = document.createElement("iframe");
      printFrame.style.position = "absolute";
      printFrame.style.left = "-9999px";
      document.body.appendChild(printFrame);
      printFrame.contentDocument.write(`
        <html>
          <head>
            <title>Cetak ${jenisS}</title>
            <style>
              body { 
                font-family: 'Times New Roman', serif; 
                font-size: 12pt;
                line-height: 1.5; 
                margin: 20px;
              }
              @page { margin: 20mm; }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            ${viewContent}
          </body>
        </html>
      `);
      printFrame.contentDocument.close();
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();

      // Feedback ke user
      setSnackbar({
        open: true,
        message:
          "🖨️ Dialog print telah dibuka. Silakan pilih printer dan cetak surat.",
        severity: "info",
      });

      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    } catch (error) {
      console.error("Error printing:", error);
      setSnackbar({
        open: true,
        message: "Gagal membuka dialog print. Silakan coba lagi.",
        severity: "error",
      });
    }
  };

  return (
    <Box>
      <StyledCard>
        <HeaderBox>
          <Typography variant="h6">Data Surat Keluar</Typography>
          <Button
            variant="outlined"
            startIcon={<OutboxIcon />}
            aria-label="Tambah Surat Baru"
            sx={{
              backgroundColor: "#ffffff",
              color: "#3097BA",
              borderColor: "#3097BA",
              "&:hover": {
                backgroundColor: "#ffffff",
                borderColor: "#3097BA",
              },
            }}
            onClick={() => setNewRequestOpen(true)}
          >
            Tambah Surat
          </Button>
        </HeaderBox>{" "}
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" p={3}>
              {error}
            </Typography>
          ) : (
            <Box p={4} textAlign="center">
              <Typography variant="h6" color="text.secondary" mb={2}>
                Klik "Tambah Surat" untuk membuat surat baru
              </Typography>
            </Box>
          )}
        </CardContent>
      </StyledCard>
      <Dialog
        open={newRequestOpen}
        onClose={() => setNewRequestOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Buat Surat Baru
          <IconButton
            aria-label="close"
            onClick={() => setNewRequestOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Typography
                sx={{ display: "block", mb: 1, fontWeight: 500, color: "#333" }}
              >
                Jenis Surat <span style={{ color: "red" }}>*</span>
              </Typography>
              <Select
                name="jenis_surat"
                value={newRequestData.jenis_surat}
                onChange={handleNewRequestInputChange}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#999",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                  },
                }}
              >
                <MenuItem value="">
                  <em>Pilih Jenis Surat</em>
                </MenuItem>
                {Object.keys(suratTemplates).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {newRequestData.jenis_surat &&
              suratTemplates[newRequestData.jenis_surat]?.formFields.map(
                (field) => (
                  <Box key={field.name} sx={{ mb: 3 }}>
                    <Typography
                      sx={{
                        display: "block",
                        mb: 1,
                        fontWeight: 500,
                        color: "#333",
                      }}
                    >
                      {field.label}{" "}
                      {field.required && (
                        <span style={{ color: "red" }}>*</span>
                      )}
                    </Typography>
                    {field.type === "select" ? (
                      <FormControl
                        fullWidth
                        error={field.required && !newRequestData[field.name]}
                      >
                        <Select
                          id={field.name}
                          name={field.name}
                          value={newRequestData[field.name] || ""}
                          onChange={handleNewRequestInputChange}
                          disabled={field.disabled}
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#ccc",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#999",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1976d2",
                            },
                          }}
                        >
                          <MenuItem value="Ketua Umum">Ketua Umum</MenuItem>
                          {/* <em>Pilih {field.label}</em>
                   </MenuItem>
                  {field.options?.map((option, index) => (
                  <MenuItem key={index} value={option}>
                  {option}
                  </MenuItem> */}
                          {/* ))} */}
                        </Select>
                        {field.required && !newRequestData[field.name] && (
                          <Typography color="error" variant="caption">
                            {field.label} wajib diisi
                          </Typography>
                        )}
                        {field.name === "ttd_nama" &&
                          newRequestData.ttd_nama && (
                            <Box sx={{ mt: 2 }}>
                              <Typography
                                sx={{
                                  display: "block",
                                  mb: 1,
                                  fontWeight: 500,
                                  color: "#333",
                                }}
                              >
                                Nama Yang Bertandatangan
                              </Typography>
                              <TextField
                                value={newRequestData.ttd_nama_lengkap || ""}
                                fullWidth
                                disabled
                                variant="outlined"
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    "& fieldset": { borderColor: "#ccc" },
                                    "&:hover fieldset": { borderColor: "#999" },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#1976d2",
                                    },
                                  },
                                }}
                              />
                            </Box>
                          )}
                      </FormControl>
                    ) : field.type === "file" ? (
                      <Box>
                        <input
                          id={field.name}
                          name={field.name}
                          type="file"
                          accept={field.accept || ".pdf,.doc,.docx"}
                          onChange={handleNewRequestFileChange}
                          style={{
                            marginTop: "8px",
                            display: "block",
                            fontSize: "16px",
                          }}
                        />
                        {newRequestData[field.name] && (
                          <Typography
                            variant="caption"
                            sx={{ mt: 1, color: "#555" }}
                          >
                            File terpilih:{" "}
                            {newRequestData[field.name].name ||
                              newRequestData[field.name]}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <TextField
                        id={field.name}
                        name={field.name}
                        value={newRequestData[field.name] || ""}
                        onChange={handleNewRequestInputChange}
                        placeholder={field.placeholder}
                        type={field.type === "date" ? "date" : "text"}
                        multiline={field.type === "textarea"}
                        rows={field.type === "textarea" ? 4 : 1}
                        fullWidth
                        variant="outlined"
                        disabled={field.disabled}
                        InputLabelProps={
                          field.type === "date" ? { shrink: true } : undefined
                        }
                        error={field.required && !newRequestData[field.name]}
                        helperText={
                          field.required && !newRequestData[field.name]
                            ? `${field.label} wajib diisi`
                            : ""
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#ccc" },
                            "&:hover fieldset": { borderColor: "#999" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#1976d2",
                            },
                          },
                        }}
                      />
                    )}
                  </Box>
                )
              )}
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{ display: "block", mb: 1, fontWeight: 500, color: "#333" }}
              >
                Keterangan
              </Typography>
              <TextField
                name="keterangan"
                value={newRequestData.keterangan || ""}
                onChange={handleNewRequestInputChange}
                placeholder="Masukkan keterangan tambahan (opsional)"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "#999" },
                    "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                  },
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setNewRequestOpen(false)} // Tambahkan handler untuk menutup dialog
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
            onClick={async () => {
              if (!newRequestData.jenis_surat) {
                setSnackbar({
                  open: true,
                  message: "Pilih jenis surat terlebih dahulu.",
                  severity: "error",
                });
                return;
              }

              const content = generatePreviewContent(
                newRequestData.jenis_surat,
                newRequestData
              );
              if (!content) return;

              // Set formData dengan newRequestData agar bisa digunakan di handleSaveSurat
              setFormData({
                ...newRequestData,
                jenis_surat: newRequestData.jenis_surat,
              });

              // Tampilkan isi surat
              setViewContent(content);
              setViewContentOpen(true);
              setNewRequestOpen(false);
              setSnackbar({
                open: true,
                message:
                  "Isi surat berhasil dibuat. Silakan simpan atau print surat.",
                severity: "success",
              });
            }}
            variant="contained"
            disabled={loading}
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
            Buat Surat
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={!!selectedPermohonan}
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Proses Permohonan Surat: {selectedPermohonan?.jenis_surat}
          <IconButton
            aria-label="close"
            onClick={handleCloseForm}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ mt: 2 }}>
            {selectedPermohonan &&
              suratTemplates[selectedPermohonan.jenis_surat]?.formFields.map(
                (field) => (
                  <Box key={field.name} sx={{ mb: 3 }}>
                    <Typography
                      sx={{
                        display: "block",
                        mb: 1,
                        fontWeight: 500,
                        color: "#333",
                      }}
                    >
                      {field.label}{" "}
                      {field.required && (
                        <span style={{ color: "red" }}>*</span>
                      )}
                    </Typography>
                    {field.type === "select" ? (
                      <FormControl
                        fullWidth
                        error={!formData[field.name] && field.required}
                      >
                        <Select
                          id={field.name}
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={handleInputChange}
                          disabled={field.disabled}
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#ccc",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#999",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1976d2",
                            },
                          }}
                        >
                          <MenuItem value="">
                            <em>Pilih {field.label}</em>
                          </MenuItem>
                          {field.options.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        {!formData[field.name] && field.required && (
                          <Typography color="error" variant="caption">
                            {field.label} wajib diisi
                          </Typography>
                        )}
                        {field.name === "ttd_nama" && formData.ttd_nama && (
                          <Box sx={{ mt: 2 }}>
                            <Typography
                              sx={{
                                display: "block",
                                mb: 1,
                                fontWeight: 500,
                                color: "#333",
                              }}
                            >
                              Nama Yang Bertandatangan
                            </Typography>
                            <TextField
                              value={formData.ttd_nama_lengkap || ""}
                              fullWidth
                              disabled
                              variant="outlined"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": { borderColor: "#ccc" },
                                  "&:hover fieldset": { borderColor: "#999" },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#1976d2",
                                  },
                                },
                              }}
                            />
                          </Box>
                        )}
                      </FormControl>
                    ) : field.type === "file" ? (
                      <Box>
                        <input
                          id={field.name}
                          name={field.name}
                          type="file"
                          accept={field.accept || ".pdf,.doc,.docx"}
                          onChange={handleFileChange}
                          style={{
                            marginTop: "8px",
                            display: "block",
                            fontSize: "16px",
                          }}
                        />
                        {formData[field.name] && (
                          <Typography
                            variant="caption"
                            sx={{ mt: 1, color: "#555" }}
                          >
                            File terpilih:{" "}
                            {formData[field.name].name || formData[field.name]}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <TextField
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        type={field.type === "date" ? "date" : "text"}
                        multiline={field.type === "textarea"}
                        rows={field.type === "textarea" ? 4 : 1}
                        fullWidth
                        variant="outlined"
                        disabled={field.disabled}
                        InputLabelProps={
                          field.type === "date" ? { shrink: true } : undefined
                        }
                        error={field.required && !formData[field.name]}
                        helperText={
                          field.required && !formData[field.name]
                            ? `${field.label} wajib diisi`
                            : ""
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#ccc" },
                            "&:hover fieldset": { borderColor: "#999" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#1976d2",
                            },
                          },
                        }}
                      />
                    )}
                  </Box>
                )
              )}
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{ display: "block", mb: 1, fontWeight: 500, color: "#333" }}
              >
                Keterangan
              </Typography>
              <TextField
                name="keterangan"
                value={formData.keterangan || ""}
                onChange={handleInputChange}
                placeholder="Masukkan keterangan tambahan (opsional)"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "#999" },
                    "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                  },
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="#3097BA">
            Batal
          </Button>{" "}
          <Button
            onClick={handleGenerateSurat}
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: "#2e7d32",
              "&:hover": { backgroundColor: "#1b5e20" },
            }}
          >
            Isi Surat
          </Button>
        </DialogActions>{" "}
      </Dialog>
      <Dialog
        open={viewContentOpen}
        onClose={() => setViewContentOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Isi Surat
          <IconButton
            aria-label="close"
            onClick={() => setViewContentOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div
            dangerouslySetInnerHTML={{ __html: viewContent }}
            style={{
              padding: "20px",
              fontFamily: "'Times New Roman', serif",
              fontSize: "12pt",
              lineHeight: 1.5,
            }}
          />{" "}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1, justifyContent: "flex-end" }}>
          <Button
            onClick={() => setViewContentOpen(false)}
            variant="outlined"
            sx={{
              color: "#666",
              borderColor: "#ccc",
              "&:hover": {
                borderColor: "#999",
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            Tutup
          </Button>
          <Button
            onClick={handleSaveSurat}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
            sx={{
              backgroundColor: "#4caf50",
              color: "white",
              "&:hover": { backgroundColor: "#388e3c" },
              "&:active": { backgroundColor: "#2e7d32" },
              "&:disabled": { backgroundColor: "#ccc" },
              fontWeight: 600,
            }}
          >
            {loading ? "Menyimpan..." : "Simpan Surat"}
          </Button>
          <Button
            onClick={handlePrint}
            variant="contained"
            startIcon={<PrintIcon />}
            disabled={loading}
            sx={{
              backgroundColor: "#2196f3",
              color: "white",
              "&:hover": { backgroundColor: "#1976d2" },
              "&:active": { backgroundColor: "#1565c0" },
              "&:disabled": { backgroundColor: "#ccc" },
              fontWeight: 600,
            }}
          >
            Print Surat
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
