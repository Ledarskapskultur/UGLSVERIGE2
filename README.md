
# UGL Sverige – Bokningssystem med SMS & Excel

Detta Streamlit-projekt låter dig:
- Mata in kunduppgifter
- Skicka boknings-SMS via 46elks
- Spara all data till Excel (kunddata.xlsx)
- Fungerar på Streamlit Cloud

## Installation

1. Ladda upp filerna till [Streamlit Cloud](https://streamlit.io/cloud) eller kör lokalt.
2. Installera beroenden:

```bash
pip install streamlit pandas requests openpyxl
```

3. Kör appen med:

```bash
streamlit run streamlit_sms_bokning.py
```

## Filer

- `streamlit_sms_bokning.py` – Huvudappen
- `kunddata.xlsx` – Excel-fil där bokningar sparas
- `README.md` – Den här guiden
