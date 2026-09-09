/* UGL Sverige, kursdata. Format per rad:
   startdatum|vecka|anlaggning|ort|handledare (semikolon)|logipris|status (L=ledig, F=fullbokad)
   Kurspris ar 23 900 kr for samtliga. Slutdatum = start + 4 dagar. */
window.UGL_KURSPRIS = 23900;
window.UGL_RADER = `
2026-09-14|38|Bykrogen|Kristianstad|Nurgül Iljas Eminovska;Susann Swahn|8900|L
2026-09-14|38|Skevik|Värmdö|Jenny Westring;Matti Kortelainen|9900|F
2026-09-21|39|Bosön Mästarvillan|Lidingö|Carina Nilimaa;Linda Strömberg|9900|F
2026-09-21|39|Bykrogen|Kristianstad|Annette Melander Berg;Vickie Peolin|8900|L
2026-09-28|40|Sundsgården Hotell & Konferens|Helsingborg|Åsa Andersson;Marianne Littke|8900|L
2026-09-28|40|Bosön Mästarvillan|Lidingö|Annica Nordén;Pernilla Johansson|9900|F
2026-10-05|41|Tylebäck|Halmstad|Petra Myhrman;Susanna Nygren|8900|L
2026-10-05|41|Skevik|Värmdö|Anne Karlström;Arvid Stark|9900|L
2026-10-12|42|Hällsnäs Hotell & Konferens|Mölnlycke|Carl-Henrik Lagnefors|9900|F
2026-10-12|42|Skogshem & Wijk|Lidingö|Lotta Ottosson;Sofia Hedberg|9900|L
2026-10-12|42|Gottskär Hotell|Göteborg|Carl-Henrik Lagnefors;Moa Amalot|9900|F
2026-10-19|43|Sundsgården Hotell & Konferens|Helsingborg|Annika Ambjörnsson;Hanna Wiik Olsson|8900|L
2026-10-19|43|Näsby slott|Täby|Jan-Erik Richnau;Linda Strömberg|9900|F
2026-10-19|43|Lovik|Stockholm|Lisa Carlberg|9900|L
2026-11-02|45|Lovik|Stockholm|Dan Nordlöf;Tomas Edlund|10500|L
2026-11-09|46|Ringenäs|Halmstad|Anna Falk;Carina Nilimaa|9900|L
2026-11-09|46|Bosön Mästarvillan|Lidingö|Gisela Gustavsson;Moa Amalot|10500|L
2026-11-09|46|Hagastrand|Stockholm|Carl-Henrik Lagnefors;Jessica Lindvert|10500|F
2026-11-16|47|Sundsgården Hotell & Konferens|Helsingborg|Annette Melander Berg;Marie Olsson|9500|L
2026-11-16|47|Hotel J|Nacka Strand, Stockholm|Jan-Erik Richnau;Marianne Littke|10500|L
2026-11-23|48|Hällsnäs Hotell & Konferens|Mölnlycke||9900|F
2026-11-23|48|Lovik|Stockholm|Susann Swahn|10500|L
2026-11-23|48|Gottskär Hotell|Göteborg|Carl-Henrik Lagnefors;Petra Back|9900|F
2026-11-23|48|Fågelbro Säteri|Värmdö||9900|L
2026-11-30|49|Sundsgården Hotell & Konferens|Helsingborg|Emma Nilsson;Matti Kortelainen|9500|L
2026-11-30|49|Lovik|Stockholm|Josefin Born Nilsson;Lena Sobel|10500|L
2026-11-30|49|Söråkers Herrgård|Sundsvall/Timrå|Mirja Lindström;Pernilla Johansson|9900|L
2026-11-30|49|Hagastrand|Stockholm|Linda Strömberg;Robert Koss|10500|L
2026-12-07|50|Ringenäs|Halmstad|Annica Nordén;Patrik Lindén|9900|L
2026-12-07|50|Skogshem & Wijk|Lidingö|Maria Granander Andersson;Ulrika Palm|10500|L
2026-12-14|51|Hagastrand|Stockholm|Dan Nordlöf;Nedia Edsholt|10500|L
2027-01-18|3|Lovik|Stockholm||10500|L
2027-01-25|4|Hagastrand|Stockholm||10500|L
2027-01-25|4|Skogshem & Wijk|Lidingö||10500|L
2027-01-25|4|Tylebäck|Halmstad||9500|L
2027-01-25|4|Bykrogen|Kristianstad||9500|L
2027-02-01|5|Lovik|Stockholm||10500|L
2027-02-01|5|Bykrogen|Kristianstad||9500|L
2027-02-08|6|Tylebäck|Halmstad||9500|L
2027-02-08|6|Skogshem & Wijk|Lidingö||10500|L
2027-02-08|6|Bosön Mästarvillan|Lidingö||10500|L
2027-02-15|7|Sundsgården Hotell & Konferens|Helsingborg||9500|L
2027-02-15|7|Hagastrand|Stockholm||10500|L
2027-02-22|8|Lovik|Stockholm||10500|L
2027-02-22|8|Skogshem & Wijk|Lidingö||10500|L
2027-03-01|9|Ringenäs|Halmstad||9900|L
2027-03-08|10|Lovik|Stockholm||10500|L
2027-03-15|11|Bosön Mästarvillan|Lidingö||10500|L
2027-03-15|11|Hällsnäs Hotell & Konferens|Mölnlycke||9900|L
2027-03-15|11|Skogshem & Wijk|Lidingö||10500|L
2027-04-05|14|Skogshem & Wijk|Lidingö||10500|L
2027-04-05|14|Lovik|Stockholm||10500|L
2027-04-05|14|Tylebäck|Halmstad||9500|L
2027-04-05|14|Hällsnäs Hotell & Konferens|Mölnlycke||9900|L
2027-04-05|14|Gottskär Hotell|Göteborg||9900|L
2027-04-12|15|Lovik|Stockholm||10500|L
2027-04-12|15|Sundsgården Hotell & Konferens|Helsingborg||9500|L
2027-04-19|16|Skogshem & Wijk|Lidingö||10500|L
2027-04-19|16|Bykrogen|Kristianstad||9500|L
2027-04-19|16|Ringenäs|Halmstad||9900|L
2027-04-26|17|Lovik|Stockholm||10500|L
2027-04-26|17|Sundsgården Hotell & Konferens|Helsingborg||9500|L
2027-05-10|19|Söråkers Herrgård|Sundsvall/Timrå||9900|L
2027-05-10|19|Skogshem & Wijk|Lidingö||10500|L
2027-05-10|19|Sundsgården Hotell & Konferens|Helsingborg||9500|L
2027-05-10|19|Bosön Mästarvillan|Lidingö||10500|L
2027-05-10|19|Gottskär Hotell|Göteborg||9900|L
2027-05-17|20|Bosön Mästarvillan|Lidingö||10500|L
2027-05-24|21|Skogshem & Wijk|Lidingö||10500|L
2027-05-24|21|Bykrogen|Kristianstad||9500|L
2027-05-24|21|Hällsnäs Hotell & Konferens|Mölnlycke||9900|L
2027-05-31|22|Lovik|Stockholm||10500|L
2027-05-31|22|Skogshem & Wijk|Lidingö||10500|L
2027-06-07|23|Tylebäck|Halmstad||9500|L
2027-06-07|23|Bosön Mästarvillan|Lidingö||10500|L
2027-06-07|23|Skogshem & Wijk|Lidingö||10500|L
2027-06-14|24|Lovik|Stockholm||10500|L
2027-06-14|24|Skogshem & Wijk|Lidingö||10500|L
2027-06-14|24|Bykrogen|Kristianstad||9500|L
2027-06-14|24|Gottskär Hotell|Göteborg||9900|L
2027-06-28|26|Sundsgården Hotell & Konferens|Helsingborg||9500|L
2027-06-28|26|Skogshem & Wijk|Lidingö||10500|L
2027-06-28|26|Hällsnäs Hotell & Konferens|Mölnlycke||9900|L
2027-06-28|26|Söråkers Herrgård|Sundsvall/Timrå||9900|L
2027-06-28|26|Lovik|Stockholm||10500|L
2027-07-05|27|Lejondals Slott|Stockholm||10500|L
2027-08-16|33|Hagastrand|Stockholm||10500|L
2027-08-23|34|Gottskär Hotell|Göteborg||9900|L
2027-08-23|34|Lovik|Stockholm||10500|L
2027-08-30|35|Tylebäck|Halmstad||9500|L
2027-08-30|35|Bosön Mästarvillan|Lidingö||10500|L
2027-09-06|36|Sundsgården Hotell & Konferens|Helsingborg||9500|L
2027-09-20|38|Tylebäck|Halmstad||9500|L
2027-09-20|38|Gottskär Hotell|Göteborg||9900|L
2027-09-20|38|Skevik|Värmdö||9900|L
2027-09-20|38|Bykrogen|Kristianstad||9500|L
2027-09-27|39|Bykrogen|Kristianstad||9500|L
2027-10-04|40|Sundsgården Hotell & Konferens|Helsingborg||9500|L
2027-10-04|40|Lovik|Stockholm||10500|L
2027-10-11|41|Skogshem & Wijk|Lidingö||10500|L
2027-10-11|41|Tylebäck|Halmstad||9500|L
2027-10-18|42|Hällsnäs Hotell & Konferens|Mölnlycke||9900|L
2027-10-25|43|Sundsgården Hotell & Konferens|Helsingborg||9500|L
2027-10-25|43|Lovik|Stockholm||10500|L
2027-10-25|43|Skevik|Värmdö||9900|L
2027-10-25|43|Fågelbro Säteri|Värmdö||9900|L
2027-11-08|45|Tylebäck|Halmstad||9500|L
2027-11-08|45|Skogshem & Wijk|Lidingö||10500|L
2027-11-08|45|Lovik|Stockholm||10500|L
2027-11-15|46|Ringenäs|Halmstad||9900|L
2027-11-15|46|Fågelbro Säteri|Värmdö||9900|L
2027-11-22|47|Sundsgården Hotell & Konferens|Helsingborg||9500|L
2027-11-22|47|Gottskär Hotell|Göteborg||9900|L
2027-11-29|48|Hällsnäs Hotell & Konferens|Mölnlycke||9900|L
2027-11-29|48|Lovik|Stockholm||10500|L
2027-12-06|49|Sundsgården Hotell & Konferens|Helsingborg||9500|L
2027-12-06|49|Tylebäck|Halmstad||9500|L
2027-12-06|49|Skogshem & Wijk|Lidingö||10500|L
2027-12-06|49|Lovik|Stockholm||10500|L
2027-12-06|49|Söråkers Herrgård|Sundsvall/Timrå||9900|L
2027-12-06|49|Hagastrand|Stockholm||10500|L
2027-12-13|50|Skogshem & Wijk|Lidingö||10500|L
2027-12-13|50|Ringenäs|Halmstad||9900|L
2026-09-14|38|Mullsjö|Jönköping||0|L
2026-10-19|43|Mullsjö|Jönköping||0|L
2026-11-23|48|Mullsjö|Jönköping||0|L
2027-03-15|11|Mullsjö|Jönköping||0|L
2027-04-26|17|Mullsjö|Jönköping||0|L
2027-05-31|22|Mullsjö|Jönköping||0|L
2027-09-13|38|Mullsjö|Jönköping||0|L
2027-10-18|43|Mullsjö|Jönköping||0|L
2027-11-22|48|Mullsjö|Jönköping||0|L
`.trim();
