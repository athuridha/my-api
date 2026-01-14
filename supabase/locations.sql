-- =====================================================
-- OLX LOCATIONS DATA
-- All Indonesian locations with OLX slugs
-- =====================================================

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100),
    province VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_locations_slug ON locations(slug);
CREATE INDEX IF NOT EXISTS idx_locations_region ON locations(region);
CREATE INDEX IF NOT EXISTS idx_locations_name ON locations(name);

-- Disable RLS for public access
ALTER TABLE locations DISABLE ROW LEVEL SECURITY;

-- Insert all major Indonesian locations with OLX slugs
INSERT INTO locations (slug, name, region, province) VALUES
-- DKI JAKARTA
('jakarta-dki_g2000007', 'DKI Jakarta', 'Jakarta', 'DKI Jakarta'),
('jakarta-pusat_g4000023', 'Jakarta Pusat', 'Jakarta', 'DKI Jakarta'),
('jakarta-utara_g4000024', 'Jakarta Utara', 'Jakarta', 'DKI Jakarta'),
('jakarta-barat_g4000025', 'Jakarta Barat', 'Jakarta', 'DKI Jakarta'),
('jakarta-selatan_g4000030', 'Jakarta Selatan', 'Jakarta', 'DKI Jakarta'),
('jakarta-timur_g4000026', 'Jakarta Timur', 'Jakarta', 'DKI Jakarta'),
('kepulauan-seribu_g4000027', 'Kepulauan Seribu', 'Jakarta', 'DKI Jakarta'),

-- JAWA BARAT
('jawa-barat_g2000008', 'Jawa Barat', 'Jawa Barat', 'Jawa Barat'),
('bandung-kota_g4000050', 'Bandung Kota', 'Jawa Barat', 'Jawa Barat'),
('bandung-kabupaten_g4000051', 'Bandung Kabupaten', 'Jawa Barat', 'Jawa Barat'),
('bandung-barat_g4000052', 'Bandung Barat', 'Jawa Barat', 'Jawa Barat'),
('bekasi-kota_g4000053', 'Bekasi Kota', 'Jawa Barat', 'Jawa Barat'),
('bekasi-kabupaten_g4000054', 'Bekasi Kabupaten', 'Jawa Barat', 'Jawa Barat'),
('bogor-kota_g4000055', 'Bogor Kota', 'Jawa Barat', 'Jawa Barat'),
('bogor-kabupaten_g4000056', 'Bogor Kabupaten', 'Jawa Barat', 'Jawa Barat'),
('cimahi_g4000057', 'Cimahi', 'Jawa Barat', 'Jawa Barat'),
('cirebon-kota_g4000058', 'Cirebon Kota', 'Jawa Barat', 'Jawa Barat'),
('cirebon-kabupaten_g4000059', 'Cirebon Kabupaten', 'Jawa Barat', 'Jawa Barat'),
('depok_g4000060', 'Depok', 'Jawa Barat', 'Jawa Barat'),
('garut_g4000061', 'Garut', 'Jawa Barat', 'Jawa Barat'),
('indramayu_g4000062', 'Indramayu', 'Jawa Barat', 'Jawa Barat'),
('karawang_g4000063', 'Karawang', 'Jawa Barat', 'Jawa Barat'),
('kuningan_g4000064', 'Kuningan', 'Jawa Barat', 'Jawa Barat'),
('majalengka_g4000065', 'Majalengka', 'Jawa Barat', 'Jawa Barat'),
('purwakarta_g4000066', 'Purwakarta', 'Jawa Barat', 'Jawa Barat'),
('subang_g4000067', 'Subang', 'Jawa Barat', 'Jawa Barat'),
('sukabumi-kota_g4000068', 'Sukabumi Kota', 'Jawa Barat', 'Jawa Barat'),
('sukabumi-kabupaten_g4000069', 'Sukabumi Kabupaten', 'Jawa Barat', 'Jawa Barat'),
('sumedang_g4000070', 'Sumedang', 'Jawa Barat', 'Jawa Barat'),
('tasikmalaya-kota_g4000071', 'Tasikmalaya Kota', 'Jawa Barat', 'Jawa Barat'),
('tasikmalaya-kabupaten_g4000072', 'Tasikmalaya Kabupaten', 'Jawa Barat', 'Jawa Barat'),
('cianjur_g4000073', 'Cianjur', 'Jawa Barat', 'Jawa Barat'),
('pangandaran_g4000074', 'Pangandaran', 'Jawa Barat', 'Jawa Barat'),

