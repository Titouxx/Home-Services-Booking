ALTER TABLE services
ADD COLUMN description VARCHAR(500);

UPDATE services SET description = 
'Complete cleaning service: deep cleaning, vacuuming, mopping, dusting and tidying up. Eco-friendly products used. Weekly or one-time packages available.'
WHERE id = 1;

UPDATE services SET description = 
'Full plumbing service including leak repairs, sanitary installations and emergency repairs. Our certified plumbers intervene within 24 hours.'
WHERE id = 2;

UPDATE services SET description = 
'Electrical installation and renovation compliant with NFC 15-100 standards. Troubleshooting, electrical panel, safety upgrades and home automation.'
WHERE id = 3;