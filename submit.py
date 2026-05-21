import urllib.request
import json
import os

req = urllib.request.Request("http://127.0.0.1:8000/submit")
try:
    urllib.request.urlopen(req)
except Exception as e:
    pass