-- BANTEN
('banten_g2000009', 'Banten', 'Banten', 'Banten'),
('tangerang-kota_g4000080', 'Tangerang Kota', 'Banten', 'Banten'),
('tangerang-kabupaten_g4000081', 'Tangerang Kabupaten', 'Banten', 'Banten'),
('tangerang-selatan_g4000082', 'Tangerang Selatan', 'Banten', 'Banten'),
('serang-kota_g4000083', 'Serang Kota', 'Banten', 'Banten'),
('serang-kabupaten_g4000084', 'Serang Kabupaten', 'Banten', 'Banten'),
('cilegon_g4000085', 'Cilegon', 'Banten', 'Banten'),
('lebak_g4000086', 'Lebak', 'Banten', 'Banten'),
('pandeglang_g4000087', 'Pandeglang', 'Banten', 'Banten'),

-- JAWA TENGAH
('jawa-tengah_g2000010', 'Jawa Tengah', 'Jawa Tengah', 'Jawa Tengah'),
('semarang-kota_g4000100', 'Semarang Kota', 'Jawa Tengah', 'Jawa Tengah'),
('semarang-kabupaten_g4000101', 'Semarang Kabupaten', 'Jawa Tengah', 'Jawa Tengah'),
('solo_g4000102', 'Solo/Surakarta', 'Jawa Tengah', 'Jawa Tengah'),
('magelang-kota_g4000103', 'Magelang Kota', 'Jawa Tengah', 'Jawa Tengah'),
('magelang-kabupaten_g4000104', 'Magelang Kabupaten', 'Jawa Tengah', 'Jawa Tengah'),
('pekalongan-kota_g4000105', 'Pekalongan Kota', 'Jawa Tengah', 'Jawa Tengah'),
('pekalongan-kabupaten_g4000106', 'Pekalongan Kabupaten', 'Jawa Tengah', 'Jawa Tengah'),
('tegal-kota_g4000107', 'Tegal Kota', 'Jawa Tengah', 'Jawa Tengah'),
('tegal-kabupaten_g4000108', 'Tegal Kabupaten', 'Jawa Tengah', 'Jawa Tengah'),
('salatiga_g4000109', 'Salatiga', 'Jawa Tengah', 'Jawa Tengah'),
('kendal_g4000110', 'Kendal', 'Jawa Tengah', 'Jawa Tengah'),
('demak_g4000111', 'Demak', 'Jawa Tengah', 'Jawa Tengah'),
('kudus_g4000112', 'Kudus', 'Jawa Tengah', 'Jawa Tengah'),
('jepara_g4000113', 'Jepara', 'Jawa Tengah', 'Jawa Tengah'),
('pati_g4000114', 'Pati', 'Jawa Tengah', 'Jawa Tengah'),
('rembang_g4000115', 'Rembang', 'Jawa Tengah', 'Jawa Tengah'),
('blora_g4000116', 'Blora', 'Jawa Tengah', 'Jawa Tengah'),
('grobogan_g4000117', 'Grobogan', 'Jawa Tengah', 'Jawa Tengah'),
('boyolali_g4000118', 'Boyolali', 'Jawa Tengah', 'Jawa Tengah'),
('klaten_g4000119', 'Klaten', 'Jawa Tengah', 'Jawa Tengah'),
('sukoharjo_g4000120', 'Sukoharjo', 'Jawa Tengah', 'Jawa Tengah'),
('wonogiri_g4000121', 'Wonogiri', 'Jawa Tengah', 'Jawa Tengah'),
('karanganyar_g4000122', 'Karanganyar', 'Jawa Tengah', 'Jawa Tengah'),
('sragen_g4000123', 'Sragen', 'Jawa Tengah', 'Jawa Tengah'),
('purworejo_g4000124', 'Purworejo', 'Jawa Tengah', 'Jawa Tengah'),
('wonosobo_g4000125', 'Wonosobo', 'Jawa Tengah', 'Jawa Tengah'),
('temanggung_g4000126', 'Temanggung', 'Jawa Tengah', 'Jawa Tengah'),
('kebumen_g4000127', 'Kebumen', 'Jawa Tengah', 'Jawa Tengah'),
('banyumas_g4000128', 'Banyumas', 'Jawa Tengah', 'Jawa Tengah'),
('cilacap_g4000129', 'Cilacap', 'Jawa Tengah', 'Jawa Tengah'),
('purbalingga_g4000130', 'Purbalingga', 'Jawa Tengah', 'Jawa Tengah'),
('banjarnegara_g4000131', 'Banjarnegara', 'Jawa Tengah', 'Jawa Tengah'),
('brebes_g4000132', 'Brebes', 'Jawa Tengah', 'Jawa Tengah'),
('pemalang_g4000133', 'Pemalang', 'Jawa Tengah', 'Jawa Tengah'),
('batang_g4000134', 'Batang', 'Jawa Tengah', 'Jawa Tengah'),

