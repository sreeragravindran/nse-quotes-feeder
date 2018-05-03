FAILURE from alpha vantage

ALBK 
LT 
ITC 
IFCI 
PEL 
MRF 
RCOM 
PVR 
MGL 
OIL 
IOC  


- alphavanate limits only one request / second from a specific api key 
- hence firing parellel requests results in error for a lot of them, although the behaviour is not consistent 
- even firing one request every second is not being served well 
- the more the delay between subsequent requests better is the success rate for the entire list of equities