-- YOGYAKARTA
('yogyakarta_g2000011', 'DI Yogyakarta', 'Yogyakarta', 'DI Yogyakarta'),
('yogyakarta-kota_g4000140', 'Yogyakarta Kota', 'Yogyakarta', 'DI Yogyakarta'),
('sleman_g4000141', 'Sleman', 'Yogyakarta', 'DI Yogyakarta'),
('bantul_g4000142', 'Bantul', 'Yogyakarta', 'DI Yogyakarta'),
('kulonprogo_g4000143', 'Kulon Progo', 'Yogyakarta', 'DI Yogyakarta'),
('gunungkidul_g4000144', 'Gunung Kidul', 'Yogyakarta', 'DI Yogyakarta'),

-- JAWA TIMUR
('jawa-timur_g2000012', 'Jawa Timur', 'Jawa Timur', 'Jawa Timur'),
('surabaya_g4000150', 'Surabaya', 'Jawa Timur', 'Jawa Timur'),
('malang-kota_g4000151', 'Malang Kota', 'Jawa Timur', 'Jawa Timur'),
('malang-kabupaten_g4000152', 'Malang Kabupaten', 'Jawa Timur', 'Jawa Timur'),
('sidoarjo_g4000153', 'Sidoarjo', 'Jawa Timur', 'Jawa Timur'),
('gresik_g4000154', 'Gresik', 'Jawa Timur', 'Jawa Timur'),
('pasuruan-kota_g4000155', 'Pasuruan Kota', 'Jawa Timur', 'Jawa Timur'),
('pasuruan-kabupaten_g4000156', 'Pasuruan Kabupaten', 'Jawa Timur', 'Jawa Timur'),
('mojokerto-kota_g4000157', 'Mojokerto Kota', 'Jawa Timur', 'Jawa Timur'),
('mojokerto-kabupaten_g4000158', 'Mojokerto Kabupaten', 'Jawa Timur', 'Jawa Timur'),
('kediri-kota_g4000159', 'Kediri Kota', 'Jawa Timur', 'Jawa Timur'),
('kediri-kabupaten_g4000160', 'Kediri Kabupaten', 'Jawa Timur', 'Jawa Timur'),
('blitar-kota_g4000161', 'Blitar Kota', 'Jawa Timur', 'Jawa Timur'),
('blitar-kabupaten_g4000162', 'Blitar Kabupaten', 'Jawa Timur', 'Jawa Timur'),
('madiun-kota_g4000163', 'Madiun Kota', 'Jawa Timur', 'Jawa Timur'),
('madiun-kabupaten_g4000164', 'Madiun Kabupaten', 'Jawa Timur', 'Jawa Timur'),
('probolinggo-kota_g4000165', 'Probolinggo Kota', 'Jawa Timur', 'Jawa Timur'),
('probolinggo-kabupaten_g4000166', 'Probolinggo Kabupaten', 'Jawa Timur', 'Jawa Timur'),
('batu_g4000167', 'Batu', 'Jawa Timur', 'Jawa Timur'),
('jember_g4000168', 'Jember', 'Jawa Timur', 'Jawa Timur'),
('banyuwangi_g4000169', 'Banyuwangi', 'Jawa Timur', 'Jawa Timur'),
('bondowoso_g4000170', 'Bondowoso', 'Jawa Timur', 'Jawa Timur'),
('situbondo_g4000171', 'Situbondo', 'Jawa Timur', 'Jawa Timur'),
('lumajang_g4000172', 'Lumajang', 'Jawa Timur', 'Jawa Timur'),
('tulungagung_g4000173', 'Tulungagung', 'Jawa Timur', 'Jawa Timur'),
('trenggalek_g4000174', 'Trenggalek', 'Jawa Timur', 'Jawa Timur'),
('ponorogo_g4000175', 'Ponorogo', 'Jawa Timur', 'Jawa Timur'),
('pacitan_g4000176', 'Pacitan', 'Jawa Timur', 'Jawa Timur'),
('ngawi_g4000177', 'Ngawi', 'Jawa Timur', 'Jawa Timur'),
('magetan_g4000178', 'Magetan', 'Jawa Timur', 'Jawa Timur'),
('nganjuk_g4000179', 'Nganjuk', 'Jawa Timur', 'Jawa Timur'),
('jombang_g4000180', 'Jombang', 'Jawa Timur', 'Jawa Timur'),
('bojonegoro_g4000181', 'Bojonegoro', 'Jawa Timur', 'Jawa Timur'),
('tuban_g4000182', 'Tuban', 'Jawa Timur', 'Jawa Timur'),
('lamongan_g4000183', 'Lamongan', 'Jawa Timur', 'Jawa Timur'),
('bangkalan_g4000184', 'Bangkalan', 'Jawa Timur', 'Jawa Timur'),
('sampang_g4000185', 'Sampang', 'Jawa Timur', 'Jawa Timur'),
('pamekasan_g4000186', 'Pamekasan', 'Jawa Timur', 'Jawa Timur'),
('sumenep_g4000187', 'Sumenep', 'Jawa Timur', 'Jawa Timur'),

-- BALI
('bali_g2000013', 'Bali', 'Bali', 'Bali'),
('denpasar_g4000200', 'Denpasar', 'Bali', 'Bali'),
('badung_g4000201', 'Badung', 'Bali', 'Bali'),
('gianyar_g4000202', 'Gianyar', 'Bali', 'Bali'),
('tabanan_g4000203', 'Tabanan', 'Bali', 'Bali'),
('buleleng_g4000204', 'Buleleng', 'Bali', 'Bali'),
('karangasem_g4000205', 'Karangasem', 'Bali', 'Bali'),
('klungkung_g4000206', 'Klungkung', 'Bali', 'Bali'),
('bangli_g4000207', 'Bangli', 'Bali', 'Bali'),
('jembrana_g4000208', 'Jembrana', 'Bali', 'Bali'),

-- SUMATERA UTARA
('sumatera-utara_g2000001', 'Sumatera Utara', 'Sumatera', 'Sumatera Utara'),
('medan_g4000001', 'Medan', 'Sumatera', 'Sumatera Utara'),
('deli-serdang_g4000002', 'Deli Serdang', 'Sumatera', 'Sumatera Utara'),
('binjai_g4000003', 'Binjai', 'Sumatera', 'Sumatera Utara'),
('pematangsiantar_g4000004', 'Pematang Siantar', 'Sumatera', 'Sumatera Utara'),

-- SUMATERA BARAT
('sumatera-barat_g2000002', 'Sumatera Barat', 'Sumatera', 'Sumatera Barat'),
('padang_g4000010', 'Padang', 'Sumatera', 'Sumatera Barat'),
('bukittinggi_g4000011', 'Bukittinggi', 'Sumatera', 'Sumatera Barat'),

-- RIAU
('riau_g2000003', 'Riau', 'Sumatera', 'Riau'),
('pekanbaru_g4000015', 'Pekanbaru', 'Sumatera', 'Riau'),
('dumai_g4000016', 'Dumai', 'Sumatera', 'Riau'),

-- KEPULAUAN RIAU
('kepulauan-riau_g2000004', 'Kepulauan Riau', 'Sumatera', 'Kepulauan Riau'),
('batam_g4000020', 'Batam', 'Sumatera', 'Kepulauan Riau'),
('tanjungpinang_g4000021', 'Tanjung Pinang', 'Sumatera', 'Kepulauan Riau'),

-- SUMATERA SELATAN
('sumatera-selatan_g2000005', 'Sumatera Selatan', 'Sumatera', 'Sumatera Selatan'),
('palembang_g4000030', 'Palembang', 'Sumatera', 'Sumatera Selatan'),

-- LAMPUNG
('lampung_g2000006', 'Lampung', 'Sumatera', 'Lampung'),
('bandar-lampung_g4000035', 'Bandar Lampung', 'Sumatera', 'Lampung'),

-- KALIMANTAN
('kalimantan-barat_g2000014', 'Kalimantan Barat', 'Kalimantan', 'Kalimantan Barat'),
('pontianak_g4000220', 'Pontianak', 'Kalimantan', 'Kalimantan Barat'),
('kalimantan-tengah_g2000015', 'Kalimantan Tengah', 'Kalimantan', 'Kalimantan Tengah'),
('palangkaraya_g4000225', 'Palangka Raya', 'Kalimantan', 'Kalimantan Tengah'),
('kalimantan-selatan_g2000016', 'Kalimantan Selatan', 'Kalimantan', 'Kalimantan Selatan'),
('banjarmasin_g4000230', 'Banjarmasin', 'Kalimantan', 'Kalimantan Selatan'),
('kalimantan-timur_g2000017', 'Kalimantan Timur', 'Kalimantan', 'Kalimantan Timur'),
('balikpapan_g4000235', 'Balikpapan', 'Kalimantan', 'Kalimantan Timur'),
('samarinda_g4000236', 'Samarinda', 'Kalimantan', 'Kalimantan Timur'),
('kalimantan-utara_g2000018', 'Kalimantan Utara', 'Kalimantan', 'Kalimantan Utara'),
('tarakan_g4000240', 'Tarakan', 'Kalimantan', 'Kalimantan Utara'),

-- SULAWESI
('sulawesi-utara_g2000019', 'Sulawesi Utara', 'Sulawesi', 'Sulawesi Utara'),
('manado_g4000250', 'Manado', 'Sulawesi', 'Sulawesi Utara'),
('sulawesi-tengah_g2000020', 'Sulawesi Tengah', 'Sulawesi', 'Sulawesi Tengah'),
('palu_g4000255', 'Palu', 'Sulawesi', 'Sulawesi Tengah'),
('sulawesi-selatan_g2000021', 'Sulawesi Selatan', 'Sulawesi', 'Sulawesi Selatan'),
('makassar_g4000260', 'Makassar', 'Sulawesi', 'Sulawesi Selatan'),
('sulawesi-tenggara_g2000022', 'Sulawesi Tenggara', 'Sulawesi', 'Sulawesi Tenggara'),
('kendari_g4000265', 'Kendari', 'Sulawesi', 'Sulawesi Tenggara'),
('gorontalo_g2000023', 'Gorontalo', 'Sulawesi', 'Gorontalo'),
('sulawesi-barat_g2000024', 'Sulawesi Barat', 'Sulawesi', 'Sulawesi Barat'),

-- NTB & NTT
('nusa-tenggara-barat_g2000025', 'Nusa Tenggara Barat', 'Nusa Tenggara', 'NTB'),
('mataram_g4000270', 'Mataram', 'Nusa Tenggara', 'NTB'),
('lombok_g4000271', 'Lombok', 'Nusa Tenggara', 'NTB'),
('nusa-tenggara-timur_g2000026', 'Nusa Tenggara Timur', 'Nusa Tenggara', 'NTT'),
('kupang_g4000275', 'Kupang', 'Nusa Tenggara', 'NTT'),

-- MALUKU & PAPUA
('maluku_g2000027', 'Maluku', 'Indonesia Timur', 'Maluku'),
('ambon_g4000280', 'Ambon', 'Indonesia Timur', 'Maluku'),
('maluku-utara_g2000028', 'Maluku Utara', 'Indonesia Timur', 'Maluku Utara'),
('papua_g2000029', 'Papua', 'Indonesia Timur', 'Papua'),
('jayapura_g4000285', 'Jayapura', 'Indonesia Timur', 'Papua'),
('papua-barat_g2000030', 'Papua Barat', 'Indonesia Timur', 'Papua Barat'),

-- ACEH
('aceh_g2000031', 'Aceh', 'Sumatera', 'Aceh'),
('banda-aceh_g4000290', 'Banda Aceh', 'Sumatera', 'Aceh'),

-- JAMBI
('jambi_g2000032', 'Jambi', 'Sumatera', 'Jambi'),
('jambi-kota_g4000295', 'Jambi Kota', 'Sumatera', 'Jambi'),

-- BENGKULU
('bengkulu_g2000033', 'Bengkulu', 'Sumatera', 'Bengkulu'),
('bengkulu-kota_g4000300', 'Bengkulu Kota', 'Sumatera', 'Bengkulu'),

-- BANGKA BELITUNG
('bangka-belitung_g2000034', 'Bangka Belitung', 'Sumatera', 'Bangka Belitung'),
('pangkalpinang_g4000305', 'Pangkal Pinang', 'Sumatera', 'Bangka Belitung')

ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    region = EXCLUDED.region,
    province = EXCLUDED.province;

-- Verify
SELECT COUNT(*) as total_locations FROM locations;
